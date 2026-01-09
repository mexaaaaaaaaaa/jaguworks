import { useLayoutEffect } from "react";

const OAUTH_HASH_KEYS = [
  "error",
  "error_description",
  "access_token",
  "refresh_token",
  "id_token",
  "token_type",
  "expires_in",
  "provider_token",
  "code",
  "type",
];

/**
 * Fixes OAuth redirects that land on hash fragments like `#error=...`.
 * With HashRouter, such hashes are interpreted as routes (and can trigger 404).
 */
const OAuthRedirectGuard = () => {
  useLayoutEffect(() => {
    const rawHash = window.location.hash || "";

    // Fix common typo route from mis-redirects: `#/autl` -> `#/auth`
    if (rawHash.startsWith("#/autl")) {
      window.location.hash = rawHash.replace(/^#\/autl/, "/auth").slice(1);
      return;
    }

    // Some providers/configs may redirect to `/auth` without a hash.
    // Normalize to HashRouter so the `/auth` route is reachable.
    if (window.location.pathname.endsWith("/auth") && (!rawHash || rawHash === "#")) {
      window.location.hash = "/auth";
      return;
    }

    // If we get a hash like `#error=...` (no `#/route`), rewrite to `#/auth?...`.
    if (rawHash && !rawHash.startsWith("#/")) {
      const params = new URLSearchParams(rawHash.slice(1));
      const hasOAuthParams = OAUTH_HASH_KEYS.some((k) => params.has(k));

      if (hasOAuthParams) {
        const qs = params.toString();
        window.location.hash = `/auth${qs ? `?${qs}` : ""}`;
      }
    }
  }, []);

  return null;
};

export default OAuthRedirectGuard;
