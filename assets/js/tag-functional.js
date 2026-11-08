/* Nova Gulf — FUNCTIONAL / UX PREFERENCE tag layer (demonstration only).

   INERT BY DESIGN. First-party cookies carrying site-experience preferences and
   third-party widget identifiers (chat, payments-fraud, theme). No network
   request, nothing sent anywhere.

   TARGET CATEGORY: Performance & Functionality.
   EXPECTED SCANNER BEHAVIOUR: Securiti files UX/personalisation cookies here
   (NEXT_LOCALE, theme prefs, Zendesk, HubSpot chat). Stripe __stripe_mid and
   __stripe_sid are often Essential in the KB (fraud prevention) — a likely
   categorisation conflict to resolve by hand. Unknown names fall to
   Unclassified.

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

  // Theme / dark-mode preference: 1 year.
  seed("theme", "dark", 31536000);
  seed("NEXT_LOCALE", "en", 31536000);

  // Stripe.js: __stripe_mid 1 year, __stripe_sid 30 minutes.
  seed("__stripe_mid", uuid() + hex(6), 31536000);
  seed("__stripe_sid", uuid() + hex(6), 1800);

  // HubSpot chat widget: messagesUtk, 180 days.
  seed("messagesUtk", hex(32), 15552000);

  // Zendesk Web Widget / Chat: __zlcmid, 1 year.
  seed("__zlcmid", alnum(15), 31536000);
})();
