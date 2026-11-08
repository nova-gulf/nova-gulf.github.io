/* Nova Gulf — BIOMETRICS tag layer (demonstration only).

   INERT BY DESIGN. Cookies representing biometric-authentication STATE. There is
   NO vendor standard for these names and NO biometric data is captured or
   processed; WebAuthn/Face ID are never invoked. Values are random.

   TARGET CATEGORY: Biometrics.
   EXPECTED SCANNER BEHAVIOUR: the KB will not know these names, so they will
   appear as Unclassified. MANUALLY CATEGORISE them to Biometrics in Categorize
   Cookies.

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

  // webauthn_cred_id : 90 days (base64url credential id).
  seed("webauthn_cred_id", alnum(43), 7776000);
  // bio_auth_token : 1 hour.
  seed("bio_auth_token", hex(48), 3600);
  // face_id_enrolled : 1 year.
  seed("face_id_enrolled", "1", 31536000);
})();
