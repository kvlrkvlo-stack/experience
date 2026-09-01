/* glow.js — violet cursor glow + proximity darkening of nearby UI, so contrast
   is preserved only under the glow and fades back with distance. */
(function () {
  "use strict";
  if (window.matchMedia && window.matchMedia("(hover: none)").matches) return;

  var GROUPS = [
    { sel: ".chip", props: [ {p:"backgroundColor",k:.55}, {p:"borderColor",k:.5,r:"borderTopColor"} ] },
    { sel: ".metric,.arch__node,.flow__step,.ninebox__cell,.cascade__node,.shot,.step,.igoals__row", props: [ {p:"backgroundColor",k:.5} ] },
    { sel: ".cv-rule", props: [ {p:"borderTopColor",k:.62} ] },
    { sel: ".accordion__item", props: [ {p:"borderBottomColor",k:.62} ] },
    { sel: ".side-block", props: [ {p:"borderTopColor",k:.62} ] }
  ];
  function rgb(s) { var m = s && s.match(/[\d.]+/g); return m ? [+m[0], +m[1], +m[2], m[3] != null ? +m[3] : 1] : null; }
  function radius() { return Math.min(620, Math.max(300, innerWidth * 0.38)); }

  var resets = [];   // per-card: clear inline colors + drop cached base colors

  document.querySelectorAll(".cv-card, .pf-hero__card, .case").forEach(function (card) {
    var items = [];
    GROUPS.forEach(function (g) {
      card.querySelectorAll(g.sel).forEach(function (el) { items.push({ el: el, props: g.props, base: {}, cx: 0, cy: 0 }); });
    });
    resets.push(function () {
      items.forEach(function (it) { it.base = {}; it.props.forEach(function (pr) { it.el.style[pr.p] = ""; }); });
    });

    var raf = null, mx = -1e5, my = -1e5, active = false;

    function cache() {
      items.forEach(function (it) {
        var r = it.el.getBoundingClientRect();
        it.cx = r.left + r.width / 2; it.cy = r.top + r.height / 2;
      });
    }
    function apply() {
      raf = null;
      var light = document.documentElement.getAttribute("data-theme") === "light";
      var R = radius();
      items.forEach(function (it) {
        if (light) { it.props.forEach(function (pr) { it.el.style[pr.p] = ""; }); return; }  // no darkening in light theme
        var dx = mx - it.cx, dy = my - it.cy;
        var t = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / R); t = t * t;
        it.props.forEach(function (pr) {
          if (t < 0.02) { it.el.style[pr.p] = ""; return; }
          var base = it.base[pr.p];
          if (!base) { base = rgb(getComputedStyle(it.el)[pr.r || pr.p]); it.base[pr.p] = base; if (!base) return; }
          var f = 1 - pr.k * t;
          it.el.style[pr.p] = "rgba(" + Math.round(base[0] * f) + "," + Math.round(base[1] * f) + "," + Math.round(base[2] * f) + "," + base[3] + ")";
        });
      });
    }
    function schedule() { if (!raf) raf = requestAnimationFrame(apply); }

    card.addEventListener("pointerenter", function () { active = true; cache(); });
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty("--gx", (e.clientX - r.left) + "px");
      card.style.setProperty("--gy", (e.clientY - r.top) + "px");
      mx = e.clientX; my = e.clientY; schedule();
    });
    card.addEventListener("pointerleave", function () { active = false; mx = my = -1e5; schedule(); });
    window.addEventListener("scroll", function () { if (active) cache(); }, { passive: true });
    window.addEventListener("resize", function () { if (active) cache(); });
    card.addEventListener("transitionend", function () { if (active) cache(); });
  });

  // On any theme change: clear inline colors and drop cached base colors so
  // nothing carries a stale color across themes. Repeat after the CSS color
  // transition (.18s) settles, so a value read mid-transition can't stick.
  var REACTIVE_SEL = ".chip,.metric,.arch__node,.flow__step,.ninebox__cell,.cascade__node,.shot,.step,.igoals__row,.cv-rule,.accordion__item,.side-block";
  function resetAll() {
    resets.forEach(function (fn) { fn(); });                 // clears inline + drops cached base per tracked item
    document.querySelectorAll(REACTIVE_SEL).forEach(function (el) {  // belt-and-suspenders global clear
      el.style.backgroundColor = ""; el.style.borderColor = "";
      el.style.borderTopColor = ""; el.style.borderBottomColor = ""; el.style.color = "";
    });
  }
  new MutationObserver(function () {
    resetAll();
    setTimeout(resetAll, 250);
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
})();
