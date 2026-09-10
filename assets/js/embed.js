/* Nova Gulf — DSR form embed helper.

   Layout note: the "open the form directly" panel is layered BEHIND the iframe
   in CSS, not toggled by script. A frame the privacy platform refuses to serve
   renders transparent, so the panel shows through; a frame that loads paints its
   own opaque background over it. That is deliberate — a blocked frame and a
   loaded one are indistinguishable to script, because both throw SecurityError
   on any same-origin property access.

   This file adds no chrome to the page. It listens for the platform's submission
   signal and, only if one arrives, inserts a confirmation bar above the form.
   The signal fires when it is enabled on the form and this domain is on the
   form's embeddable-domains allow-list. */
(function () {
  'use strict';

  var PLATFORM_ORIGIN = 'https://privacy-central.securiti.ai';

  window.addEventListener('message', function (event) {
    if (event.origin !== PLATFORM_ORIGIN) { return; }
    var data = event.data;
    if (!data || data.sec_signal_identifier !== 'sec-dsr-submission-success') { return; }

    var shell = document.querySelector('.embed-shell');
    if (!shell || shell.querySelector('.embed-note-ok')) { return; }

    var bar = document.createElement('div');
    bar.className = 'embed-note embed-note-ok';
    bar.setAttribute('role', 'status');
    bar.textContent = 'Your request has been submitted. Check your email to verify it.';
    shell.insertBefore(bar, shell.firstChild);
  });
})();
