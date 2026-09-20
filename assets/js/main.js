/* ===========================================================
   Nam Việt Bình Dương Plastic – shared script
   1. Marks the nav link matching the current page as "active".
   2. Animates the stat counters once they scroll into view.
   3. Contact form validation/feedback (i18n-aware).
   =========================================================== */

(function () {
  "use strict";

  // ---- 1. Active nav link -------------------------------------
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

  // ---- 2. Animated stat counters -------------------------------
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

  // ---- 3. Contact / inquiry form validation ---------------------
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
      var successKey = form.getAttribute("data-success-key") || "contact.form.success";
      var message = getTranslation(successKey) || "Thank you! Your message has been sent.";
      showInlineSuccess(form, message);
      form.reset();
      form.classList.remove("was-validated");
    });
  }

  function getTranslation(key) {
    var lang = document.documentElement.getAttribute("lang") || "en";
    if (!window.NVBD_I18N || !window.NVBD_I18N[lang]) return null;
    return key.split(".").reduce(function (acc, part) {
      return acc && acc[part] !== undefined ? acc[part] : undefined;
    }, window.NVBD_I18N[lang]);
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
    setActiveNavLink();
    setupCounters();
    setupContactForm();
  });
})();
