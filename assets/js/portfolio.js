/* portfolio.js — accordion, lightbox, scrollspy, resilient galleries */
(function () {
  "use strict";

  /* ---- Accordion (animated height) -------------------------------------- */
  var items = document.querySelectorAll(".accordion__item");
  items.forEach(function (item) {
    var btn = item.querySelector(".accordion__btn");
    var panel = item.querySelector(".accordion__panel");
    if (!btn || !panel) return;

    btn.setAttribute("aria-expanded", "false");

    function open() {
      item.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
      panel.style.height = panel.scrollHeight + "px";
    }
    function close() {
      // set explicit height first so the transition has a start value
      panel.style.height = panel.scrollHeight + "px";
      requestAnimationFrame(function () {
        item.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
        panel.style.height = "0px";
      });
    }
    btn.addEventListener("click", function () {
      if (item.classList.contains("is-open")) close(); else open();
    });
    // after opening, drop the fixed height so nested content can reflow
    panel.addEventListener("transitionend", function (e) {
      if (e.propertyName === "height" && item.classList.contains("is-open")) {
        panel.style.height = "auto";
      }
    });
    // keep open panels correct on resize
    window.addEventListener("resize", function () {
      if (item.classList.contains("is-open")) panel.style.height = "auto";
    });
  });

  // open the first section of each case by default
  document.querySelectorAll(".case .accordion__item:first-child").forEach(function (item) {
    var btn = item.querySelector(".accordion__btn");
    var panel = item.querySelector(".accordion__panel");
    if (btn && panel) {
      item.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
      panel.style.height = "auto";
    }
  });

  // expand everything before printing, so nothing is clipped
  window.addEventListener("beforeprint", function () {
    document.querySelectorAll(".accordion__panel").forEach(function (p) { p.style.height = "auto"; });
  });

  /* ---- Resilient galleries: hide tiles whose image fails to load -------- */
  document.querySelectorAll(".gallery").forEach(function (gallery) {
    var figs = Array.prototype.slice.call(gallery.querySelectorAll(".shot"));
    function recount() {
      var live = gallery.querySelectorAll(".shot:not([hidden])").length;
      gallery.setAttribute("data-count", live);
      if (live === 0) {
        gallery.hidden = true;
        var note = gallery.nextElementSibling;
        if (note && note.classList.contains("gallery-note")) note.hidden = true;
      }
    }
    figs.forEach(function (fig) {
      var img = fig.querySelector("img");
      if (!img) return;
      if (img.complete && img.naturalWidth === 0) { fig.hidden = true; }
      img.addEventListener("error", function () { fig.hidden = true; recount(); });
    });
    recount();
  });

  /* ---- Lightbox (shared, FLIP open/close animation) --------------------- */
  var lb = document.getElementById("lightbox");
  var lbImg = lb && lb.querySelector("img");
  var lbCap = lb && lb.querySelector(".lightbox__cap");
  var lbSource = null, lbTimer = null;
  var EASE = "cubic-bezier(.2,.7,.2,1)";

  function flipFrom(rect) {
    // animate lbImg from `rect` (source) to its natural centered position
    var last = lbImg.getBoundingClientRect();
    if (!rect || !rect.width || !last.width) return;
    var dx = rect.left - last.left, dy = rect.top - last.top;
    var sx = rect.width / last.width, sy = rect.height / last.height;
    lbImg.style.transition = "none";
    lbImg.style.transformOrigin = "top left";
    lbImg.style.transform = "translate(" + dx + "px," + dy + "px) scale(" + sx + "," + sy + ")";
    void lbImg.offsetWidth;                                   // reflow
    lbImg.style.transition = "transform .4s " + EASE;
    lbImg.style.transform = "none";
  }

  function openLb(src, cap, sourceEl) {
    if (!lb) return;
    clearTimeout(lbTimer);
    lbSource = sourceEl || null;
    var rect = sourceEl ? sourceEl.getBoundingClientRect() : null;
    lbImg.alt = cap || ""; lbCap.textContent = cap || "";
    lb.classList.add("is-open");
    document.body.style.overflow = "hidden";
    function run() {
      requestAnimationFrame(function () { lb.classList.add("lb-shown"); flipFrom(rect); });
    }
    if (lbImg.getAttribute("src") !== src) {
      lbImg.onload = function () { lbImg.onload = null; run(); };
      lbImg.src = src;
      if (lbImg.complete) { lbImg.onload = null; run(); }
    } else { run(); }
  }

  function finishClose() {
    lb.classList.remove("is-open");
    lbImg.style.transition = ""; lbImg.style.transform = ""; lbImg.style.transformOrigin = "";
    lbImg.style.filter = ""; lbImg.style.opacity = "";
    document.body.style.overflow = ""; lbImg.src = ""; lbSource = null;
  }
  function closeLb() {
    if (!lb || !lb.classList.contains("is-open")) return;
    // fade + blur out in place (no jumpy return-to-source)
    lb.classList.remove("lb-shown");
    lbImg.style.transformOrigin = "center";
    lbImg.style.transition = "opacity .3s " + EASE + ", filter .3s " + EASE + ", transform .3s " + EASE;
    lbImg.style.transform = "scale(.985)";
    lbImg.style.filter = "blur(8px)";
    lbImg.style.opacity = "0";
    clearTimeout(lbTimer); lbTimer = setTimeout(finishClose, 320);
  }
  if (lb) {
    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target.classList.contains("lightbox__close")) closeLb();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lb.classList.contains("is-open")) closeLb();
    });
  }

  /* ---- Scrollspy nav highlight ------------------------------------------ */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".site-nav__links a"));
  var cases = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);
  if (cases.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var id = en.target.id;
          navLinks.forEach(function (a) {
            a.classList.toggle("is-current", a.getAttribute("href") === "#" + id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    cases.forEach(function (c) { spy.observe(c); });
  }

  /* ---- Case sliders (auto-advancing, resilient, click-to-zoom) ---------- */
  document.querySelectorAll(".case__slider").forEach(function (root) {
    var slidesBox = root.querySelector(".slides");
    var dotsWrap = root.querySelector(".slider-dots");
    var capEl = root.querySelector(".slider-cap");
    var i = 0, timer = null;

    function slides() { return Array.prototype.slice.call(slidesBox.querySelectorAll(".slide")); }
    function capOf(s) {
      var f = s.querySelector("figcaption"); if (f) return f.textContent;
      var im = s.querySelector("img"); return im ? im.alt : "";
    }

    slides().forEach(function (s) {
      var img = s.querySelector("img");
      if (!img) return;
      if (img.complete && img.naturalWidth === 0) s.remove();
      else img.addEventListener("error", function () { s.remove(); build(); render(); });
      img.addEventListener("click", function () { openLb(img.currentSrc || img.src, capOf(s), img); });
    });

    function build() {
      var n = slides().length;
      dotsWrap.innerHTML = "";
      for (var d = 0; d < n; d++) (function (idx) {
        var b = document.createElement("button");
        b.type = "button"; b.setAttribute("aria-label", "Slide " + (idx + 1));
        b.addEventListener("click", function () { go(idx, true); });
        dotsWrap.appendChild(b);
      })(d);
      var single = n < 2;
      root.querySelectorAll(".slider-arrow").forEach(function (a) { a.style.display = single ? "none" : ""; });
      dotsWrap.style.display = single ? "none" : "";
    }
    function render() {
      var s = slides(); if (!s.length) { root.style.display = "none"; return; }
      if (i >= s.length) i = 0;
      s.forEach(function (el, idx) { el.classList.toggle("is-active", idx === i); });
      if (capEl) capEl.textContent = capOf(s[i]);
      Array.prototype.forEach.call(dotsWrap.children, function (d, idx) { d.classList.toggle("is-active", idx === i); });
    }
    function go(n, manual) { var len = slides().length; if (!len) return; i = (n % len + len) % len; render(); if (manual) restart(); }
    function restart() { if (timer) clearInterval(timer); if (slides().length > 1) timer = setInterval(function () { go(i + 1); }, 15000); }

    var prev = root.querySelector(".prev"), next = root.querySelector(".next");
    if (prev) prev.addEventListener("click", function () { go(i - 1, true); });
    if (next) next.addEventListener("click", function () { go(i + 1, true); });
    root.addEventListener("pointerenter", function () { if (timer) clearInterval(timer); });
    root.addEventListener("pointerleave", restart);

    build(); render(); restart();
  });
})();
