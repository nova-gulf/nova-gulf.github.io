/* Nova Gulf — MARKETING AUTOMATION tag layer (demonstration only).

   INERT BY DESIGN. First-party cookies with the real names and formats written by
   HubSpot, Pardot and Marketo tracking scripts. No network request, nothing sent
   anywhere.

   TARGET CATEGORY: Advertising (marketing/targeting, plus Google NID/IDE) — Securiti usually files
   __hstc, hubspotutk, _mkto_trk, visitor_id*, lidc here.
   EXPECTED SCANNER BEHAVIOUR: mostly Advertising; some may land in Analytics &
   Customization. This is a separate initiator from tag-advertising.js so a
   mixed result can be resolved per script. Move by hand if needed.

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

  // HubSpot: hubspotutk 180 days; __hstc 180 days (domain.hash.first.prev.last.count).
  seed("hubspotutk", hex(32), 15552000);
  seed("__hstc", digits(9) + "." + hex(32) + "." + ms + "." + ms + "." + ms + ".1", 15552000);

  // Salesforce Pardot: visitor_id<account> 10 years.
  seed("visitor_id" + "812345", hex(32), 315360000);

  // Marketo Munchkin: _mkto_trk, 2 years.
  seed("_mkto_trk", "id:" + digits(3) + "-" + alnum(3).toUpperCase().replace(/[-_]/g, "X") + "-" + digits(3) + "&token:_mch-" + "novagulf.example-" + ms + "-" + digits(5), 63072000);

  // LinkedIn (Insight/ads routing): lidc 24 hours.
  seed("lidc", "b=TGST" + digits(2) + ":s=V:r=V:a=V:p=V:g=" + digits(4) + ":u=1:x=1:i=" + sec + ":t=" + (sec + 86400), 86400);

  // Google ads/personalisation (as written by embedded Google services):
  // NID 6 months, IDE 13 months.
  seed("NID", "511=" + alnum(100), 15552000);
  seed("IDE", alnum(43), 34186000);
})();
