/* Nova Gulf — UNCLASSIFIED app-specific tag layer (demonstration only).

   INERT BY DESIGN. Cookies with invented Nova Gulf application names that
   Securiti knowledge base will NOT recognise. Random values, no network request.

   TARGET CATEGORY: none on purpose (Unclassified).
   EXPECTED SCANNER BEHAVIOUR: all three appear as Unclassified, demonstrating
   the manual categorisation workflow (assign one, and the choice is retained
   for future scans of the domain).

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

  // ng_visitor_seg : 90 days.
  seed("ng_visitor_seg", "seg" + digits(2) + "-" + hex(6), 7776000);
  // ngx_ref_q7 : 30 days.
  seed("ngx_ref_q7", hex(12), 2592000);
  // _ngfp_a1 : 1 year.
  seed("_ngfp_a1", hex(24), 31536000);
})();
