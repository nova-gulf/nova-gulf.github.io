/* Nova Gulf — Data Subject Request form (static demo).
   Client-side only: nothing is stored or transmitted. The "email draft"
   button opens the visitor's own mail application; nothing sends on its own. */

const DSR_CONFIG = {
  organizationName: "Nova Gulf",
  // Where the "Open email draft" button points. Replace with the real
  // Privacy Office mailbox before any production use.
  recipientEmail: "privacy@novagulf.example",
  showDemoNotice: true,
};

(function () {
  "use strict";

  const banner = document.getElementById("demo-banner");
  if (banner && DSR_CONFIG.showDemoNotice) banner.hidden = false;

  const form = document.getElementById("dsr-form");
  const panel = document.getElementById("confirm-panel");
  const errors = [
    document.getElementById("form-error"),
    document.getElementById("form-error-inline"),
  ];
  let lastRequest = null;

  function showError(message) {
    errors.forEach((el) => {
      if (!el) return;
      el.textContent = message;
      el.classList.add("visible");
    });
  }

  function clearError() {
    errors.forEach((el) => {
      if (!el) return;
      el.textContent = "";
      el.classList.remove("visible");
    });
  }

  function requestTypes() {
    return Array.from(
      form.querySelectorAll('input[name="request-type"]:checked')
    ).map((box) => box.value);
  }

  function makeReference() {
    const year = new Date().getFullYear();
    const digits = String(Math.floor(100000 + Math.random() * 900000));
    return "DSR-" + year + "-" + digits;
  }

  function formatRequest(lastRequest) {
    const lines = [];
    lines.push("Data subject request — " + DSR_CONFIG.organizationName);
    lines.push("Reference: " + lastRequest.reference);
    lines.push("Submitted: " + lastRequest.submittedAt);
    lines.push("");
    lines.push("Name: " + lastRequest.name);
    lines.push("Email: " + lastRequest.email);
    if (lastRequest.phone) lines.push("Phone: " + lastRequest.phone);
    lines.push("Country of residence: " + lastRequest.country);
    if (lastRequest.customerId)
      lines.push("Customer/account reference: " + lastRequest.customerId);
    lines.push("Rights requested: " + lastRequest.types.join("; "));
    if (lastRequest.details)
      lines.push("Details: " + lastRequest.details);
    return lines.join("\n");
  }

  function renderSummary(req) {
    const tbody = document.getElementById("confirm-summary-body");
    const rows = [
      ["Reference", req.reference],
      ["Submitted", req.submittedAt],
      ["Name", req.name],
      ["Email", req.email],
    ];
    if (req.phone) rows.push(["Phone", req.phone]);
    rows.push(["Country of residence", req.country]);
    if (req.customerId) rows.push(["Customer/account reference", req.customerId]);
    rows.push(["Rights requested", req.types.join("; ")]);
    if (req.details) rows.push(["Details", req.details]);

    tbody.innerHTML = "";
    rows.forEach(([label, value]) => {
      const tr = document.createElement("tr");
      const th = document.createElement("th");
      th.scope = "row";
      th.textContent = label;
      const td = document.createElement("td");
      td.textContent = value;
      tr.appendChild(th);
      tr.appendChild(td);
      tbody.appendChild(tr);
    });
    document.getElementById("confirm-ref").textContent = req.reference;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearError();

    const name = form.elements["full-name"].value.trim();
    const email = form.elements["email"].value.trim();
    const phone = form.elements["phone"].value.trim();
    const country = form.elements["country"].value;
    const customerId = form.elements["customer-id"].value.trim();
    const details = form.elements["details"].value.trim();
    const types = requestTypes();
    const declared = document.getElementById("declaration").checked;

    if (!name) return showError("Please enter your full name.");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return showError("Please enter a valid email address.");
    if (!country) return showError("Please select your country of residence.");
    if (types.length === 0)
      return showError("Please select at least one right you want to exercise.");
    if (!declared)
      return showError("Please confirm the declaration before submitting.");

    lastRequest = {
      reference: makeReference(),
      submittedAt: new Date().toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
      name: name,
      email: email,
      phone: phone,
      country: country,
      customerId: customerId,
      types: types,
      details: details,
    };

    renderSummary(lastRequest);
    form.hidden = true;
    panel.classList.add("visible");
    panel.focus();
  });

  document.getElementById("btn-copy").addEventListener("click", function () {
    if (!lastRequest) return;
    const text = formatRequest(lastRequest);

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
        this.textContent = "Copied ✓";
      } catch (err) {
        this.textContent = "Copy failed — select the summary above";
      }
      document.body.removeChild(area);
      const button = this;
      setTimeout(function () {
        button.textContent = "Copy request details";
      }, 2500);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      const button = this;
      navigator.clipboard
        .writeText(text)
        .then(function () {
          button.textContent = "Copied ✓";
          setTimeout(function () {
            button.textContent = "Copy request details";
          }, 2500);
        })
        .catch(fallbackCopy);
    } else {
      fallbackCopy.call(this);
    }
  });

  document.getElementById("btn-email").addEventListener("click", function () {
    if (!lastRequest) return;
    const subject =
      "Data subject request " + lastRequest.reference + " — " + DSR_CONFIG.organizationName;
    const href =
      "mailto:" + DSR_CONFIG.recipientEmail +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(formatRequest(lastRequest));
    window.location.href = href;
  });

  document.getElementById("btn-again").addEventListener("click", function () {
    form.reset();
    clearError();
    panel.classList.remove("visible");
    form.hidden = false;
    form.elements["full-name"].focus();
  });
})();
