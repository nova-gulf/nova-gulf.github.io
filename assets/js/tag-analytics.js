/* Nova Gulf — ANALYTICS & CUSTOMIZATIONS tag layer (demonstration only).

   INERT BY DESIGN. This file writes first-party cookies using the real names
   that Google Analytics, Microsoft Clarity and Hotjar use, in their real value
   formats and with their real lifetimes. It makes NO network request, sends
   nothing anywhere, and the values are random per browser. Nothing is measured
   and nothing is reported. The point is to give a cookie scanner something
   real to find and classify.

   WHY THIS FILE IS SELF-CONTAINED: Securiti's auto-blocking blocks at the
   INITIATOR SCRIPT level, and a single script that drops cookies spanning more
   than one category raises a categorization conflict you must then resolve by
   hand. One script per category keeps the initiator-to-category mapping 1:1, so
   blocking is clean and "accept Analytics only" actually behaves. Do NOT factor
   the shared helpers out into a common file — the common file would become the
   initiator for every category and collapse that mapping.
   See: helpcenter.securiti.ai/docs/resolving-cookie-categorization-conflicts-in-auto-blocking */

(function () {
  "use strict";

  var GA4_STREAM = "NG7K2QX4LP";  // shape of a GA4 measurement id; not a real property
  var HJ_SITE = "3184427";        // shape of a Hotjar site id; not a real site

  function has(name) {
    return document.cookie.split("; ").some(function (c) {
      return c.split("=")[0] === name;
    });
  }

  function set(name, value, maxAgeSeconds) {
    document.cookie =
      name + "=" + value + "; path=/; max-age=" + maxAgeSeconds + "; SameSite=Lax";
  }

  /* Real tags do not re-mint an identifier they already hold. Matching that
     matters: a cookie whose value changes on every load looks like a bug to
     anyone inspecting, and breaks the "returning visitor" story. */
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

  // --- Google Analytics 4 -------------------------------------------------
  // _ga  : client id, 2 years.   GA1.1.<random>.<first-seen unix seconds>
  seed("_ga", "GA1.1." + digits(9) + "." + sec, 63072000);
  // _ga_<STREAM> : session state, 2 years.
  seed("_ga_" + GA4_STREAM, "GS1.1." + sec + ".1.1." + sec + ".0.0.0", 63072000);
  // _gid : 24 hours. Refreshed every load, exactly as the real tag does.
  set("_gid", "GA1.1." + digits(9) + "." + sec, 86400);

  // --- Microsoft Clarity ---------------------------------------------------
  // _clck : user id, 1 year.
  seed("_clck", hex(10) + "%7C1%7Cfx1%7C0", 31536000);
  // _clsk : session, 1 day.
  set("_clsk", hex(10) + "%7C" + Date.now() + "%7C1%7C1", 86400);

  // --- Hotjar --------------------------------------------------------------
  // _hjSessionUser_<site> : 1 year, base64 of a small JSON object.
  seed(
    "_hjSessionUser_" + HJ_SITE,
    btoa('{"id":"' + hex(8) + '-' + hex(4) + '-' + hex(4) + '","created":' + Date.now() + ',"existing":true}'),
    31536000
  );
  // _hjSession_<site> : 30 minutes.
  set(
    "_hjSession_" + HJ_SITE,
    btoa('{"id":"' + hex(8) + '-' + hex(4) + '","c":' + Date.now() + ',"s":0,"r":0}'),
    1800
  );
})();
