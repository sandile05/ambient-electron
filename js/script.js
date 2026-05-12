/* ── CURSOR ── */
const cur = document.getElementById("cur");
function refreshCursor() {
  if (!cur) return;
  document.querySelectorAll("a,button,.sv-item,.pf-cell,.ct-ch,.stat,.proc-step,.tm-card,.pt-btn,.pr-call-btn").forEach((el) => {
    el.addEventListener("mouseenter", () => cur.classList.add("big"));
    el.addEventListener("mouseleave", () => cur.classList.remove("big"));
  });
}
if (cur) {
  document.addEventListener("mousemove", (e) => {
    cur.style.left = e.clientX + "px";
    cur.style.top = e.clientY + "px";
  });
  refreshCursor();
}

/* ── PARTICLE CANVAS ── */
(() => {
  const cv = document.getElementById("cv");
  if (!cv) return;
  const cx = cv.getContext("2d");
  let pts = [];

  const resize = () => { cv.width = innerWidth; cv.height = innerHeight; };
  const mk = () => ({
    x: Math.random() * cv.width,
    y: Math.random() * cv.height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 0.9 + 0.2,
    op: Math.random() * 0.28 + 0.05,
    ph: Math.random() * Math.PI * 2,
  });
  const init = () => { resize(); pts = Array.from({ length: 70 }, mk); };
  const draw = () => {
    cx.clearRect(0, 0, cv.width, cv.height);
    pts.forEach((p) => {
      p.x += p.vx; p.y += p.vy; p.ph += 0.012;
      if (p.x < 0) p.x = cv.width;
      if (p.x > cv.width) p.x = 0;
      if (p.y < 0) p.y = cv.height;
      if (p.y > cv.height) p.y = 0;
      const o = p.op + Math.sin(p.ph) * 0.06;
      cx.beginPath();
      cx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      cx.fillStyle = `rgba(0,207,255,${o})`;
      cx.fill();
    });
    for (let i = 0; i < pts.length; i++)
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 140) {
          cx.beginPath();
          cx.moveTo(pts[i].x, pts[i].y);
          cx.lineTo(pts[j].x, pts[j].y);
          cx.strokeStyle = `rgba(0,207,255,${(1 - d / 140) * 0.05})`;
          cx.lineWidth = 0.3;
          cx.stroke();
        }
      }
    requestAnimationFrame(draw);
  };
  init(); draw();
  window.addEventListener("resize", init);
})();

/* ── SCROLL REVEAL ── */
function observeFadeIns() {
  const obs = new IntersectionObserver(
    (es) => {
      es.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("vis"); obs.unobserve(e.target); }
      });
    },
    { threshold: 0.08 }
  );
  document.querySelectorAll(".fade-in:not(.vis)").forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 0.1}s`;
    obs.observe(el);
  });
}
observeFadeIns();

/* ── ACTIVE NAV ON SCROLL ── */
const navSections = ["process", "services", "pricing", "portfolio", "contact"];
const navLinks = document.querySelectorAll("[data-nav]");
const navEl = document.getElementById("nav");

window.addEventListener("scroll", () => {
  const y = window.scrollY;

  // shrink nav
  navEl.classList.toggle("scrolled", y > 60);

  // back to top + whatsapp
  document.getElementById("btt").classList.toggle("show", y > 400);
  document.querySelector(".wa-float").classList.toggle("show", y > 400);

  // active section highlight
  let current = "";
  navSections.forEach((id) => {
    const el = document.getElementById(id);
    if (el && el.offsetTop - 120 <= y) current = id;
  });
  navLinks.forEach((a) => {
    a.classList.toggle("active", a.dataset.nav === current);
  });
}, { passive: true });

/* ── SERVICES ACCORDION ── */
document.querySelectorAll(".sv-item .sv-head").forEach((head) => {
  const toggle = () => {
    const item = head.closest(".sv-item");
    const isOpen = item.classList.contains("open");
    document.querySelectorAll(".sv-item").forEach((i) => {
      i.classList.remove("open");
      i.querySelector(".sv-head").setAttribute("aria-expanded", "false");
    });
    if (!isOpen) {
      item.classList.add("open");
      head.setAttribute("aria-expanded", "true");
    }
  };
  head.addEventListener("click", toggle);
  head.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
  });
});

/* ── HAMBURGER / DRAWER ── */
const hbg = document.getElementById("hbg");
const drawer = document.getElementById("drawer");

function openDrawer() {
  drawer.classList.add("open");
  hbg.classList.add("open");
  hbg.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}
function closeDrawer() {
  drawer.classList.remove("open");
  hbg.classList.remove("open");
  hbg.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

document.getElementById("dclose").addEventListener("click", closeDrawer);

hbg.addEventListener("click", () => {
  hbg.classList.contains("open") ? closeDrawer() : openDrawer();
});
drawer.addEventListener("click", (e) => {
  if (e.target === drawer) closeDrawer();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDrawer();
});

/* ── BACK TO TOP ── */
document.getElementById("btt").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ── CONTACT FORM ── */
function setPackage(name) {
  const sel = document.getElementById("cf-package");
  if (!sel) return;
  for (let i = 0; i < sel.options.length; i++) {
    if (sel.options[i].value === name) { sel.selectedIndex = i; break; }
  }
  document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
}

function validateForm() {
  let valid = true;

  document.querySelectorAll(".cf-input.invalid").forEach((el) => el.classList.remove("invalid"));
  document.querySelectorAll(".cf-field-error").forEach((el) => el.remove());

  const fields = [
    { id: "cf-name",    label: "Name",             required: true, type: "text"   },
    { id: "cf-org",     label: "Organisation",     required: true, type: "text"   },
    { id: "cf-email",   label: "Email",            required: true, type: "email"  },
    { id: "cf-phone",   label: "WhatsApp / Phone", required: true, type: "tel"    },
    { id: "cf-package", label: "Package",          required: true, type: "select" },
    { id: "cf-message", label: "Message",          required: true, type: "text"   },
  ];

  fields.forEach((f) => {
    const el = document.getElementById(f.id);
    if (!el) return;
    const val = el.value.trim();
    let msg = null;

    if (f.required && !val) {
      msg = `${f.label} is required`;
    } else if (val && f.type === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) msg = "Please enter a valid email address";
    } else if (val && f.type === "tel") {
      if (!/^[\d\s\+\-\(\)]{7,15}$/.test(val)) msg = "Please enter a valid phone number";
    }

    if (msg) {
      valid = false;
      el.classList.add("invalid");
      const err = document.createElement("span");
      err.className = "cf-field-error";
      err.textContent = msg;
      el.parentNode.appendChild(err);
    }
  });

  return valid;
}

const ctForm = document.getElementById("ct-form");
if (ctForm) {
  ctForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const btn = document.getElementById("cf-submit");
    const btnText = document.getElementById("cf-btn-text");
    const success = document.getElementById("cf-success");
    const error = document.getElementById("cf-error");

    btn.disabled = true;
    btnText.textContent = "Sending…";
    success.style.display = "none";
    error.style.display = "none";

    try {
      const res = await fetch("https://formspree.io/f/xvzdyvdz", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(ctForm),
      });
      if (res.ok) {
        success.style.display = "block";
        ctForm.reset();
      } else {
        throw new Error("Network response not ok");
      }
    } catch {
      error.style.display = "block";
    } finally {
      btn.disabled = false;
      btnText.textContent = "Send Message";
    }
  });
}

/* ── SWIPE HINT ── */
const swipeHint = document.getElementById('swipe-hint');
const pricingSection = document.getElementById('pricing');

if (swipeHint && pricingSection) {
  window.addEventListener('scroll', () => {
    const rect = pricingSection.getBoundingClientRect();
    const inView = rect.top < window.innerHeight * 0.4 && rect.bottom > window.innerHeight * 0.5;
    swipeHint.classList.toggle('hidden', !inView);
  }, { passive: true });

  document.querySelectorAll('.pt-wrap').forEach(wrap => {
    wrap.addEventListener('scroll', () => {
      swipeHint.classList.add('hidden');
    }, { passive: true, once: true });
  });
}