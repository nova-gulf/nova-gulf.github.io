/* Nova Gulf — PERFORMANCE & FUNCTIONALITY tag layer (demonstration only).

   INERT BY DESIGN. Writes first-party cookies using the real names that AWS
   Application Load Balancer, Azure App Service and Hotjar use for session
   affinity and first-visit detection, in their real value formats and
   lifetimes. No network request is made and nothing is sent anywhere.

   SELF-CONTAINED ON PURPOSE — see the note in tag-analytics.js.

   NOTE ON THIS CATEGORY: Performance & Functionality is the hardest of the five
   to hit from first-party names alone, because most of the well-known ones
   belong to infrastructure a static host does not have. If the scan puts some of
   these somewhere else, move them by hand — a manual categorization sticks for
   every future scan of the same domain. */

(function () {
  "use strict";

  var INTERCOM_APP = "kq8v2n1p";  // shape of an Intercom app id; not a real workspace

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

  function hex(n) {
    var chars = "0123456789abcdef", out = "";
    for (var i = 0; i < n; i++) out += chars[Math.floor(Math.random() * 16)];
    return out;
  }

  function b64ish(n) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var out = "";
    for (var i = 0; i < n; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  }

  // --- AWS Application Load Balancer session affinity ----------------------
  // AWSALB / AWSALBCORS : 7 days. The CORS variant exists because the original
  // predates SameSite=None; real deployments always carry both.
  var albValue = b64ish(108) + "%3D%3D";
  set("AWSALB", albValue, 604800);
  set("AWSALBCORS", albValue, 604800);

  // --- Azure App Service instance affinity ---------------------------------
  // ARRAffinity / ARRAffinitySameSite : session cookie, no max-age.
  var arr = hex(40);
  document.cookie = "ARRAffinity=" + arr + "; path=/; SameSite=Lax";
  document.cookie = "ARRAffinitySameSite=" + arr + "; path=/; SameSite=Lax";

  // --- Hotjar first-visit detection ---------------------------------------
  // _hjFirstSeen : 30 minutes. 1 on a first session, 0 afterwards.
  set("_hjFirstSeen", has("_hjFirstSeen") ? "0" : "1", 1800);

  // --- Intercom messenger --------------------------------------------------
  // intercom-id-<app> : 9 months.  intercom-session-<app> : 7 days.
  seed(
    "intercom-id-" + INTERCOM_APP,
    hex(8) + "-" + hex(4) + "-" + hex(4) + "-" + hex(4) + "-" + hex(12),
    23328000
  );
  set("intercom-session-" + INTERCOM_APP, b64ish(40) + "%3D%3D", 604800);
})();
