import { ABOUT_TEXT, BOOKING_URL, BRAND, CONTACT, GALLERY_IMAGES, SERVICES } from "./content.js?v=20260504-42";

/* ─── Feature flags ─────────────────────────────────── */
const PREFERS_REDUCED_MOTION = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
const IS_COARSE_POINTER = window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
const CAN_HOVER = window.matchMedia?.("(hover: hover) and (pointer: fine)")?.matches ?? false;
const ENABLE_HERO_3D = true;
const ENABLE_PARALLAX = true;

/* ─── Utility ───────────────────────────────────────── */
function formatNumberSv(v) { return new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(v); }
function formatSek(v) { return `${formatNumberSv(v).replace(/\s/g, "\u00A0")}\u00A0kr`; }
function formatPriceValue(p) { return p ? formatSek(p.sek) : ""; }
function formatTelLink(raw) {
  const c = (raw || "").replace(/\s+/g, "").replace(/-/g, "");
  if (!c) return "#";
  if (c.startsWith("+")) return `tel:${c}`;
  if (c.startsWith("0")) return `tel:+46${c.slice(1)}`;
  return `tel:${c}`;
}

/* ─── Preloader ─────────────────────────────────────── */
function initPreloader() {
  const el = document.getElementById("preloader");
  const bar = document.getElementById("preloaderProgress");
  if (!el) return;
  document.body.style.overflow = "hidden";

  let p = 0;
  const tick = setInterval(() => {
    p += Math.random() * 18 + 4;
    if (p >= 100) {
      p = 100;
      clearInterval(tick);
      setTimeout(() => {
        el.classList.add("hidden");
        document.body.style.overflow = "";
        setTimeout(() => {
          const hero = document.querySelector(".hero__content");
          if (hero) hero.classList.add("is-visible");
        }, 200);
      }, 350);
    }
    if (bar) bar.style.width = p + "%";
  }, 90);

  setTimeout(() => {
    if (!el.classList.contains("hidden")) {
      el.classList.add("hidden");
      document.body.style.overflow = "";
    }
  }, 4000);
}

/* ─── Custom Cursor ─────────────────────────────────── */
function setupCustomCursor() {
  if (IS_COARSE_POINTER) return;
  const cursor = document.getElementById("cursor");
  const trail = document.getElementById("cursorTrail");
  if (!cursor || !trail) return;

  let mx = 0, my = 0, cx = 0, cy = 0, tx = 0, ty = 0;
  let raf = null, active = false, timer = null;

  document.querySelectorAll("a, button, .btn, .service-card, .glass, .bonus-card, .gallery-item").forEach(el => {
    el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
  });

  function animate() {
    cx += (mx - cx) * 0.14;
    cy += (my - cy) * 0.14;
    tx += (mx - tx) * 0.07;
    ty += (my - ty) * 0.07;
    cursor.style.left = cx + "px";
    cursor.style.top  = cy + "px";
    trail.style.left  = tx + "px";
    trail.style.top   = ty + "px";
    raf = requestAnimationFrame(animate);
  }

  document.addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    if (!active) {
      active = true;
      cursor.style.opacity = "1";
      trail.style.opacity  = "0.45";
      animate();
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      active = false;
      if (raf) cancelAnimationFrame(raf);
    }, 5000);
  }, { passive: true });

  document.addEventListener("mouseleave", () => {
    cursor.style.opacity = "0";
    trail.style.opacity  = "0";
  });
  document.addEventListener("mouseenter", () => {
    cursor.style.opacity = "1";
    trail.style.opacity  = "0.45";
  });
}

/* ─── Scroll progress ───────────────────────────────── */
function setupScrollProgress() {
  const bar = document.getElementById("scrollProgress");
  if (!bar) return;
  /* batch all scroll-driven reads into one rAF to avoid forced reflow */
  const header = document.querySelector(".header");
  const btn    = document.getElementById("scrollTop");
  let ticking  = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const doc = document.documentElement;
      const sy  = window.scrollY;
      const pct = (sy / (doc.scrollHeight - doc.clientHeight)) * 100;
      bar.style.width = Math.min(pct, 100) + "%";
      if (header) header.classList.toggle("scrolled", sy > 60);
      if (btn)    btn.classList.toggle("is-visible", sy > 500);
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ─── Header scroll state ───────────────────────────── */
function setupHeaderScroll() { /* merged into setupScrollProgress */ }

/* ─── Scroll-to-top ─────────────────────────────────── */
function setupScrollTop() {
  const btn = document.getElementById("scrollTop");
  if (!btn) return;
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ─── Hamburger / Mobile nav ────────────────────────── */
function initHamburger() {
  const toggle = document.getElementById("navToggle");
  const nav    = document.getElementById("mainNav");
  if (!toggle || !nav) return;

  function close() {
    toggle.setAttribute("aria-expanded", "false");
    toggle.classList.remove("is-active");
    nav.classList.remove("is-active");
    document.body.style.overflow = "";
  }
  function open() {
    toggle.setAttribute("aria-expanded", "true");
    toggle.classList.add("is-active");
    nav.classList.add("is-active");
    document.body.style.overflow = "hidden";
  }
  toggle.addEventListener("click", () => {
    toggle.getAttribute("aria-expanded") === "true" ? close() : open();
  });
  nav.addEventListener("click", e => {
    if (e.target.classList.contains("nav__link") || e.target.classList.contains("btn--nav")) close();
  });
  nav.addEventListener("keydown", e => {
    if (e.key === "Escape" && nav.classList.contains("is-active")) { close(); toggle.focus(); }
  });
  toggle.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle.click(); }
  });
}

/* ─── Booking links ─────────────────────────────────── */
function setBookingLinks() {
  const modal = document.getElementById("bookingModal");
  const modalBackdrop = document.getElementById("bookingModalBackdrop");
  const modalClose = document.getElementById("bookingModalClose");
  const rememberCheckbox = document.getElementById("rememberBookingChoice");
  const bookingOptions = document.querySelectorAll("[data-booking-system]");

  // Check if user has a saved preference
  const savedPreference = localStorage.getItem("bookingSystemPreference");

  // Handle booking modal
  function openModal() {
    if (savedPreference) {
      // Direct to saved preference
      const preferredUrl = savedPreference === "bokadirekt"
        ? "https://www.bokadirekt.se/places/rodeluxe-130945"
        : "https://book.heygoldie.com/Rodeluxe";
      window.open(preferredUrl, "_blank", "noopener");
    } else {
      // Show modal
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
  }

  function closeModal() {
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // Set up booking trigger buttons
  document.querySelectorAll("[data-booking-trigger]").forEach(el => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  });

  // Set up existing booking buttons to also trigger modal
  document.querySelectorAll("[data-booking]").forEach(el => {
    if (el instanceof HTMLAnchorElement) {
      el.removeAttribute("href");
      el.addEventListener("click", (e) => {
        e.preventDefault();
        openModal();
      });
    }
  });

  // Close modal handlers
  modalClose?.addEventListener("click", closeModal);
  modalBackdrop?.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
      closeModal();
    }
  });

  // Handle booking option selection
  bookingOptions.forEach(option => {
    option.addEventListener("click", (e) => {
      const system = option.getAttribute("data-booking-system");
      if (rememberCheckbox.checked) {
        localStorage.setItem("bookingSystemPreference", system);
      }
    });
  });
}

/* ─── Static text hydration ─────────────────────────── */
function hydrateStaticText() {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const fb = document.getElementById("footerBrand");
  if (fb) fb.textContent = BRAND.name;

  const ab = document.getElementById("aboutText");
  if (ab) ab.textContent = ABOUT_TEXT;
}

/* ─── Hero background ───────────────────────────────── */
function setHeroBackground() {
  const bg = document.getElementById("heroBg");
  if (!bg) return;
  const hero = GALLERY_IMAGES.find(x => x.src.includes("ad6f70b9")) || GALLERY_IMAGES[0];
  bg.style.backgroundImage = `url('${hero.src}')`;
}

/* ─── Services ──────────────────────────────────────── */
function renderServices() {
  const root = document.getElementById("servicesRoot");
  if (!root) return;
  const frag = document.createDocumentFragment();

  for (const cat of SERVICES) {
    const wrapper = document.createElement("div");
    wrapper.className = "service-category reveal";

    const top = document.createElement("div");
    top.className = "service-category__top";
    top.innerHTML = `
      <h3 class="service-category__name">${cat.icon || ""} ${cat.category}</h3>
      <span class="chip">${cat.items.length} ${cat.items.length === 1 ? "tjänst" : "tjänster"}</span>
    `;

    const grid = document.createElement("div");
    grid.className = "service-grid";

    for (const svc of cat.items) {
      const card = document.createElement("article");
      card.className = "glass service-card tilt";
      const priceLabel = svc.price?.type === "from" ? "Från" : "Pris";
      card.innerHTML = `
        <div class="tilt__inner">
          <h4 class="service-card__name">${svc.name}</h4>
          <div class="service-card__row">
            <div class="chips">
              ${svc.durationMin ? `<span class="chip">${svc.durationMin} min</span>` : ""}
              <span class="chip">${cat.category}</span>
            </div>
            <div class="price" aria-label="Pris">
              <span class="price__label">${priceLabel}</span>
              <span>${formatPriceValue(svc.price)}</span>
            </div>
          </div>
          ${svc.description ? `<p class="service-card__desc">${svc.description}</p>` : ""}
          <div class="service-card__actions">
            <a class="btn btn--ghost" href="${svc.bookingUrl ?? BOOKING_URL}" target="_blank" rel="noopener noreferrer">Boka</a>
          </div>
        </div>
      `;
      grid.appendChild(card);
    }

    wrapper.appendChild(top);
    wrapper.appendChild(grid);
    frag.appendChild(wrapper);
  }
  root.appendChild(frag);
}

/* ─── Gallery + Lightbox data ───────────────────────── */
let _lightboxImages = [];
let _lightboxIndex  = 0;

function renderGallery() {
  const root = document.getElementById("galleryGrid");
  if (!root) return;

  const track = document.createElement("div");
  track.className = "gallery__track";

  _lightboxImages = [...GALLERY_IMAGES];

  const allImages = [...GALLERY_IMAGES, ...GALLERY_IMAGES];
  allImages.forEach((img, i) => {
    const figure = document.createElement("figure");
    figure.className = i === 0 ? "gallery-item gallery-item--3d" : "gallery-item";
    figure.setAttribute("role", "button");
    figure.setAttribute("tabindex", "0");
    figure.setAttribute("aria-label", `Öppna ${img.alt}`);
    figure.innerHTML = `
      <img src="${img.src}" alt="${img.alt}" loading="lazy" decoding="async" />
      <div class="gallery-item__open">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        Förstora
      </div>
    `;
    const realIdx = i % GALLERY_IMAGES.length;
    figure.addEventListener("click", () => openLightbox(realIdx));
    figure.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(realIdx); }
    });
    track.appendChild(figure);
  });

  root.appendChild(track);
}

/* ─── Lightbox ──────────────────────────────────────── */
function openLightbox(idx) {
  _lightboxIndex = idx;
  const lb       = document.getElementById("lightbox");
  const bd       = document.getElementById("lightboxBackdrop");
  const img      = document.getElementById("lightboxImg");
  const counter  = document.getElementById("lightboxCounter");
  if (!lb || !bd) return;

  const d = _lightboxImages[_lightboxIndex];
  img.src = d.src;
  img.alt = d.alt;
  if (counter) counter.textContent = `${_lightboxIndex + 1} / ${_lightboxImages.length}`;

  lb.classList.add("is-open");
  bd.classList.add("is-open");
  document.body.style.overflow = "hidden";

  const close = document.getElementById("lightboxClose");
  if (close) close.focus();
}

function closeLightbox() {
  document.getElementById("lightbox")?.classList.remove("is-open");
  document.getElementById("lightboxBackdrop")?.classList.remove("is-open");
  document.body.style.overflow = "";
}

function lightboxNext() {
  _lightboxIndex = (_lightboxIndex + 1) % _lightboxImages.length;
  openLightbox(_lightboxIndex);
}

function lightboxPrev() {
  _lightboxIndex = (_lightboxIndex - 1 + _lightboxImages.length) % _lightboxImages.length;
  openLightbox(_lightboxIndex);
}

function setupLightbox() {
  document.getElementById("lightboxClose")?.addEventListener("click", closeLightbox);
  document.getElementById("lightboxBackdrop")?.addEventListener("click", closeLightbox);
  document.getElementById("lightboxNext")?.addEventListener("click", lightboxNext);
  document.getElementById("lightboxPrev")?.addEventListener("click", lightboxPrev);

  document.addEventListener("keydown", e => {
    const lb = document.getElementById("lightbox");
    if (!lb?.classList.contains("is-open")) return;
    if (e.key === "Escape")     closeLightbox();
    if (e.key === "ArrowRight") lightboxNext();
    if (e.key === "ArrowLeft")  lightboxPrev();
  });
}

/* ─── Contact ───────────────────────────────────────── */
function renderContact() {
  const addr = document.getElementById("contactAddress");
  if (addr instanceof HTMLAnchorElement) {
    addr.textContent = `${CONTACT.address.street}, ${CONTACT.address.postalCode} ${CONTACT.address.city}`;
    addr.href   = CONTACT.mapsUrl || `https://maps.google.com/?q=${encodeURIComponent(CONTACT.address.street + ', ' + CONTACT.address.postalCode + ' ' + CONTACT.address.city)}`;
    addr.target = "_blank";
  }

  const phone = document.getElementById("contactPhone");
  if (phone instanceof HTMLAnchorElement) {
    phone.textContent = CONTACT.phone.display;
    phone.href = formatTelLink(CONTACT.phone.raw);
  }

  const ig = document.getElementById("contactInstagram");
  if (ig instanceof HTMLAnchorElement) {
    ig.textContent = `@${CONTACT.instagram.handle}`;
    ig.href = CONTACT.instagram.url;
    ig.target = "_blank";
  }

  const fb = document.getElementById("contactFacebook");
  if (fb instanceof HTMLAnchorElement) {
    fb.textContent = CONTACT.facebook.name;
    fb.href = CONTACT.facebook.url;
    fb.target = "_blank";
  }

  const hoursList = document.getElementById("hoursList");
  if (hoursList) {
    hoursList.innerHTML = CONTACT.hours.map(h => `
      <div class="hours__row">
        <div class="hours__day">${h.day}</div>
        <div class="hours__time">${h.hours}</div>
      </div>
    `).join("");
  }

  const note = document.getElementById("hoursNote");
  if (note) note.textContent = CONTACT.hoursNote;

  const map = document.getElementById("mapEmbed");
  if (map instanceof HTMLIFrameElement) {
    map.src   = CONTACT.mapEmbedUrl;
    map.title = `Karta – ${BRAND.name}`;
  }
}

/* ─── Contact Form ──────────────────────────────────── */
function setupContactForm() {
  const form   = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const submit = document.getElementById("formSubmit");
  if (!form) return;

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const name    = form.elements["name"]?.value.trim();
    const email   = form.elements["email"]?.value.trim();
    const subject = form.elements["subject"]?.value;
    const message = form.elements["message"]?.value.trim();

    if (!name || !email || !message) {
      if (status) { status.textContent = "Vänligen fyll i alla obligatoriska fält."; status.className = "form-status error"; }
      return;
    }

    if (submit) { submit.disabled = true; submit.textContent = "Skickar…"; }

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json"
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (status) { status.textContent = "Tack! Vi har mottagit ditt meddelande."; status.className = "form-status success"; }
        form.reset();
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      if (status) { status.textContent = "Ett fel uppstod. Försök igen eller kontakta oss direkt."; status.className = "form-status error"; }
    } finally {
      if (submit) { submit.disabled = false; submit.textContent = "Skicka meddelande"; }
    }
  });
}

/* ─── Reveal animations ─────────────────────────────── */
function setupReveal() {
  if (PREFERS_REDUCED_MOTION) return;
  const items = document.querySelectorAll(".reveal, .reveal-3d, .stagger-children");
  if (!items.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

  items.forEach(el => obs.observe(el));
}

function setupCurtainReveals() {
  if (PREFERS_REDUCED_MOTION) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -80px 0px" });

  document.querySelectorAll(".curtain-reveal").forEach(el => obs.observe(el));
}

/* ─── Stats counter animation ───────────────────────── */
function setupStatsCounters() {
  const counters = document.querySelectorAll(".stat-card__number[data-count]");
  if (!counters.length) return;

  /* Reduced motion: just show the final number immediately */
  if (PREFERS_REDUCED_MOTION) {
    counters.forEach(el => { el.textContent = el.dataset.count; });
    return;
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      obs.unobserve(entry.target);
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const dur    = 1600;
      const start  = performance.now();

      function tick(now) {
        const t    = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - t, 4);
        el.textContent = Math.round(ease * target);
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

  counters.forEach(el => obs.observe(el));
}

/* ─── Lazy loading ──────────────────────────────────── */
function setupLazyLoading() {
  const imgs = document.querySelectorAll('img[loading="lazy"]');
  if (!imgs.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      img.addEventListener("load", () => img.classList.add("is-loaded"), { once: true });
      obs.unobserve(img);
    });
  }, { threshold: 0.1, rootMargin: "80px 0px" });
  imgs.forEach(img => obs.observe(img));
}

/* ─── Tilt on service cards ─────────────────────────── */
function setupTilt() {
  if (PREFERS_REDUCED_MOTION || IS_COARSE_POINTER) return;
  const items = [...document.querySelectorAll(".service-card.tilt, .testimonial.glass")];
  const max   = 7;

  for (const el of items) {
    let raf = 0;
    el.addEventListener("pointermove", ev => {
      const r  = el.getBoundingClientRect();
      const px = (ev.clientX - r.left) / r.width;
      const py = (ev.clientY - r.top)  / r.height;
      const ry = (px - 0.5) * (max * 2);
      const rx = (0.5 - py) * (max * 2);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateZ(12px)`;
      });
    });
    el.addEventListener("pointerleave", () => {
      cancelAnimationFrame(raf);
      el.style.transition = "transform 0.5s cubic-bezier(0.2, 0.9, 0.2, 1)";
      el.style.transform  = "translateZ(0)";
      setTimeout(() => { el.style.transition = ""; }, 500);
    });
  }
}

/* ─── Magnetic buttons ──────────────────────────────── */
function setupMagneticButtons() {
  if (PREFERS_REDUCED_MOTION || IS_COARSE_POINTER) return;
  document.querySelectorAll(".btn--primary, .btn--nav").forEach(btn => {
    btn.addEventListener("mousemove", e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.28;
      const y = (e.clientY - r.top  - r.height / 2) * 0.28;
      btn.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
    btn.addEventListener("mouseleave", () => { btn.style.transform = "translate3d(0, 0, 0)"; });
  });
}

/* ─── Hero parallax ─────────────────────────────────── */
function setupHeroParallax() {
  if (!ENABLE_PARALLAX) return;
  const bg = document.getElementById("heroBg");
  if (!bg) return;
  let raf = 0;
  window.addEventListener("scroll", () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const shift = Math.min(window.scrollY * 0.14, 80);
      bg.style.transform = `translateY(${shift}px) scale(1.10)`;
    });
  }, { passive: true });
}

/* ─── Hero particles ────────────────────────────────── */
function setupHeroParticles() {
  if (PREFERS_REDUCED_MOTION) return;
  const container = document.getElementById("heroParticles");
  if (!container) return;

  const small = IS_COARSE_POINTER ? 25 : 50;
  const large = IS_COARSE_POINTER ? 8  : 14;

  for (let i = 0; i < small; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const size = Math.random() * 3 + 1.5;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      animation-delay:${Math.random() * 9}s;
      animation-duration:${Math.random() * 5 + 7}s;
      opacity:${Math.random() * 0.45 + 0.2};
      ${Math.random() > 0.7 ? "filter:blur(1px);" : ""}
    `;
    container.appendChild(p);
  }
  for (let i = 0; i < large; i++) {
    const p = document.createElement("div");
    p.className = "particle particle--large";
    p.style.cssText = `
      left:${Math.random() * 100}%;
      animation-delay:${Math.random() * 8}s;
      animation-duration:${Math.random() * 4 + 9}s;
    `;
    container.appendChild(p);
  }
}

/* ─── Accessibility skip link ───────────────────────── */
function setupAccessibility() {
  const skip = document.createElement("a");
  skip.href = "#main";
  skip.className = "skip-link";
  skip.textContent = "Hoppa till huvudinnehåll";
  document.body.insertBefore(skip, document.body.firstChild);
}

/* ─── Three.js 3D Hero Scene ────────────────────────── */
function setupLazyThreeJS() {
  const heroSection = document.getElementById("hem");
  if (!heroSection || !ENABLE_HERO_3D) return;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      initHero3D();
      observer.disconnect();
    }
  }, { threshold: 0.1 });

  observer.observe(heroSection);
}

/* ─── Bonus Card Mobile Flip ─────────────────────────── */
function setupBonusCardFlip() {
  const bonusCard = document.querySelector(".bonus-card");
  if (!bonusCard) return;

  const inner = bonusCard.querySelector(".bonus-card__inner");

  // Only add click handler on touch devices
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  
  if (isTouch) {
    bonusCard.addEventListener("click", () => {
      inner.classList.toggle("flipped");
    });
  }
}

async function initHero3D() {
  const canvas = document.getElementById("heroCanvas");
  if (!(canvas instanceof HTMLCanvasElement)) return;

  let THREE;
  try {
    THREE = await import("https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js");
  } catch {
    return;
  }

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });

  const dpr = Math.min(window.devicePixelRatio || 1, IS_COARSE_POINTER ? 1.5 : 2);
  renderer.setPixelRatio(dpr);
  renderer.toneMapping       = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);
  camera.position.set(0, 0.3, 7.5);

  scene.fog = new THREE.FogExp2(0x080808, 0.09);

  /* Materials */
  const goldMat = new THREE.MeshPhysicalMaterial({
    color:              0xc9a96e,
    metalness:          0.92,
    roughness:          0.18,
    clearcoat:          0.9,
    clearcoatRoughness: 0.12,
    reflectivity:       0.85,
  });

  const darkMat = new THREE.MeshPhysicalMaterial({
    color:              0x111111,
    metalness:          0.35,
    roughness:          0.65,
    clearcoat:          0.5,
    clearcoatRoughness: 0.4,
  });

  /* Lights */
  scene.add(new THREE.AmbientLight(0xfff0d6, 0.25));

  const key = new THREE.DirectionalLight(0xfff5e0, 1.1);
  key.position.set(3, 3.5, 4);
  scene.add(key);

  const rim = new THREE.PointLight(0xc9a96e, 2.8, 22);
  rim.position.set(-3, 1.5, 2.5);
  scene.add(rim);

  const fill = new THREE.PointLight(0xc8c0ff, 0.8, 20);
  fill.position.set(2, -2, 3);
  scene.add(fill);

  const back = new THREE.PointLight(0xc9a96e, 1.2, 18);
  back.position.set(0, -1, -3);
  scene.add(back);

  const rig = new THREE.Group();
  scene.add(rig);

  /* ── Scissors model ── */
  function makeScissors() {
    const g = new THREE.Group();

    /* Blades – tapered flat shape */
    const bladeGeo = new THREE.CylinderGeometry(0.025, 0.065, 2.2, 20);
    const bladeA   = new THREE.Mesh(bladeGeo, goldMat);
    const bladeB   = new THREE.Mesh(bladeGeo, goldMat);
    bladeA.rotation.z = Math.PI * 0.18;
    bladeB.rotation.z = -Math.PI * 0.18;
    bladeA.position.y = 0.3;
    bladeB.position.y = 0.3;

    /* Rings */
    const ringGeo = new THREE.TorusGeometry(0.3, 0.08, 20, 36);
    const rA = new THREE.Mesh(ringGeo, darkMat);
    const rB = new THREE.Mesh(ringGeo, darkMat);
    rA.position.set(-0.38, -0.9, 0);
    rB.position.set( 0.38, -0.9, 0);

    /* Pivot */
    const bolt = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 20), goldMat);
    bolt.position.set(0, -0.15, 0);

    /* Screw detail */
    const screwRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.07, 0.025, 10, 20),
      goldMat
    );
    screwRing.position.set(0, -0.15, 0.08);

    g.add(bladeA, bladeB, rA, rB, bolt, screwRing);
    g.scale.setScalar(0.82);
    return g;
  }

  /* ── Straight razor ── */
  function makeRazor() {
    const g = new THREE.Group();

    const handle = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 1.5, 0.14, 3, 10, 3),
      darkMat
    );
    handle.position.y = -0.4;

    const hinge = new THREE.Mesh(
      new THREE.CylinderGeometry(0.068, 0.068, 0.22, 20),
      goldMat
    );
    hinge.rotation.z = Math.PI / 2;
    hinge.position.y = 0.44;

    /* Blade with chamfer edge */
    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.2, 0.055),
      goldMat
    );
    blade.position.set(0.36, 0.6, 0);

    /* Edge highlight */
    const edge = new THREE.Mesh(
      new THREE.BoxGeometry(0.88, 0.02, 0.06),
      new THREE.MeshPhysicalMaterial({ color: 0xffd080, metalness: 1, roughness: 0.05 })
    );
    edge.position.set(0.36, 0.69, 0);

    g.add(handle, hinge, blade, edge);
    g.rotation.z = -0.28;
    g.scale.setScalar(1.05);
    return g;
  }

  /* ── Comb ── */
  function makeComb() {
    const g    = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1.3, 0.18, 0.12),
      darkMat
    );
    body.position.y = 0.22;

    const count   = 16;
    const toothGeo = new THREE.BoxGeometry(0.04, 0.26, 0.09);
    const teeth   = new THREE.InstancedMesh(toothGeo, goldMat, count);
    for (let i = 0; i < count; i++) {
      const m = new THREE.Matrix4();
      m.makeTranslation(-0.6 + i * (1.2 / (count - 1)), 0.04, 0);
      teeth.setMatrixAt(i, m);
    }
    teeth.instanceMatrix.needsUpdate = true;

    g.add(body, teeth);
    g.rotation.z = 0.2;
    return g;
  }

  /* ── Brush ── */
  function makeBrush() {
    const g      = new THREE.Group();
    const handle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.12, 1.1, 20),
      darkMat
    );
    handle.position.y = -0.2;

    const ferrule = new THREE.Mesh(
      new THREE.CylinderGeometry(0.115, 0.1, 0.15, 20),
      goldMat
    );
    ferrule.position.y = 0.38;

    const knot = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.6),
      new THREE.MeshPhysicalMaterial({ color: 0xd4c0a0, metalness: 0, roughness: 0.9 })
    );
    knot.position.y = 0.55;

    g.add(handle, ferrule, knot);
    g.scale.setScalar(0.9);
    return g;
  }

  /* Arrange tools in a ring */
  const makers = [makeScissors, makeRazor, makeComb, makeBrush, makeScissors];
  const tools  = [];

  for (let i = 0; i < makers.length; i++) {
    const obj    = makers[i]();
    const angle  = (i / makers.length) * Math.PI * 2;
    const radius = 2.2 + (i % 2) * 0.5;

    obj.position.set(
      Math.cos(angle) * radius,
      (i % 3) * 0.4 - 0.4,
      -0.9 - (i % 2) * 0.3
    );
    obj.rotation.x = (i * 0.24) % Math.PI;
    obj.rotation.y = (i * 0.37) % Math.PI;

    tools.push({ obj, baseY: obj.position.y, spin: 0.15 + i * 0.03, phase: i * 1.1 });
    rig.add(obj);
  }

  /* Sparkle field */
  const pCount = IS_COARSE_POINTER ? 90 : 160;
  const pGeo   = new THREE.BufferGeometry();
  const pPos   = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pPos[i * 3 + 0] = (Math.random() - 0.5) * 9;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 5;
    pPos[i * 3 + 2] = -Math.random() * 4.5;
  }
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  const sparkles = new THREE.Points(pGeo, new THREE.PointsMaterial({
    color:       0xc9a96e,
    size:        0.018,
    transparent: true,
    opacity:     0.6,
    depthWrite:  false,
  }));
  rig.add(sparkles);

  /* Resize handler */
  function resize() {
    const r = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.floor(r.width));
    const h = Math.max(1, Math.floor(r.height));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  /* Pointer tracking */
  const pointer = { x: 0, y: 0 };
  const target  = { x: 0, y: 0 };
  window.addEventListener("pointermove", e => {
    target.x = (e.clientX / window.innerWidth)  * 2 - 1;
    target.y = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });
  window.addEventListener("touchmove", e => {
    const t  = e.touches[0];
    target.x = (t.clientX / window.innerWidth)  * 2 - 1;
    target.y = (t.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  /* Visibility pause */
  let running = true;
  const heroSection = document.getElementById("hem");
  if (heroSection) {
    new IntersectionObserver((entries) => {
      running = entries[0]?.isIntersecting ?? true;
      if (running) startLoop();
    }, { threshold: 0.06 }).observe(heroSection);
  }

  /* Scroll-based camera shift */
  let scrollY  = 0;
  window.addEventListener("scroll", () => { scrollY = window.scrollY; }, { passive: true });

  const clock = new THREE.Clock();
  let raf = 0;
  let looping = false;

  function startLoop() {
    if (looping) return;
    looping = true;
    loop();
  }

  function loop() {
    if (!running) { looping = false; return; }
    raf = requestAnimationFrame(loop);

    const t = clock.getElapsedTime();

    pointer.x += (target.x - pointer.x) * 0.045;
    pointer.y += (target.y - pointer.y) * 0.045;

    rig.rotation.y = pointer.x * 0.25;
    rig.rotation.x = pointer.y * 0.1;

    /* Subtle scroll drift */
    const scrollFactor = Math.min(scrollY * 0.0004, 0.4);
    camera.position.z = 7.5 - scrollFactor * 1.5;
    camera.position.y = 0.3 + scrollFactor * 0.5;

    for (const it of tools) {
      it.obj.rotation.y += 0.003 + it.spin * 0.002;
      it.obj.rotation.x += 0.0015;
      it.obj.position.y  = it.baseY + Math.sin(t * (0.7 + it.spin) + it.phase) * 0.22;
    }

    sparkles.rotation.y = t * 0.04;
    sparkles.rotation.x = t * 0.015;

    /* Pulsing rim light */
    rim.intensity = 2.4 + Math.sin(t * 1.8) * 0.6;

    renderer.render(scene, camera);
  }

  startLoop();
}

/* ─── Open / Closed Status ──────────────────────────── */
function initOpenStatus() {
  const badge    = document.getElementById("openBadge");
  const text     = document.getElementById("openBadgeText");
  if (!badge || !text) return;

  const scheduleMap = {
    1: { opens: "11:00", closes: "21:00" }, // Måndag
    2: { opens: "10:00", closes: "22:00" }, // Tisdag
    3: { opens: "10:00", closes: "22:00" }, // Onsdag
    4: { opens: "10:00", closes: "22:00" }, // Torsdag
    5: { opens: "10:00", closes: "22:00" }, // Fredag
    6: { opens: "10:00", closes: "22:00" }, // Lördag
    0: { opens: "10:00", closes: "22:00" }, // Söndag
  };

  function toMinutes(t) {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  }

  function update() {
    const now      = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Stockholm" }));
    const day      = now.getDay();
    const current  = now.getHours() * 60 + now.getMinutes();
    const schedule = scheduleMap[day];

    if (!schedule) {
      badge.className = "open-badge is-closed";
      text.textContent = "Stängt idag";
      return;
    }

    const opens  = toMinutes(schedule.opens);
    const closes = toMinutes(schedule.closes);

    if (current >= opens && current < closes) {
      badge.className = "open-badge is-open";
      text.textContent = `Öppet · stänger ${schedule.closes}`;
    } else if (current < opens) {
      badge.className = "open-badge is-closed";
      text.textContent = `Stängt · öppnar ${schedule.opens}`;
    } else {
      const tomorrow = scheduleMap[(day + 1) % 7];
      badge.className = "open-badge is-closed";
      text.textContent = tomorrow
        ? `Stängt · öppnar imorgon ${tomorrow.opens}`
        : "Stängt";
    }
  }

  update();
  setInterval(update, 60_000);
}

/* ─── Dark / Light Mode Toggle ──────────────────────── */
function initDarkMode() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  const saved = localStorage.getItem("redelux-theme");
  if (saved) document.documentElement.setAttribute("data-theme", saved);

  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next    = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("redelux-theme", next);
  });
}

/* ─── Floating Book Button ──────────────────────────── */
function initFloatingBook() {
  const btn = document.getElementById("floatBook");
  if (!btn) return;

  const hero = document.getElementById("hem");
  const cta  = document.getElementById("boka");

  const obs = new IntersectionObserver((entries) => {
    const anyVisible = entries.some(e => e.isIntersecting);
    btn.classList.toggle("is-hidden", anyVisible);
  }, { threshold: 0.3 });

  if (hero) obs.observe(hero);
  if (cta)  obs.observe(cta);
}

/* ─── Service Filter Pills ──────────────────────────── */
function initServiceFilter() {
  const root   = document.getElementById("servicesRoot");
  const filter = document.getElementById("serviceFilter");
  if (!root || !filter) return;

  const categories = ["Alla", ...SERVICES.map(s => s.category)];
  let active = "Alla";

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = `filter-pill${cat === "Alla" ? " is-active" : ""}`;
    btn.textContent = cat;
    btn.setAttribute("aria-pressed", String(cat === "Alla"));
    btn.addEventListener("click", () => {
      active = cat;
      filter.querySelectorAll(".filter-pill").forEach(p => {
        p.classList.toggle("is-active", p.textContent === active);
        p.setAttribute("aria-pressed", String(p.textContent === active));
      });
      root.querySelectorAll(".service-category").forEach(el => {
        const name = el.querySelector(".service-category__name")?.textContent?.trim() ?? "";
        const show = active === "Alla" || name.includes(active);
        el.style.transition = "opacity 0.3s, transform 0.3s";
        if (show) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          el.style.display = "";
        } else {
          el.style.opacity = "0";
          el.style.transform = "translateY(12px)";
          setTimeout(() => { if (active !== "Alla" && !name.includes(active)) el.style.display = "none"; }, 300);
        }
      });
    });
    filter.appendChild(btn);
  });
}

/* ─── Typewriter Effect ─────────────────────────────── */
function initTypewriter() {
  if (PREFERS_REDUCED_MOTION) return;
  const el = document.querySelector(".hero__sub");
  if (!el) return;

  const phrases = [
    "Premium Frisörsalong",
    "Precision & Stil",
    "Götgatan 18, Kristianstad",
    "Öppet 7 dagar i veckan",
  ];

  const cursor = document.createElement("span");
  cursor.className = "typewriter-cursor";
  cursor.setAttribute("aria-hidden", "true");
  el.textContent = "";
  el.appendChild(cursor);

  let pi = 0, ci = 0, deleting = false;

  function tick() {
    const phrase = phrases[pi];
    const shown  = phrase.slice(0, ci);
    // Only remove a text node — never remove the cursor span itself
    if (el.firstChild && el.firstChild.nodeType === Node.TEXT_NODE) {
      el.firstChild.remove();
    }
    if (!el.contains(cursor)) el.appendChild(cursor);
    el.insertBefore(document.createTextNode(shown), cursor);

    if (!deleting && ci < phrase.length) {
      ci++;
      setTimeout(tick, 62 + Math.random() * 40);
    } else if (!deleting && ci === phrase.length) {
      deleting = true;
      setTimeout(tick, 1800);
    } else if (deleting && ci > 0) {
      ci--;
      setTimeout(tick, 32);
    } else {
      deleting = false;
      pi = (pi + 1) % phrases.length;
      setTimeout(tick, 420);
    }
  }
  setTimeout(tick, 1200);
}

/* ─── Boot ──────────────────────────────────────────── */
initPreloader();
initDarkMode();
initHamburger();
setupScrollProgress();
setupHeaderScroll();
setupScrollTop();
hydrateStaticText();
setHeroBackground();
setupHeroParticles();
renderServices();
renderGallery();
setupCustomCursor();
renderContact();
setBookingLinks();
setupLightbox();
setupContactForm();
setupMagneticButtons();
setupTilt();
setupReveal();
setupCurtainReveals();
setupStatsCounters();
setupLazyLoading();
setupAccessibility();
setupHeroParallax();
initOpenStatus();
initFloatingBook();
initServiceFilter();
initTypewriter();
setupLazyThreeJS();
setupBonusCardFlip();
