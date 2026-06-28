/* ===========================================================
   BugLens – shared script
   1. Centralized store links: every element with data-store="apple"
      or data-store="google" gets its href wired here, so the real
      App Store / Google Play URLs only have to be set in one place.
   2. Marks the nav link matching the current page as "active".
   3. Animates the stat counters once they scroll into view.
   4. Contact form + newsletter form validation/feedback.
   =========================================================== */

(function () {
  "use strict";

  var STORE_LINKS = {
    apple: "https://apps.apple.com/sg/app/picture-insect-spiders-bugs/id1461694973",
    google: "https://play.google.com/store/apps/details?id=com.glority.pictureinsect"
  };

  // ---- 1. Wire up store buttons -------------------------------
  function setupStoreLinks() {
    document.querySelectorAll("[data-store]").forEach(function (el) {
      var key = el.getAttribute("data-store");
      if (STORE_LINKS[key]) {
        el.setAttribute("href", STORE_LINKS[key]);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
      }
    });
  }

  // ---- 2. Active nav link -------------------------------------
  function setActiveNavLink() {
    var currentPage = window.location.pathname.split("/").pop() || "index.html";
    var links = document.querySelectorAll(".navbar-nav .nav-link");

    links.forEach(function (link) {
      var linkPage = link.getAttribute("href");
      var isActive = linkPage === currentPage;
      link.classList.toggle("active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  // ---- 3. Animated stat counters -------------------------------
  function setupCounters() {
    var counters = document.querySelectorAll("[data-counter]");
    if (!counters.length || !("IntersectionObserver" in window)) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach(function (el) { observer.observe(el); });
  }

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-counter"));
    var suffix = el.getAttribute("data-suffix") || "";
    var decimals = el.getAttribute("data-decimals") ? parseInt(el.getAttribute("data-decimals"), 10) : 0;
    var duration = 1200;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = target * eased;
      el.textContent = value.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  // ---- 4a. Contact form validation -----------------------------
  function setupContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.checkValidity()) {
        event.stopPropagation();
        form.classList.add("was-validated");
        return;
      }
      showInlineSuccess(form, "Thanks! Your request has been noted. We'll get back to you soon.");
      form.reset();
      form.classList.remove("was-validated");
    });
  }

  // ---- 4b. Newsletter form ---------------------------------------
  function setupNewsletterForm() {
    var form = document.getElementById("newsletter-form");
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var input = form.querySelector("input[type='email']");
      if (!input || !input.checkValidity()) {
        input && input.reportValidity();
        return;
      }
      showInlineSuccess(form, "You're on the list — watch your inbox for bug facts!");
      form.reset();
    });
  }

  function showInlineSuccess(form, message) {
    var existing = form.parentNode.querySelector(".form-success-alert");
    if (existing) existing.remove();

    var alert = document.createElement("div");
    alert.className = "alert alert-success mt-3 form-success-alert";
    alert.setAttribute("role", "alert");
    alert.textContent = message;

    form.parentNode.insertBefore(alert, form.nextSibling);
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupStoreLinks();
    setActiveNavLink();
    setupCounters();
    setupContactForm();
    setupNewsletterForm();
  });
})();
