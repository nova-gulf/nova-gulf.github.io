/* Nova Gulf — ADVERTISING tag layer (demonstration only).

   INERT BY DESIGN. Writes first-party cookies using the real names that Google
   Ads, the Meta pixel, Microsoft UET and the Reddit pixel use, in their real
   value formats and lifetimes. No network request is made, nothing is sent
   anywhere, and every value is random per browser. No ad platform receives
   anything, because nothing is contacted.

   SELF-CONTAINED ON PURPOSE — see the note in tag-analytics.js. One initiator
   script per cookie category is what keeps auto-blocking conflict-free. */

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

  var sec = Math.floor(Date.now() / 1000);
  var ms = Date.now();

  // --- Google Ads conversion linker ---------------------------------------
  // _gcl_au : 90 days.   1.1.<random>.<unix seconds>
  seed("_gcl_au", "1.1." + digits(9) + "." + sec, 7776000);

  // --- Meta (Facebook) pixel ----------------------------------------------
  // _fbp : 90 days.   fb.1.<unix milliseconds>.<random>
  seed("_fbp", "fb.1." + ms + "." + digits(10), 7776000);

  // --- Microsoft UET (Bing Ads) -------------------------------------------
  // _uetsid : session, 1 day.  _uetvid : visitor, 390 days.
  set("_uetsid", hex(32), 86400);
  seed("_uetvid", hex(32), 33696000);

  // --- Reddit pixel --------------------------------------------------------
  // _rdt_uuid : 90 days.   <unix milliseconds>.<uuid>
  seed(
    "_rdt_uuid",
    ms + "." + hex(8) + "-" + hex(4) + "-" + hex(4) + "-" + hex(4) + "-" + hex(12),
    7776000
  );
})();
