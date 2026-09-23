/* Nova Gulf — SOCIAL NETWORKING tag layer (demonstration only).

   INERT BY DESIGN. Writes first-party cookies using the real names that the
   LinkedIn, TikTok, Pinterest and Snapchat first-party pixels use. No network
   request is made, nothing is sent anywhere, and no social platform is
   contacted — these are the cookies those pixels write onto YOUR domain, which
   is why they can be reproduced first-party at all.

   SELF-CONTAINED ON PURPOSE — see the note in tag-analytics.js.

   ⚠️ EXPECT TO MOVE THESE BY HAND. Securiti's categorization doc states that it
   "does not push any cookies or trackers into this cookie category. However, you
   can manually move or assign relevant cookies or trackers here to suit." So the
   scan will most likely file these under Advertising, and Social Networking stays
   empty until you move them in the Categorize Cookies tab. That is a one-time
   job: Securiti retains a manual categorization for every future scan of the same
   domain and stops consulting the knowledge base for those specific cookies.

   Keeping them in their own initiator script is what makes that move safe — the
   whole script goes to Social Networking together, with no conflict against any
   other category.
   See: helpcenter.securiti.ai/docs/understanding-how-securiti-categorizes-cookies-and-trackers */

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

  function hex(n) {
    var chars = "0123456789abcdef", out = "";
    for (var i = 0; i < n; i++) out += chars[Math.floor(Math.random() * 16)];
    return out;
  }

  function uuid() {
    return hex(8) + "-" + hex(4) + "-" + hex(4) + "-" + hex(4) + "-" + hex(12);
  }

  // --- LinkedIn Insight, first-party half ----------------------------------
  // li_fat_id : 30 days.
  seed("li_fat_id", uuid(), 2592000);

  // --- TikTok pixel --------------------------------------------------------
  // _ttp : 390 days.
  seed("_ttp", hex(26), 33696000);

  // --- Pinterest tag -------------------------------------------------------
  // _pin_unauth : 1 year. Base64 of "uid=<uuid>".
  seed("_pin_unauth", btoa("uid=" + uuid()), 31536000);

  // --- Snapchat pixel ------------------------------------------------------
  // _scid : 13 months.  _scid_r : the same id, read-side.
  var scid = uuid();
  seed("_scid", scid, 34186000);
  seed("_scid_r", scid, 34186000);
})();
