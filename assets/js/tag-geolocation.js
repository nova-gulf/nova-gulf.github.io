/* Nova Gulf — PRECISE GEOLOCATION tag layer (demonstration only).

   INERT BY DESIGN. Writes first-party cookies holding RANDOM coordinates inside
   the Gulf region. The browser Geolocation API is never called and no real
   location is read.

   TARGET CATEGORY: Precise Geolocation.
   EXPECTED SCANNER BEHAVIOUR: no vendor standard — the KB will probably not
   know these names (Unclassified). Assign them to Precise Geolocation by hand
   in Categorize Cookies.

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

  // Random point roughly within 22.0-26.5 N, 50.5-56.5 E (Qatar/UAE area).
  var lat = (22 + Math.random() * 4.5).toFixed(6);
  var lng = (50.5 + Math.random() * 6).toFixed(6);

  // user_location : 30 days.
  seed("user_location", lat + "," + lng, 2592000);
  // userLatLng : 30 days (URL-encoded JSON).
  seed("userLatLng", encodeURIComponent("{\"lat\":" + lat + ",\"lng\":" + lng + "}"), 2592000);
  // geoloc : 7 days.
  seed("geoloc", "lat=" + lat + "&lon=" + lng + "&acc=" + (5 + Math.floor(Math.random() * 20)), 604800);
  // geo_consent : 1 year.
  seed("geo_consent", "granted", 31536000);
})();
