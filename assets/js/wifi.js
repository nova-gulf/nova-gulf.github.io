/* Nova Gulf — Guest Wi-Fi registration (static demo).

   Client-side only: nothing is stored or transmitted, and no Wi-Fi session is
   created. The point of the page is the record it would have produced, so on
   submit it renders that record: the identity fields, and one row per purpose
   with the lawful basis and the visitor's decision.

   Why the purposes live in a table here rather than being read off the DOM:
   each one carries a basis and a retention period that the checkbox itself does
   not know. Keep this list and the page's "What we do with each thing" table in
   step — if they disagree, the page is telling the visitor two different things. */

const WIFI_CONFIG = {
  organizationName: "Nova Gulf",
  ssid: "NOVAGULF-GUEST",
  // Purposes the visitor chooses, in the order they appear on the form.
  // `field` must match the checkbox name attribute.
  purposes: [
    { field: "consent-email-marketing", label: "Marketing by email", basis: "Consent" },
    { field: "consent-sms-marketing", label: "Marketing by SMS or WhatsApp", basis: "Consent" },
    { field: "consent-analytics", label: "Venue analytics", basis: "Consent" },
    { field: "consent-partners", label: "Sharing with partners at this location", basis: "Consent" },
  ],
};

(function () {
  "use strict";

  const form = document.getElementById("wifi-form");
  const panel = document.getElementById("confirm-panel");
  const errorEl = document.getElementById("form-error");
  let lastSession = null;

  function showError(text) {
    errorEl.textContent = text;
    errorEl.classList.add("visible");
    errorEl.scrollIntoView({ block: "nearest" });
  }

  function clearError() {
    errorEl.textContent = "";
    errorEl.classList.remove("visible");
  }

  function makeReference() {
    const year = new Date().getFullYear();
    const digits = String(Math.floor(100000 + Math.random() * 900000));
    return "WIFI-" + year + "-" + digits;
  }

  /* A stand-in for the device identifier a real captive portal would already
     hold before the visitor typed anything. Generated, never collected. */
  function fakeDeviceId() {
    const hex = "0123456789ABCDEF";
    let out = [];
    for (let i = 0; i < 6; i++) {
      out.push(hex[Math.floor(Math.random() * 16)] + hex[Math.floor(Math.random() * 16)]);
    }
    return out.join(":");
  }

  function addRows(tbody, rows) {
    tbody.innerHTML = "";
    rows.forEach(function (cells) {
      const tr = document.createElement("tr");
      cells.forEach(function (value, index) {
        const cell = document.createElement(index === 0 ? "th" : "td");
        if (index === 0) cell.scope = "row";
        cell.textContent = value;
        tr.appendChild(cell);
      });
      tbody.appendChild(tr);
    });
  }

  function renderSummary(s) {
    const session = [
      ["Reference", s.reference],
      ["Network", s.ssid],
      ["Connected", s.submittedAt],
      ["Device identifier", s.deviceId],
      ["Name", s.name],
      ["Mobile", s.mobile],
    ];
    if (s.email) session.push(["Email", s.email]);
    if (s.company) session.push(["Company", s.company]);
    session.push(["Here as", s.visitType]);
    session.push(["Location", s.location]);
    addRows(document.getElementById("confirm-session-body"), session);

    const consent = [
      ["Network access and session records", "Legal obligation", "Accepted — required for access"],
    ];
    WIFI_CONFIG.purposes.forEach(function (p) {
      consent.push([p.label, p.basis, s.choices[p.field] ? "Granted" : "Not granted"]);
    });
    addRows(document.getElementById("confirm-consent-body"), consent);

    document.getElementById("confirm-ref").textContent = s.reference;
  }

  function formatSession(s) {
    const lines = [];
    lines.push("Guest Wi-Fi registration — " + WIFI_CONFIG.organizationName);
    lines.push("Reference: " + s.reference);
    lines.push("Network: " + s.ssid);
    lines.push("Connected: " + s.submittedAt);
    lines.push("Device identifier: " + s.deviceId);
    lines.push("");
    lines.push("Name: " + s.name);
    lines.push("Mobile: " + s.mobile);
    if (s.email) lines.push("Email: " + s.email);
    if (s.company) lines.push("Company: " + s.company);
    lines.push("Here as: " + s.visitType);
    lines.push("Location: " + s.location);
    lines.push("");
    lines.push("Consent");
    lines.push("  Network access and session records (Legal obligation): Accepted");
    WIFI_CONFIG.purposes.forEach(function (p) {
      lines.push(
        "  " + p.label + " (" + p.basis + "): " +
        (s.choices[p.field] ? "Granted" : "Not granted")
      );
    });
    return lines.join("\n");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearError();

    const first = form.elements["first-name"].value.trim();
    const last = form.elements["last-name"].value.trim();
    const mobile = form.elements["mobile"].value.trim();
    const email = form.elements["email"].value.trim();
    const company = form.elements["company"].value.trim();
    const visitType = form.elements["visit-type"].value;
    const location = form.elements["location"].value;

    if (!first) return showError("Please enter your first name.");
    if (!last) return showError("Please enter your last name.");
    if (!mobile || mobile.replace(/[^0-9]/g, "").length < 7)
      return showError("Please enter a mobile number we can send your access code to.");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return showError("That email address does not look right. Leave it blank if you prefer.");
    if (!visitType) return showError("Please tell us what brings you here.");
    if (!location) return showError("Please choose your location.");
    if (!form.elements["consent-terms"].checked)
      return showError("Accepting the Acceptable Use Policy is required for access.");

    const choices = {};
    WIFI_CONFIG.purposes.forEach(function (p) {
      choices[p.field] = form.elements[p.field].checked;
    });

    /* An email-only purpose with no email address is a record that cannot be
       acted on. Catch it here rather than storing a promise we cannot keep. */
    if (!email && (choices["consent-email-marketing"] || choices["consent-partners"])) {
      return showError(
        "You chose an option that needs an email address. Add one above, or untick it."
      );
    }

    lastSession = {
      reference: makeReference(),
      ssid: WIFI_CONFIG.ssid,
      submittedAt: new Date().toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
      deviceId: fakeDeviceId(),
      name: first + " " + last,
      mobile: mobile,
      email: email,
      company: company,
      visitType: visitType,
      location: location,
      choices: choices,
    };

    renderSummary(lastSession);
    form.hidden = true;
    panel.classList.add("visible");
    panel.focus();
  });

  form.addEventListener("reset", clearError);

  document.getElementById("btn-copy").addEventListener("click", function () {
    if (!lastSession) return;
    const button = this;
    const text = formatSession(lastSession);

    function restore(label) {
      button.textContent = label;
      window.setTimeout(function () {
        button.textContent = "Copy this record";
      }, 2500);
    }

    function fallbackCopy() {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
        restore("Copied ✓");
      } catch (err) {
        restore("Copy failed — select the tables above");
      }
      document.body.removeChild(area);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        restore("Copied ✓");
      }).catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
  });

  document.getElementById("btn-again").addEventListener("click", function () {
    form.reset();
    clearError();
    panel.classList.remove("visible");
    form.hidden = false;
    form.elements["first-name"].focus();
  });
})();
