/* Nova Gulf — THIRD-PARTY EMBED PREFERENCE tag layer (demonstration only).

   INERT BY DESIGN. First-party reproductions of cookies that YouTube/Google,
   Vimeo and map embeds write. No network request, no iframe, nothing sent
   anywhere.

   TARGET CATEGORY: Performance & Functionality (player and map preferences).
   EXPECTED SCANNER BEHAVIOUR: yt-remote-device-id and vuid are usually filed
   under Performance & Functionality (or Advertising for YouTube). map_layer_pref
   is not a vendor name and will be Unclassified — assign by hand.
   (Google NID/IDE live in tag-marketing-automation.js, the advertising-intent
   script, to keep this one single-category.)

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

  // YouTube player: yt-remote-device-id, yt-player-volume (persistent in storage;
  // reproduced as cookies here), 1 year.
  seed("yt-remote-device-id", "%5B%22" + alnum(11) + "%22%5D", 31536000);

  // Vimeo player: vuid, 2 years (digits.digits).
  seed("vuid", digits(9) + "." + digits(9), 63072000);

  // Maps embed preference: last-chosen map layer, 1 year.
  seed("map_layer_pref", "roadmap", 31536000);
})();
