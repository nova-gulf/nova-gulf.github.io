/* Nova Gulf — Contact enquiry form (static demo).

   Client-side only: nothing is stored or transmitted. There is no backend on a
   static host, so rather than pretend to send, the form shows the visitor the
   exact payload it would have sent. The "Open email draft" button hands that
   text to the visitor's own mail application; nothing sends on its own.

   Same shape as assets/js/dsr.js so the two behave identically. */

const CONTACT_CONFIG = {
  organizationName: "Nova Gulf",
  // Where the "Open email draft" button points. Replace with a real mailbox
  // before any production use. The .example TLD is reserved and undeliverable.
  recipientEmail: "hello@novagulf.example",
  // The topic that belongs to the Privacy Office, not to this form. Selecting
  // it reveals the hint that points at the Privacy Center.
  privacyTopic: "Privacy & data protection",
  messageLimit: 2000,
};

(function () {
  "use strict";

  const form = document.getElementById("contact-form");
  const panel = document.getElementById("confirm-panel");
  const errorEl = document.getElementById("form-error");
  const topic = document.getElementById("topic");
  const hint = document.getElementById("topic-hint");
  const message = document.getElementById("message");
  const counter = document.getElementById("message-count");
  let lastEnquiry = null;

  function showError(text) {
    errorEl.textContent = text;
    errorEl.classList.add("visible");
    errorEl.scrollIntoView({ block: "nearest" });
  }

  function clearError() {
    errorEl.textContent = "";
    errorEl.classList.remove("visible");
  }

  /* --- topic hint ---------------------------------------------------------
     The privacy topic is the one thing this form should NOT handle: a rights
     request needs identity verification and a statutory clock, which is what
     the Privacy Center exists for. Say so at the moment it is chosen. */
  function syncHint() {
    hint.classList.toggle("visible", topic.value === CONTACT_CONFIG.privacyTopic);
  }
  topic.addEventListener("change", syncHint);
  syncHint();

  function syncCounter() {
    counter.textContent =
      message.value.length + " / " + CONTACT_CONFIG.messageLimit + " characters";
  }
  message.addEventListener("input", syncCounter);
  syncCounter();

  function makeReference() {
    const year = new Date().getFullYear();
    const digits = String(Math.floor(100000 + Math.random() * 900000));
    return "MSG-" + year + "-" + digits;
  }

  function formatEnquiry(req) {
    const lines = [];
    lines.push("Enquiry — " + CONTACT_CONFIG.organizationName);
    lines.push("Reference: " + req.reference);
    lines.push("Submitted: " + req.submittedAt);
    lines.push("");
    lines.push("Name: " + req.name);
    lines.push("Email: " + req.email);
    if (req.phone) lines.push("Phone: " + req.phone);
    if (req.organisation) lines.push("Organisation: " + req.organisation);
    lines.push("Country: " + req.country);
    lines.push("Topic: " + req.topic);
    lines.push("Marketing updates: " + (req.marketing ? "Yes" : "No"));
    lines.push("");
    lines.push("Message:");
    lines.push(req.message);
    return lines.join("\n");
  }

  function renderSummary(req) {
    const rows = [
      ["Reference", req.reference],
      ["Submitted", req.submittedAt],
      ["Name", req.name],
      ["Email", req.email],
    ];
    if (req.phone) rows.push(["Phone", req.phone]);
    if (req.organisation) rows.push(["Organisation", req.organisation]);
    rows.push(["Country", req.country]);
    rows.push(["Topic", req.topic]);
    rows.push(["Marketing updates", req.marketing ? "Yes" : "No"]);
    rows.push(["Message", req.message]);

    const tbody = document.getElementById("confirm-summary-body");
    tbody.innerHTML = "";
    rows.forEach(function (row) {
      const tr = document.createElement("tr");
      const th = document.createElement("th");
      th.scope = "row";
      th.textContent = row[0];
      const td = document.createElement("td");
      td.textContent = row[1];
      tr.appendChild(th);
      tr.appendChild(td);
      tbody.appendChild(tr);
    });
    document.getElementById("confirm-ref").textContent = req.reference;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearError();

    const first = form.elements["first-name"].value.trim();
    const last = form.elements["last-name"].value.trim();
    const email = form.elements["email"].value.trim();
    const phone = form.elements["phone"].value.trim();
    const organisation = form.elements["organisation"].value.trim();
    const country = form.elements["country"].value;
    const chosenTopic = form.elements["topic"].value;
    const text = form.elements["message"].value.trim();
    const consent = form.elements["consent"].checked;

    if (!first) return showError("Please enter your first name.");
    if (!last) return showError("Please enter your last name.");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return showError("Please enter a valid email address.");
    if (!country) return showError("Please select your country.");
    if (!chosenTopic) return showError("Please choose what your enquiry is about.");
    if (!text) return showError("Please write your message.");
    if (!consent)
      return showError("Please confirm we may use your details to respond.");

    lastEnquiry = {
      reference: makeReference(),
      submittedAt: new Date().toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
      name: first + " " + last,
      email: email,
      phone: phone,
      organisation: organisation,
      country: country,
      topic: chosenTopic,
      marketing: form.elements["marketing"].checked,
      message: text,
    };

    renderSummary(lastEnquiry);
    form.hidden = true;
    panel.classList.add("visible");
    panel.focus();
  });

  form.addEventListener("reset", function () {
    clearError();
    window.setTimeout(function () {
      syncHint();
      syncCounter();
    }, 0);
  });

  document.getElementById("btn-copy").addEventListener("click", function () {
    if (!lastEnquiry) return;
    const button = this;
    const text = formatEnquiry(lastEnquiry);

    function restore(label) {
      button.textContent = label;
      window.setTimeout(function () {
        button.textContent = "Copy enquiry details";
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
        restore("Copy failed — select the summary above");
      }
      document.body.removeChild(area);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(function () {
          restore("Copied ✓");
        })
        .catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
  });

  document.getElementById("btn-email").addEventListener("click", function () {
    if (!lastEnquiry) return;
    const subject =
      "Enquiry " + lastEnquiry.reference + " — " + CONTACT_CONFIG.organizationName;
    window.location.href =
      "mailto:" + CONTACT_CONFIG.recipientEmail +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(formatEnquiry(lastEnquiry));
  });

  document.getElementById("btn-again").addEventListener("click", function () {
    form.reset();
    clearError();
    syncHint();
    syncCounter();
    panel.classList.remove("visible");
    form.hidden = false;
    form.elements["first-name"].focus();
  });
})();
