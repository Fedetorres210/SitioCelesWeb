// BCR · Tarjeta de crédito para jóvenes
// Menú móvil, tarjetas de mitos que se voltean y carrusel en móvil.

(function () {
  "use strict";

  /* ---------- Menú móvil ---------- */
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.getElementById("menu");

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    menu.classList.toggle("is-open", open);
  }

  toggle.addEventListener("click", () => {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });

  // Cerrar al elegir una sección o con Escape
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("is-open")) {
      setMenu(false);
      toggle.focus();
    }
  });

  /* ---------- Mitos: voltear tarjeta ---------- */
  const myths = document.querySelectorAll(".myth");
  myths.forEach((card) => {
    card.addEventListener("click", () => {
      const flipped = card.getAttribute("aria-pressed") === "true";
      card.setAttribute("aria-pressed", String(!flipped));
    });
  });

  /* ---------- Mitos: carrusel (solo móvil/tablet) ---------- */
  const track = document.getElementById("myths");
  const dotsWrap = document.querySelector(".myths__dots");
  const nextBtn = document.querySelector(".myths__next");

  myths.forEach((_, i) => {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("is-active");
    dotsWrap.appendChild(dot);
  });
  const dots = dotsWrap.querySelectorAll("span");

  function step() {
    const first = myths[0];
    if (!first) return 0;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return first.getBoundingClientRect().width + gap;
  }

  function currentIndex() {
    const s = step();
    return s ? Math.round(track.scrollLeft / s) : 0;
  }

  function updateDots() {
    const idx = Math.min(currentIndex(), dots.length - 1);
    dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    nextBtn.innerHTML = atEnd
      ? 'Volver al inicio <span aria-hidden="true">↺</span>'
      : 'Deslizá <span aria-hidden="true">→</span>';
  }

  track.addEventListener("scroll", updateDots, { passive: true });

  nextBtn.addEventListener("click", () => {
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({
      left: atEnd ? 0 : (currentIndex() + 1) * step(),
      behavior: reduce ? "auto" : "smooth",
    });
    // Refuerzo por si el evento "scroll" llega tarde (o la animación termina después)
    setTimeout(updateDots, reduce ? 0 : 500);
  });
})();
