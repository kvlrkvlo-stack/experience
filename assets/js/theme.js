/* theme.js — light/dark toggle, persisted; applied before paint (loaded in <head>) */
(function () {
  "use strict";
  var root = document.documentElement;
  function apply(t) {
    if (t === "light") root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");
  }
  var saved;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  apply(saved === "light" ? "light" : "dark");

  document.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest(".theme-toggle");
    if (!btn) return;
    var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    apply(next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });
})();
