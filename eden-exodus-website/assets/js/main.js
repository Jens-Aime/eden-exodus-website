/* Eden Exodus – Funktionen der Website (normalerweise nichts zu ändern) */
(function () {
  "use strict";
  var S = window.SITE || {};
  var MONTHS = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
  var MONTHS_LONG = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  var emailReady = S.email && S.email.indexOf("beispiel") === -1;

  /* ---- Handy-Menü ---- */
  var toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open);
    });
    document.querySelectorAll(".nav a").forEach(function (a) {
      a.addEventListener("click", function () { document.body.classList.remove("nav-open"); });
    });
  }

  /* ---- Einstellungen einsetzen ---- */
  document.querySelectorAll("[data-site]").forEach(function (el) {
    var key = el.getAttribute("data-site");
    var val = S[key];
    if (!val) { if (el.hasAttribute("data-hide-empty")) el.style.display = "none"; return; }
    if (el.tagName === "A") {
      if (key === "email") el.href = "mailto:" + val;
      else if (key === "phone") el.href = "tel:" + val.replace(/[^+\d]/g, "");
      else el.href = val;
      if (!el.children.length) el.textContent = val;
    } else {
      el.textContent = val;
    }
  });
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

  /* ---- Events ---- */
  function esc(s) { return String(s || "").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var upcoming = (window.EVENTS || []).map(function (e) {
    var p = e.date.split("-"); e._d = new Date(+p[0], +p[1] - 1, +p[2]); return e;
  }).filter(function (e) { return e._d >= today; })
    .sort(function (a, b) { return a._d - b._d; });

  document.querySelectorAll("[data-events]").forEach(function (box) {
    var limit = parseInt(box.getAttribute("data-limit") || "0", 10);
    var full = box.hasAttribute("data-full");
    var list = limit ? upcoming.slice(0, limit) : upcoming;
    if (!list.length) { box.outerHTML = '<p class="event-empty">Gerade sind keine Termine geplant. Schau bald wieder vorbei!</p>'; return; }
    box.innerHTML = list.map(function (e) {
      var d = e._d;
      var day = ("0" + d.getDate()).slice(-2);
      var meta = d.getDate() + ". " + MONTHS_LONG[d.getMonth()] + " " + d.getFullYear() + (e.time ? " &nbsp;•&nbsp; " + esc(e.time) + " Uhr" : "");
      return '<a class="event-card reveal" href="events.html">' +
        '<div class="event-media">' + (e.image ? '<img src="' + esc(e.image) + '" alt="" loading="lazy">' : "") +
        '<div class="event-date"><strong>' + day + '</strong><span>' + MONTHS[d.getMonth()] + '</span></div></div>' +
        '<div class="event-body"><h3>' + esc(e.title) + '</h3><p class="event-meta">' + meta +
        (full && e.place ? " &nbsp;•&nbsp; " + esc(e.place) : "") + '</p>' +
        (full && e.text ? '<p class="event-desc">' + esc(e.text) + '</p>' : "") + '</div></a>';
    }).join("");
  });

  /* ---- Einblenden beim Scrollen ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---- Material-Filter ---- */
  var filter = document.querySelector(".filter");
  if (filter) {
    filter.addEventListener("click", function (ev) {
      var btn = ev.target.closest("button"); if (!btn) return;
      filter.querySelectorAll("button").forEach(function (b) { b.classList.toggle("active", b === btn); });
      var cat = btn.getAttribute("data-cat");
      document.querySelectorAll(".material").forEach(function (m) {
        m.hidden = cat !== "alle" && m.getAttribute("data-cat") !== cat;
      });
    });
  }

  /* ---- Kontaktformular (läuft über formsubmit.co, kostenlos) ---- */
  var form = document.querySelector("#contact-form");
  if (form) {
    if (emailReady) {
      form.action = "https://formsubmit.co/" + encodeURIComponent(S.email);
      var next = form.querySelector('[name="_next"]');
      if (next) next.value = location.origin + location.pathname.replace(/[^/]*$/, "") + "danke.html";
    }
    form.addEventListener("submit", function (ev) {
      if (!emailReady) {
        ev.preventDefault();
        alert("Das Formular ist noch nicht eingerichtet. Bitte trage deine E-Mail-Adresse in assets/js/config.js ein.");
      }
    });
  }

  /* ---- Spenden ---- */
  var donate = document.querySelector("#donate");
  if (donate) {
    var amount = 25, monthly = false;
    var custom = donate.querySelector("#custom-amount");
    var out = donate.querySelector("[data-amount-out]");
    var go = donate.querySelector("#donate-go");
    var hint = donate.querySelector("#donate-hint");
    function render() {
      out.textContent = amount ? amount + " €" : "–";
      if (monthly) {
        go.textContent = "Dauerauftrag einrichten";
        hint.textContent = "Für eine monatliche Spende richte bitte einen Dauerauftrag mit den Bankdaten unten ein. Danke!";
      } else if (S.paypalMe) {
        go.textContent = "Mit PayPal spenden";
        hint.textContent = "Du wirst sicher zu PayPal weitergeleitet.";
      } else {
        go.textContent = "Zu den Bankdaten";
        hint.textContent = "Online-Spenden folgen bald. Bis dahin freuen wir uns über eine Überweisung.";
      }
    }
    donate.querySelectorAll(".amounts button").forEach(function (b) {
      b.addEventListener("click", function () {
        donate.querySelectorAll(".amounts button").forEach(function (x) { x.classList.toggle("active", x === b); });
        amount = parseInt(b.getAttribute("data-amount"), 10); custom.value = ""; render();
      });
    });
    custom.addEventListener("input", function () {
      donate.querySelectorAll(".amounts button").forEach(function (x) { x.classList.remove("active"); });
      amount = Math.max(0, parseInt(custom.value, 10) || 0); render();
    });
    donate.querySelectorAll(".toggle button").forEach(function (b) {
      b.addEventListener("click", function () {
        donate.querySelectorAll(".toggle button").forEach(function (x) { x.classList.toggle("active", x === b); });
        monthly = b.getAttribute("data-monthly") === "1"; render();
      });
    });
    go.addEventListener("click", function () {
      if (!monthly && S.paypalMe) {
        window.open("https://www.paypal.com/paypalme/" + encodeURIComponent(S.paypalMe) + (amount ? "/" + amount + "EUR" : ""), "_blank", "noopener");
      } else {
        document.querySelector("#bank").scrollIntoView({ behavior: "smooth" });
      }
    });
    render();
  }

  /* ---- Kopieren-Knöpfe (IBAN) ---- */
  document.querySelectorAll("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = S[b.getAttribute("data-copy")] || "";
      if (navigator.clipboard) navigator.clipboard.writeText(v.replace(/\s/g, "")).then(function () {
        var t = b.textContent; b.textContent = "Kopiert ✓"; setTimeout(function () { b.textContent = t; }, 1600);
      });
    });
  });
})();
