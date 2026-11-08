/* Nova Gulf — consent preferences (static demo).

   Validates the form and renders a consent receipt in the browser. Nothing is
   stored (no cookies, no web storage) and this script makes no network call.
   Securiti Form Consent (the snippet at the foot of the page) records the email
   address and the consent choices on submit.

   Why the form is hidden only after a delay: Securiti Form Consent reads the
   ticked boxes after this handler returns. Hiding the form first makes it read
   every box as unticked and record a Decline for each purpose. Same pattern as
   wifi.js. Keep the purpose list in step with the "What we do with each choice"
   table on the page. */

const PREFERENCES_CONFIG = {
  organizationName: "Nova Gulf",
  purposes: [
    { field: "consent-email-marketing", label: "Marketing by email", basis: "Consent" },
    { field: "consent-sms-whatsapp", label: "Marketing by SMS or WhatsApp", basis: "Consent" },
    { field: "consent-phone-calls", label: "Marketing phone calls", basis: "Consent" },
    { field: "consent-push-notifications", label: "Push notifications", basis: "Consent" },
    { field: "consent-newsletter", label: "Monthly newsletter", basis: "Consent" },
    { field: "consent-product-updates", label: "Product and service announcements", basis: "Consent" },
    { field: "consent-surveys", label: "Survey and research invitations", basis: "Consent" },
    { field: "consent-events", label: "Event and webinar invitations", basis: "Consent" },
    { field: "consent-personalised-offers", label: "Profiling for personalised offers", basis: "Consent" },
    { field: "consent-analytics-research", label: "Analytics and service improvement", basis: "Consent" },
    { field: "consent-partner-sharing", label: "Sharing with partners for their marketing", basis: "Consent" },
    { field: "consent-cross-border", label: "Transfer outside the UAE", basis: "Consent" },
    { field: "consent-loyalty", label: "Loyalty programme", basis: "Consent" }
  ],
};

(function () {
  "use strict";

  const form = document.getElementById("preferences-form");
  const panel = document.getElementById("confirm-panel");
  const errorEl = document.getElementById("form-error");
  const summaryEl = document.getElementById("form-summary");
  let lastReceipt = null;

  function setFieldError(id, message) {
    const input = document.getElementById(id);
    const err = document.getElementById("err-" + id);
    if (err) err.textContent = message || "";
    if (input) {
      if (message) input.setAttribute("aria-invalid", "true");
      else input.removeAttribute("aria-invalid");
    }
  }

  function clearErrors() {
    ["first-name", "last-name", "email", "phone", "dob", "ack-privacy-notice"].forEach(function (id) {
      setFieldError(id, "");
    });
    summaryEl.textContent = "";
    summaryEl.hidden = true;
    errorEl.textContent = "";
    errorEl.classList.remove("visible");
  }

  function makeReference() {
    const year = new Date().getFullYear();
    return "PREF-" + year + "-" + String(Math.floor(100000 + Math.random() * 900000));
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

  function renderReceipt(r) {
    const rows = [
      ["Reference", r.reference],
      ["Recorded", r.submittedAt],
      ["Name", r.name],
      ["Email", r.email],
    ];
    if (r.phone) rows.push(["Phone", r.phone]);
    if (r.gender) rows.push(["Gender", r.gender]);
    if (r.dob) rows.push(["Date of birth", r.dob]);
    rows.push(["Privacy notice", "Read and acknowledged"]);
    addRows(document.getElementById("confirm-session-body"), rows);

    const consent = PREFERENCES_CONFIG.purposes.map(function (p) {
      return [p.label, p.basis, r.choices[p.field] ? "Granted" : "Not granted"];
    });
    addRows(document.getElementById("confirm-consent-body"), consent);
    document.getElementById("confirm-ref").textContent = r.reference;
  }

  function formatReceipt(r) {
    const lines = [
      "Consent receipt — " + PREFERENCES_CONFIG.organizationName,
      "Reference: " + r.reference,
      "Recorded: " + r.submittedAt,
      "",
      "Name: " + r.name,
      "Email: " + r.email,
    ];
    if (r.phone) lines.push("Phone: " + r.phone);
    if (r.gender) lines.push("Gender: " + r.gender);
    if (r.dob) lines.push("Date of birth: " + r.dob);
    lines.push("Privacy notice: read and acknowledged", "", "Consent");
    PREFERENCES_CONFIG.purposes.forEach(function (p) {
      lines.push("  " + p.label + " (" + p.basis + "): " + (r.choices[p.field] ? "Granted" : "Not granted"));
    });
    return lines.join("\n");
  }

  function setAll(checked) {
    PREFERENCES_CONFIG.purposes.forEach(function (p) {
      form.elements[p.field].checked = checked;
    });
  }

  document.getElementById("btn-select-all").addEventListener("click", function () { setAll(true); });
  document.getElementById("btn-clear-all").addEventListener("click", function () { setAll(false); });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors();

    const first = form.elements["first-name"].value.trim();
    const last = form.elements["last-name"].value.trim();
    const email = form.elements["email"].value.trim();
    const phone = form.elements["phone"].value.trim();
    const gender = form.elements["gender"].value;
    const dob = form.elements["dob"].value;

    const problems = [];
    function problem(id, message) {
      setFieldError(id, message);
      problems.push({ id: id, message: message });
    }

    if (!first) problem("first-name", "Please enter your first name.");
    if (!last) problem("last-name", "Please enter your last name.");
    if (!email) problem("email", "Please enter your email address.");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) problem("email", "That email address does not look right.");
    if (phone && phone.replace(/[^0-9]/g, "").length < 7) problem("phone", "That phone number looks too short. Leave it blank if you prefer.");
    if (dob && dob > new Date().toISOString().slice(0, 10)) problem("dob", "Date of birth cannot be in the future.");
    if (!form.elements["ack-privacy-notice"].checked) problem("ack-privacy-notice", "Please confirm you have read the privacy notice.");

    if (problems.length) {
      summaryEl.textContent = "Please fix " + problems.length + (problems.length === 1 ? " item" : " items") + ": " +
        problems.map(function (p) { return p.message; }).join(" ");
      summaryEl.hidden = false;
      document.getElementById(problems[0].id).focus();
      return;
    }

    const choices = {};
    PREFERENCES_CONFIG.purposes.forEach(function (p) {
      choices[p.field] = form.elements[p.field].checked;
    });

    lastReceipt = {
      reference: makeReference(),
      submittedAt: new Date().toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }),
      name: first + " " + last,
      email: email,
      phone: phone,
      gender: gender ? form.elements["gender"].selectedOptions[0].textContent : "",
      dob: dob,
      choices: choices,
    };

    renderReceipt(lastReceipt);

    window.setTimeout(function () {
      form.hidden = true;
      panel.classList.add("visible");
      panel.focus();
    }, 800);
  });

  form.addEventListener("reset", clearErrors);

  document.getElementById("btn-copy").addEventListener("click", function () {
    if (!lastReceipt) return;
    const button = this;
    const text = formatReceipt(lastReceipt);

    function restore(label) {
      button.textContent = label;
      window.setTimeout(function () { button.textContent = "Copy this receipt"; }, 2500);
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
      navigator.clipboard.writeText(text).then(function () { restore("Copied ✓"); }).catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
  });

  document.getElementById("btn-again").addEventListener("click", function () {
    form.reset();
    clearErrors();
    panel.classList.remove("visible");
    form.hidden = false;
    form.elements["first-name"].focus();
  });
})();
