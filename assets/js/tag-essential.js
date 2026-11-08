/* Nova Gulf — ESSENTIAL (strictly necessary) tag layer (demonstration only).

   INERT BY DESIGN. Writes first-party cookies with the real names and shapes of
   session, CSRF, bot-management and locale cookies. No network request, nothing
   sent anywhere.

   TARGET CATEGORY: Essential.
   EXPECTED SCANNER BEHAVIOUR: Securiti normally files these as Essential
   (XSRF-TOKEN, PHPSESSID, JSESSIONID, csrftoken, __cf_bm, cf_clearance,
   _GRECAPTCHA are well-known). Essential cookies are never blocked. Any that
   land elsewhere should be moved by hand in Categorize Cookies.

   SELF-CONTAINED ON PURPOSE — see the note in tag-analytics.js. */

(function () {
  "use strict";

  function has(name) {
    return document.cookie.split("; ").some(function (c) {
      return c.split("=")[0] === name;
    });
  }

  function set(name, value, maxAgeSeconds) {
    document.cookie =
      name + "=" + value + "; path=/; max-age=" + maxAgeSeconds + "; SameSite=Lax";
  }

  function seed(name, value, maxAgeSeconds) {
    if (!has(name)) set(name, value, maxAgeSeconds);
  }

  function digits(n) {
    var out = "";
    for (var i = 0; i < n; i++) out += Math.floor(Math.random() * 10);
    return out;
  }

  function hex(n) {
    var chars = "0123456789abcdef", out = "";
    for (var i = 0; i < n; i++) out += chars[Math.floor(Math.random() * 16)];
    return out;
  }

  function uuid() {
    return hex(8) + "-" + hex(4) + "-" + hex(4) + "-" + hex(4) + "-" + hex(12);
  }

  function alnum(n) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_", out = "";
    for (var i = 0; i < n; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  }

  var sec = Math.floor(Date.now() / 1000);
  var ms = Date.now();

  // Session ids: session cookies (no max-age = deleted on browser close).
  function session(name, value) {
    if (!has(name)) document.cookie = name + "=" + value + "; path=/; SameSite=Lax";
  }
  session("PHPSESSID", alnum(26).replace(/[-_]/g, "a").toLowerCase());
  session("JSESSIONID", hex(32).toUpperCase());

  // CSRF: XSRF-TOKEN session, csrftoken 1 year (Django default 31449600).
  session("XSRF-TOKEN", alnum(40));
  seed("csrftoken", alnum(64), 31449600);

  // Cloudflare bot management: __cf_bm 30 min; cf_clearance 1 year.
  seed("__cf_bm", alnum(43) + "." + sec + "-1.0.1.1-" + alnum(86), 1800);
  seed("cf_clearance", alnum(43) + "-" + sec + "-1.0.1.1-" + alnum(80), 31536000);

  // Google reCAPTCHA: _GRECAPTCHA, 6 months.
  seed("_GRECAPTCHA", "09A" + alnum(100), 15552000);

  // Language preference: 1 year.
  seed("lang", "en", 31536000);
})();
