/* cv.js — smooth collapsibles: sidebar (Education/Additional) + jobs (AppScience/LUSH) */
(function () {
  "use strict";

  function wire(item, btn, panel) {
    if (!btn || !panel) return;
    var startOpen = item.classList.contains("is-open");

    function open(animate) {
      item.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
      panel.style.height = animate ? panel.scrollHeight + "px" : "auto";
    }
    function close() {
      panel.style.height = panel.scrollHeight + "px";
      requestAnimationFrame(function () {
        item.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
        panel.style.height = "0px";
      });
    }

    if (startOpen) open(false); else { btn.setAttribute("aria-expanded", "false"); panel.style.height = "0px"; }

    btn.addEventListener("click", function () {
      if (item.classList.contains("is-open")) close(); else open(true);
    });
    panel.addEventListener("transitionend", function (e) {
      if (e.propertyName === "height" && item.classList.contains("is-open")) panel.style.height = "auto";
    });
    window.addEventListener("resize", function () {
      if (item.classList.contains("is-open")) panel.style.height = "auto";
    });
  }

  document.querySelectorAll(".cv-collapse").forEach(function (el) {
    wire(el, el.querySelector(".cv-collapse__btn"), el.querySelector(".cv-collapse__panel"));
  });
  document.querySelectorAll(".job--collapsible").forEach(function (el) {
    wire(el, el.querySelector(".job__toggle"), el.querySelector(".job__panel"));
  });

  window.addEventListener("beforeprint", function () {
    document.querySelectorAll(".cv-collapse__panel, .job__panel").forEach(function (p) { p.style.height = "auto"; });
  });
})();
