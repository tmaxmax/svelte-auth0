/// <reference types="svelte" />
import { SvelteComponentTyped } from 'svelte'

interface Auth0ContextProps {
  /**
   * The Auth0 domain.
   */
  domain: string
  /**
   * The Auth0 client ID.
   */
  client_id: string
  /**
   * The default audience to be used for requesting API access.
   */
  audience: string
  /**
   * Redirect URL for after login.
   *
   * @default window.location.href
   */
  callback_url?: string
  /**
   * Redirect URL for after logout.
   * 
   * @default window.location.href
   */
  logout_url?: string
}

export class Auth0Context extends SvelteComponentTyped<Auth0ContextProps, {}, { default: {} }> {}

interface Auth0LoginButtonProps {
  /**
   * Additional HTML classes to apply to the underlying button.
   */
  class?: string
  /**
   * Override for the context's login redirect URL.
   */
  callback_url?: string
  /**
   * Tell the callback handler to return to the current URL after login.
   * 
   * @default true 
   */
  preserveRoute?: boolean
}

export class Auth0LoginButton extends SvelteComponentTyped<Auth0LoginButtonProps, {}, { default: {} }> {}

interface Auth0LogoutButtonProps {
  /**
   * Additional HTML classes to apply to the underlying button.
   */
  class?: string
  /**
   * Override for the context's logout redirect URL.
   */
  logout_url?: string
}

export class Auth0LogoutButton extends SvelteComponentTyped<Auth0LogoutButtonProps, {}, { default: {} }> {}