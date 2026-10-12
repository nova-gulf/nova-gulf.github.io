/* Nova Gulf Health Care — patient consent form (static demo).

   Client-side only: nothing is stored or transmitted. On submit it renders the
   record a consent platform would hold: patient identity, then one row per
   purpose with its basis and the patient's decision.

   Keep PURPOSES in step with the "What each choice does" table on the page.
   If they disagree the page tells the patient two different things. */

const HC_CONFIG = {
  organizationName: "Nova Gulf Health Care",
  purposes: [
    { field: "consent-provider", label: "Share with another healthcare provider", basis: "Consent", detail: "provider-name", detailLabel: "Provider" },
    { field: "consent-family", label: "Share with a family member or contact", basis: "Consent", detail: "family-contact", detailLabel: "Contact" },
    { field: "consent-employer", label: "Confirm attendance to employer or sponsor", basis: "Consent", detail: "employer-name", detailLabel: "Employer or sponsor" },
    { field: "consent-insurer", label: "Share billing details with insurer or payer", basis: "Consent", detail: "insurer-name", detailLabel: "Insurer or payer" },
    { field: "consent-research", label: "Anonymised research and quality improvement", basis: "Consent" },
    { field: "consent-aftercare", label: "Aftercare contact after discharge", basis: "Consent" },
  ],
  channels: [
    { field: "ch-phone", label: "Phone call" },
    { field: "ch-sms", label: "SMS" },
    { field: "ch-email", label: "Email" },
    { field: "ch-whatsapp", label: "WhatsApp" },
    { field: "ch-nohome", label: "Do not contact at home; no messages naming the centre" },
  ],
};

(function () {
  "use strict";

  const form = document.getElementById("hc-form");
  const panel = document.getElementById("confirm-panel");
  const errorEl = document.getElementById("form-error");
  let lastRecord = null;

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
    return "HC-" + new Date().getFullYear() + "-" + String(Math.floor(100000 + Math.random() * 900000));
  }

  /* Detail inputs (who is the provider, the contact, the employer) appear only
     while their purpose is ticked, so an untouched form stays short on a tablet. */
  HC_CONFIG.purposes.forEach(function (p) {
    if (!p.detail) return;
    const box = form.elements[p.field];
    const wrap = document.getElementById(p.field + "-detail");
    box.addEventListener("change", function () {
      wrap.hidden = !box.checked;
      if (!box.checked) form.elements[p.detail].value = "";
      else form.elements[p.detail].focus();
    });
  });
  form.addEventListener("reset", function () {
    clearError();
    HC_CONFIG.purposes.forEach(function (p) {
      if (p.detail) document.getElementById(p.field + "-detail").hidden = true;
    });
  });

  function addRows(tbody, rows) {
    tbody.innerHTML = "";
    rows.forEach(function (cells) {
      const tr = document.createElement("tr");
      cells.forEach(function (value, i) {
        const cell = document.createElement(i === 0 ? "th" : "td");
        if (i === 0) cell.scope = "row";
        cell.textContent = value;
        tr.appendChild(cell);
      });
      tbody.appendChild(tr);
    });
  }

  function channelSummary(r) {
    const on = HC_CONFIG.channels.filter(function (c) { return r.channels[c.field]; })
      .map(function (c) { return c.label; });
    return on.length ? on.join("; ") : "None — no outbound contact";
  }

  function renderRecord(r) {
    const who = [["Reference", r.reference], ["Recorded", r.submittedAt], ["Name", r.name], ["Mobile", r.mobile]];
    if (r.email) who.push(["Email", r.email]);
    addRows(document.getElementById("confirm-session-body"), who);

    const rows = [["Privacy Notice acknowledged", "Notice", "Acknowledged"]];
    HC_CONFIG.purposes.forEach(function (p) {
      let d = r.choices[p.field] ? "Granted" : "Not granted";
      if (r.choices[p.field] && p.detail && r.details[p.detail]) d += " — " + r.details[p.detail];
      rows.push([p.label, p.basis, d]);
    });
    rows.push(["Contact channels", "Preference", channelSummary(r)]);
    rows.push(["Referring authority reporting", "Legal arrangement", "Notice shown — not a choice"]);
    addRows(document.getElementById("confirm-consent-body"), rows);
    document.getElementById("confirm-ref").textContent = r.reference;
  }

  function formatRecord(r) {
    const lines = ["Patient consent — " + HC_CONFIG.organizationName, "Reference: " + r.reference,
      "Recorded: " + r.submittedAt, "", "Name: " + r.name, "Mobile: " + r.mobile];
    if (r.email) lines.push("Email: " + r.email);
    lines.push("", "Consent", "  Privacy Notice (Notice): Acknowledged");
    HC_CONFIG.purposes.forEach(function (p) {
      let d = r.choices[p.field] ? "Granted" : "Not granted";
      if (r.choices[p.field] && p.detail && r.details[p.detail]) d += " — " + r.details[p.detail];
      lines.push("  " + p.label + " (" + p.basis + "): " + d);
    });
    lines.push("  Contact channels (Preference): " + channelSummary(r));
    return lines.join("\n");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearError();

    const first = form.elements["first-name"].value.trim();
    const last = form.elements["last-name"].value.trim();
    const mobile = form.elements["mobile"].value.trim();
    const email = form.elements["email"].value.trim();

    if (!first) return showError("Please enter your first name.");
    if (!last) return showError("Please enter your last name.");
    if (!mobile || mobile.replace(/[^0-9]/g, "").length < 7) return showError("Please enter a mobile number.");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return showError("That email address does not look right. Leave it blank if you prefer.");
    if (!form.elements["ack-notice"].checked) return showError("Please confirm you have read the Privacy Notice.");

    const choices = {}, details = {}, channels = {};
    for (const p of HC_CONFIG.purposes) {
      choices[p.field] = form.elements[p.field].checked;
      if (p.detail) {
        details[p.detail] = form.elements[p.detail].value.trim();
        /* A recipient-specific purpose with no recipient is a record that cannot be acted on. */
        if (choices[p.field] && !details[p.detail])
          return showError("Please say who: " + p.detailLabel.toLowerCase() + " — or untick that choice.");
      }
    }
    HC_CONFIG.channels.forEach(function (c) { channels[c.field] = form.elements[c.field].checked; });

    if (channels["ch-email"] && !email) return showError("You chose email contact. Add an email address above, or untick it.");
    if (choices["consent-aftercare"] && !(channels["ch-phone"] || channels["ch-sms"] || channels["ch-email"] || channels["ch-whatsapp"]))
      return showError("You chose aftercare contact. Pick at least one channel below, or untick aftercare.");

    lastRecord = {
      reference: makeReference(),
      submittedAt: new Date().toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }),
      name: first + " " + last, mobile: mobile, email: email,
      choices: choices, details: details, channels: channels,
    };
    renderRecord(lastRecord);
    form.hidden = true;
    panel.classList.add("visible");
    panel.focus();
  });

  document.getElementById("btn-copy").addEventListener("click", function () {
    if (!lastRecord) return;
    const button = this, text = formatRecord(lastRecord);
    function restore(label) {
      button.textContent = label;
      window.setTimeout(function () { button.textContent = "Copy this record"; }, 2500);
    }
    function fallbackCopy() {
      const area = document.createElement("textarea");
      area.value = text; area.setAttribute("readonly", "");
      area.style.position = "fixed"; area.style.left = "-9999px";
      document.body.appendChild(area); area.select();
      try { document.execCommand("copy"); restore("Copied ✓"); } catch (err) { restore("Copy failed — select the tables above"); }
      document.body.removeChild(area);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { restore("Copied ✓"); }).catch(fallbackCopy);
    } else { fallbackCopy(); }
  });

  /* "Next patient": the tablet is shared, so wipe every field before the next person. */
  document.getElementById("btn-again").addEventListener("click", function () {
    form.reset();
    lastRecord = null;
    panel.classList.remove("visible");
    form.hidden = false;
    form.elements["first-name"].focus();
  });
})();
