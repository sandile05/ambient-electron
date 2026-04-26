/* ============================================================
   GOOGLE SHEETS CSV PRICING
   Replace each URL with your published Google Sheet CSV URL.
   How to publish: File > Share > Publish to web > [Tab] > CSV
   ============================================================ */
const PRICING_URLS = [
  { url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS4DqiMHWU5dRUXg9q0BjWfEgr38rIS3xyD6D5gCrYn4fCZdsEMr2O9omO0Qwc8zzRYxwzk-X8oy6zu/pub?gid=791159862&single=true&output=csv", featured: false }, // Tab 1 — Signal
  { url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS4DqiMHWU5dRUXg9q0BjWfEgr38rIS3xyD6D5gCrYn4fCZdsEMr2O9omO0Qwc8zzRYxwzk-X8oy6zu/pub?gid=0&single=true&output=csv", featured: true }, // Tab 2 — Pulse (featured)
  { url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS4DqiMHWU5dRUXg9q0BjWfEgr38rIS3xyD6D5gCrYn4fCZdsEMr2O9omO0Qwc8zzRYxwzk-X8oy6zu/pub?gid=2098180478&single=true&output=csv", featured: false }, // Tab 3 — Current
  { url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS4DqiMHWU5dRUXg9q0BjWfEgr38rIS3xyD6D5gCrYn4fCZdsEMr2O9omO0Qwc8zzRYxwzk-X8oy6zu/pub?gid=759383848&single=true&output=csv", featured: false }, // Tab 4 — Maintain
  { url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS4DqiMHWU5dRUXg9q0BjWfEgr38rIS3xyD6D5gCrYn4fCZdsEMr2O9omO0Qwc8zzRYxwzk-X8oy6zu/pub?gid=381115909&single=true&output=csv", featured: false }, // Tab 5 — Hosting
];

const FALLBACK = [
  {
    tier: "Signal",
    pages: "1–3",
    price: "From R2,500",
    tagline:
      "A clean, professional presence for organisations launching online for the first time.",
    featured: false,
    features: [
      { label: "Mobile responsive layout", on: true },
      { label: "Contact form", on: true },
      { label: "Basic SEO setup", on: true },
      { label: "Hosting guidance & setup", on: true },
      { label: "2 revision rounds", on: true },
      { label: "CMS / admin panel", on: false },
      { label: "Ongoing support", on: false },
    ],
  },
  {
    tier: "Pulse",
    pages: "4–8",
    price: "From R6,500",
    tagline:
      "A comprehensive platform for growing organisations that need depth, flexibility, and a strong online presence.",
    featured: true,
    features: [
      { label: "Mobile responsive layout", on: true },
      { label: "CMS / admin panel", on: true },
      { label: "Contact form & basic integrations", on: true },
      { label: "Advanced SEO setup", on: true },
      { label: "Hosting setup & configuration", on: true },
      { label: "3 months post-launch support", on: true },
      { label: "3 revision rounds", on: true },
    ],
  },
  {
    tier: "Current",
    pages: "9+",
    price: "From R12,000",
    tagline:
      "Full-scale digital presence for organisations with complex content and long-term ambitions.",
    featured: false,
    features: [
      { label: "Mobile responsive layout", on: true },
      { label: "CMS / admin panel", on: true },
      { label: "Advanced forms & integrations", on: true },
      { label: "Full SEO strategy", on: true },
      { label: "Hosting setup & configuration", on: true },
      { label: "6 months post-launch support", on: true },
      { label: "5 revision rounds", on: true },
      { label: "Priority support", on: true },
    ],
  },
  {
    tier: "Maintain",
    pages: "monthly",
    price: "R600",
    tagline:
      "Keep your site fast, secure, and up to date. Pick up where your support period ends.",
    featured: false,
    maintain: true,
    features: [
      { label: "Content updates & changes", on: true },
      { label: "Security monitoring", on: true },
      { label: "Performance checks", on: true },
      { label: "Hosting management", on: true },
      { label: "Monthly activity report", on: true },
      { label: "Priority response time", on: true },
    ],
  },
  {
    tier: "Hosting",
    pages: "monthly",
    price: "R200",
    tagline:
      "Just keep the lights on. Your site stays live and accessible — nothing more, nothing less.",
    featured: false,
    maintain: true,
    features: [
      { label: "Site hosting & uptime", on: true },
      { label: "Domain management support", on: true },
      { label: "Basic availability monitoring", on: true },
      { label: "Content updates", on: false },
      { label: "Security patches", on: false },
      { label: "Technical support", on: false },
    ],
  },
];

function parseCSV(text) {
  const lines = text.trim().split("\n");
  const data = { features: [] };
  lines.forEach((line) => {
    const comma = line.indexOf(",");
    if (comma === -1) return;
    const key = line.slice(0, comma).trim().replace(/^"|"$/g, "");
    const val = line
      .slice(comma + 1)
      .trim()
      .replace(/^"|"$/g, "");
    if (key === "feature") data.features.push({ label: val, on: true });
    else if (key === "feature_off")
      data.features.push({ label: val, on: false });
    else data[key] = val;
  });
  return data;
}

function renderCard(d, featuredOverride) {
  const featured =
    featuredOverride !== undefined
      ? featuredOverride
      : d.featured === "true" || d.featured === true;
  const isMaintain =
    d.maintain === true || d.maintain === "true" || d.maintain === "TRUE";
  const featsHtml = (d.features || [])
    .map((f) => `<li class="${f.on ? "" : "off"}">${f.label}</li>`)
    .join("");
  const priceBlock = isMaintain
    ? `<div class="pr-monthly">${d.price || "R600"} <sub>/month</sub></div>`
    : d.price
      ? `<div class="pr-price">${d.price}</div>`
      : "";
  const pagesBlock = isMaintain
    ? `<div class="pr-pages">Monthly <sub>plan</sub></div>`
    : `<div class="pr-pages">${d.pages || ""} <sub>pages</sub></div>`;
  return `<div class="pr-card${featured ? " featured" : ""}${isMaintain ? " maintain" : ""} fade-in" role="listitem">
    <div class="pr-tier">${d.tier || ""}${featured ? " &nbsp;— &nbsp;Most Popular" : ""}</div>
    ${pagesBlock}
    ${priceBlock}
    <p class="pr-note">${d.tagline || ""}</p>
    <ul class="pr-feats">${featsHtml}</ul>
    <a href="#contact" class="pr-btn" onclick="setPackage('${d.tier || ""}')">${"Book a Call"}</a>
  </div>`;
}

async function fetchTier(cfg) {
  const res = await fetch(cfg.url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  return { ...parseCSV(text), featured: cfg.featured };
}

async function initPricing() {
  const buildGrid = document.getElementById("pr-grid-build");
  const maintainGrid = document.getElementById("pr-grid-maintain");
  const configured = PRICING_URLS.filter((u) => u.url.trim() !== "");

  if (configured.length === 0) {
    buildGrid.innerHTML = FALLBACK.filter((d) => !d.maintain)
      .map((d) => renderCard(d))
      .join("");
    maintainGrid.innerHTML = FALLBACK.filter((d) => d.maintain)
      .map((d) => renderCard(d))
      .join("");
    observeFadeIns();
    refreshCursor();
    return;
  }

  buildGrid.innerHTML = `<div class="pr-loading" style="grid-column:1/-1">Loading&hellip;</div>`;
  maintainGrid.innerHTML = `<div class="pr-loading" style="grid-column:1/-1">Loading&hellip;</div>`;

  const results = await Promise.allSettled(
    PRICING_URLS.map((cfg) =>
      cfg.url.trim() ? fetchTier(cfg) : Promise.resolve(null),
    ),
  );

  let buildHtml = "",
    maintainHtml = "";
  results.forEach((r, i) => {
    const data = r.status === "fulfilled" && r.value ? r.value : FALLBACK[i];
    if (!data) return;
    if (r.status === "rejected")
      console.warn(`Pricing tier ${i + 1} failed, using fallback.`, r.reason);
    const card = renderCard(data, PRICING_URLS[i].featured);
    if (
      data.maintain === true ||
      data.maintain === "true" ||
      data.maintain === "TRUE"
    )
      maintainHtml += card;
    else buildHtml += card;
  });

  buildGrid.innerHTML = buildHtml || '<div class="pr-loading">No data.</div>';
  maintainGrid.innerHTML =
    maintainHtml || '<div class="pr-loading">No data.</div>';
  observeFadeIns();
  refreshCursor();
}

/* ── Cursor ── */
const cur = document.getElementById("cur");
function refreshCursor() {
  if (!cur) return;
  document
    .querySelectorAll(
      "a,button,.sv-item,.pr-card,.pf-cell,.ct-ch,.stat,.proc-step,.tm-card",
    )
    .forEach((el) => {
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

/* ── Particle canvas ── */
(() => {
  const cv = document.getElementById("cv");
  if (!cv) return;
  const cx = cv.getContext("2d");
  let pts = [];
  const resize = () => {
    cv.width = innerWidth;
    cv.height = innerHeight;
  };
  const mk = () => ({
    x: Math.random() * cv.width,
    y: Math.random() * cv.height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 0.9 + 0.2,
    op: Math.random() * 0.28 + 0.05,
    ph: Math.random() * Math.PI * 2,
  });
  const init = () => {
    resize();
    pts = Array.from({ length: 70 }, mk);
  };
  const draw = () => {
    cx.clearRect(0, 0, cv.width, cv.height);
    pts.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.ph += 0.012;
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
        const dx = pts[i].x - pts[j].x,
          dy = pts[i].y - pts[j].y,
          d = Math.sqrt(dx * dx + dy * dy);
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
  init();
  draw();
  window.addEventListener("resize", init);
})();

/* ── Scroll reveal ── */
function observeFadeIns() {
  const obs = new IntersectionObserver(
    (es) => {
      es.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("vis");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08 },
  );
  document.querySelectorAll(".fade-in:not(.vis)").forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 0.1}s`;
    obs.observe(el);
  });
}
observeFadeIns();

/* ── Active nav on scroll ── */
const navSections = [
  
  "process",
  "services",
  "pricing",
  "testimonials",
  "portfolio",
  "contact",
];
const navLinks = document.querySelectorAll("[data-nav]");
const navEl = document.getElementById("nav");

window.addEventListener(
  "scroll",
  () => {
    const y = window.scrollY;
    // shrink nav
    navEl.classList.toggle("scrolled", y > 60);
    // back to top
    document.getElementById("btt").classList.toggle("show", y > 400);
    document.querySelector('.wa-float').classList.toggle('show', y > 400);
    
    // active section highlight
    let current = "";
    navSections.forEach((id) => {
      const el = document.getElementById(id);
      if (el && el.offsetTop - 120 <= y) current = id;
    });
    navLinks.forEach((a) => {
      a.classList.toggle("active", a.dataset.nav === current);
    });
  },
  { passive: true },
);

/* ── Services accordion ── */
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
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  });
});

/* ── Hamburger / drawer ── */
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
hbg.addEventListener("click", () => {
  hbg.classList.contains("open") ? closeDrawer() : openDrawer();
});

document.getElementById('dclose').addEventListener('click', closeDrawer);
drawer.addEventListener("click", (e) => {
  if (e.target === drawer) closeDrawer();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDrawer();
});

/* ── Back to top ── */
document.getElementById("btt").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});


/* ── Contact form ── */
// Pre-fill package from pricing button
function setPackage(name) {
  const sel = document.getElementById("cf-package");
  if (!sel) return;
  for (let i = 0; i < sel.options.length; i++) {
    if (sel.options[i].value === name) {
      sel.selectedIndex = i;
      break;
    }
  }
  document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
}

function validateForm() {
  let valid = true;

  // clear previous errors
  document.querySelectorAll('.cf-input.invalid').forEach(el => {
    el.classList.remove('invalid');
  });
  document.querySelectorAll('.cf-field-error').forEach(el => el.remove());

  const fields = [
    { id: 'cf-name',    label: 'Name',  required: true,  type: 'text'  },
    { id: 'cf-email',   label: 'Email', required: true,  type: 'email' },
    { id: 'cf-phone',   label: 'WhatsApp / Phone', required: true, type: 'tel' },
    { id: 'cf-org',     label: 'Organisation',     required: true, type: 'text'   },
    { id: 'cf-package', label: 'Package', required: true, type: 'select' },
    { id: 'cf-message', label: 'Message', required: true, type: 'text' },
  ];

  fields.forEach(f => {
    const el = document.getElementById(f.id);
    if (!el) return;
    const val = el.value.trim();

    let msg = null;

    if (f.required && !val) {
      msg = `${f.label} is required`;
    } else if (val && f.type === 'email') {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      if (!emailOk) msg = 'Please enter a valid email address';
    } else if (val && f.type === 'tel') {
      const telOk = /^[\d\s\+\-\(\)]{7,15}$/.test(val);
      if (!telOk) msg = 'Please enter a valid phone number';
    }

    if (msg) {
      valid = false;
      el.classList.add('invalid');
      const err = document.createElement('span');
      err.className = 'cf-field-error';
      err.textContent = msg;
      el.parentNode.appendChild(err);
    }
  });

  return valid;
}

// Formspree form submission via fetch (no page reload)
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
        headers: { "Accept": "application/json" },
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

/* ── Boot ── */
initPricing();
