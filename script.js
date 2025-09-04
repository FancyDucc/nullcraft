const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => [...el.querySelectorAll(q)];

const year = new Date().getFullYear();
$("#year").textContent = year;

const toast = $("#toast");
const modal = $("#modal");
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// fancy “do nothing” toast
const showToast = (msg) => {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
};

$("#doNothing").addEventListener("click", () => {
  showToast("achievement unlocked: nothing accomplished");
});

// “schedule a demo” that books you forever
$("#scheduleDemo").addEventListener("click", () => {
  if (typeof modal.showModal === "function") modal.showModal();
  else alert("demo scheduled. bring your expectations.");
});

// footer ctas
$("#startNow").addEventListener("click", () => showToast("starting… absolutely nothing"));
$("#contactSales").addEventListener("click", () => showToast("sales is unavailable (permanently)"));

// tilt card parallax
(() => {
  const card = $(".tilt .card__inner");
  if (!card) return;

  const rot = (x, y, rect) => {
    const rx = ((y - rect.top) / rect.height - 0.5) * -16;
    const ry = ((x - rect.left) / rect.width - 0.5) * 16;
    return `rotateX(${rx}deg) rotateY(${ry}deg)`;
  };

  const onMove = (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX ?? (e.touches && e.touches[0].clientX);
    const y = e.clientY ?? (e.touches && e.touches[0].clientY);
    if (x == null || y == null) return;
    card.style.transform = rot(x, y, rect);
  };

  const reset = () => { card.style.transform = "rotateX(8deg) rotateY(-8deg)"; };

  card.closest(".tilt").addEventListener("mousemove", onMove);
  card.closest(".tilt").addEventListener("mouseleave", reset);
  card.closest(".tilt").addEventListener("touchmove", onMove, { passive: true });
  card.closest(".tilt").addEventListener("touchend", reset);
})();

// reveal on scroll
(() => {
  const els = $$(".reveal");
  if (!("IntersectionObserver" in window) || prefersReduced) {
    els.forEach(el => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();

// theme toggle (dark/light) purely cosmetic, gloriously pointless
(() => {
  const key = "nullcraft-theme";
  const apply = (mode) => {
    document.documentElement.dataset.theme = mode;
    // just flip CSS vars by relying on OS scheme + :root overrides. looks fancy, does nothing.
  };
  const saved = localStorage.getItem(key);
  if (saved) apply(saved);

  $("#themeToggle").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    localStorage.setItem(key, next);
    apply(next);
    showToast(`theme → ${next}`);
  });
})();

// console easter egg
console.log(
  "%c nullcraft %c delivering nothing, beautifully ",
  "background:linear-gradient(90deg,#6cf0ff,#9f7bff);color:#0b0f14;padding:4px 8px;border-radius:6px 0 0 6px;font-weight:700;",
  "background:#111827;color:#e5f2ff;padding:4px 8px;border-radius:0 6px 6px 0;"
);
