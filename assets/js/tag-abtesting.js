/* Nova Gulf — A/B TESTING & PERSONALISATION tag layer (demonstration only).

   INERT BY DESIGN. First-party cookies with the real names of Optimizely, VWO and
   Adobe (Experience Cloud ID, Analytics, Target) cookies. No network request,
   nothing sent anywhere.

   TARGET CATEGORY: Analytics & Customization.
   EXPECTED SCANNER BEHAVIOUR: Securiti typically files optimizelyEndUserId,
   _vwo_uuid_v2, AMCV_*, s_cc, s_fid and mbox under Analytics & Customization.
   Any that fall to Unclassified or Performance should be moved by hand.

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

  // Optimizely: optimizelyEndUserId, 6 months.
  seed("optimizelyEndUserId", "oeu" + ms + "r" + Math.random().toString().slice(2, 12), 15552000);

  // VWO: _vwo_uuid_v2, 1 year (uppercase hex + "|" + hex).
  seed("_vwo_uuid_v2", hex(32).toUpperCase() + "|" + hex(32), 31536000);

  // Adobe Experience Cloud ID (AMCV_<ORG>@AdobeOrg), 2 years.
  seed("AMCV_" + "A1B2C3D4E5F6A7B8C9D0E1F2" + "%40AdobeOrg", "MCMID|" + digits(38), 63072000);
  // Adobe Analytics: s_cc session cookie "true", s_fid 2 years.
  seed("s_cc", "true", 1800);
  seed("s_fid", hex(16).toUpperCase() + "-" + hex(16).toUpperCase(), 63072000);

  // Adobe Target: mbox, 2 years (session#id#expiry).
  seed("mbox", "session#" + hex(32) + "-" + digits(6) + "#" + (sec + 1800), 63072000);
})();
