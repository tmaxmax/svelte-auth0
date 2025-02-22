<script>
	import { createAuth0Client } from '@auth0/auth0-spa-js';
	import { onMount, onDestroy, setContext } from 'svelte';
	import {
		AUTH0_CONTEXT_CALLBACK_URL,
		AUTH0_CONTEXT_CLIENT_PROMISE,
		AUTH0_CONTEXT_LOGOUT_URL,
		refreshToken,
		isAuthenticated,
		isLoading,
		authError,
		userInfo,
		idToken,
	} from './auth0';

	// props.
	export let domain;
	export let client_id;
	export let audience;

	// defaults to a build time speco
	export let callback_url;
	export let logout_url;

	setContext(AUTH0_CONTEXT_CALLBACK_URL, callback_url);
	setContext(AUTH0_CONTEXT_LOGOUT_URL, logout_url);

	// constants
	// TODO: parse JWT token and get token's actual expiration time.
	const refreshRate = 10 * 60 * 60 * 1000;

	// locals
	let tokenRefreshIntervalId;

	// getContext doesn't seem to return a value in OnMount, so we'll pass the auth0Promise around by reference.
	let auth0Promise = createAuth0Client({ clientId: client_id, domain, authorizationParams: { audience } });
	setContext(AUTH0_CONTEXT_CLIENT_PROMISE, auth0Promise);

	async function handleOnMount() {
		// on run onMount after auth0
		const auth0 = await auth0Promise;

		// Not all browsers support this, please program defensively!
		const params = new URLSearchParams(window.location.search);

		// Check if something went wrong during login redirect
		// and extract the error message
		if (params.has('error')) {
			authError.set(new Error(params.get('error_description')));
		}

		// if code then login success
		if (params.has('code')) {
			// Let the Auth0 SDK do it's stuff - save some state, etc.
			const { appState } = await auth0.handleRedirectCallback();
			// Can be smart here and redirect to original path instead of root
			const url =
				appState.pathname || appState.search
					? `${appState.pathname}${appState.search}`
					: '';
			// redirect to the last page we were on when login was configured if it was passed.
			if (url) {
				history.replaceState({}, '', url);
			}
			// location.href = url;
			// clear errors on login.
			authError.set(null);
		}

		const _isAuthenticated = await auth0.isAuthenticated();
		isAuthenticated.set(_isAuthenticated);

		if (_isAuthenticated) {
			// fetch the user info
			const user = await auth0.getUser();
			userInfo.set(user);
			// fetch the token claims
			const idTokenClaims = await auth0.getIdTokenClaims();
			idToken.set(idTokenClaims.__raw);
			// automatically keep a curent token.
			refreshToken(auth0Promise);
			tokenRefreshIntervalId = setInterval(refreshToken, refreshRate);
		}
		isLoading.set(false);
	}

	// clear token refresh on Destroy so we're not leaking intervals.
	async function handleOnDestroy() {
		clearInterval(tokenRefreshIntervalId);
	}

	onMount(handleOnMount);
	onDestroy(handleOnDestroy);
</script>

<!-- Auth0 use client_id and domain props to configure.  -->
<slot />
