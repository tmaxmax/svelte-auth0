import { writable } from "svelte/store";

/**
 * Stores
 */
export const isLoading = writable(true);
export const isAuthenticated = writable(false);
export const authToken = writable("");
export const idToken = writable("");
export const userInfo = writable({});
export const authError = writable(null);

/**
 * Context Keys
 *
 * using an object literal means the keys are guaranteed not to conflict in any circumstance (since an object only has
 * referential equality to itself, i.e. {} !== {} whereas "x" === "x"), even when you have multiple different contexts
 * operating across many component layers.
 */
export const AUTH0_CONTEXT_CLIENT_PROMISE = {};
export const AUTH0_CONTEXT_CALLBACK_URL = {};
export const AUTH0_CONTEXT_LOGOUT_URL = {};

/** @typedef {import('@auth0/auth0-spa-js').Auth0Client} Auth0Client */

/**
 * Refresh the authToken store.
 *
 * @param {Promise<Auth0Client>} auth0Promise
 */
export async function refreshToken(auth0Promise) {
  const auth0 = await auth0Promise;
  const token = await auth0.getTokenSilently();
  authToken.set(token);
}

/**
 * Initiate Register/Login flow.
 *
 * @param {Promise<Auth0Client>} auth0Promise
 * @param {boolean} preserveRoute - store current location so callback handler will navigate back to it.
 * @param {string} callback_url - explicit path to use for the callback.
 */
export async function login(auth0Promise, preserveRoute = true, callback_url) {
  console.log("login", { preserveRoute, callback_url });
  const auth0 = await auth0Promise;
  const redirect_uri = callback_url || window.location.href;

  // try to keep the user on the same page from which they triggered login. If set to false should typically
  // cause redirect to /.
  const appState = (preserveRoute)
    ? { pathname: window.location.pathname, search: window.location.search }
    : {};
  await auth0.loginWithRedirect({
    appState,
    authorizationParams: { redirect_uri },
  });
}

/**
 * Log out the current user.
 *
 * @param {Promise<Auth0Client>} auth0Promise
 * @param {string} logout_url - specify the url to return to after login.
 */
export async function logout(auth0Promise, logout_url) {
  console.log("logout", { logout_url });
  const auth0 = await auth0Promise;
  const returnTo = logout_url || window.location.href;
  authToken.set("");
  auth0.logout({ logoutParams: { returnTo } });
}
