/* Maison Nabhan — interactions
   GSAP core + ScrollTrigger
*/
gsap.registerPlugin(ScrollTrigger);

/* ---------- helpers ---------- */
const qs = (s, r = document) => r.querySelector(s);
const qsa = (s, r = document) => [...r.querySelectorAll(s)];
const lerp = (a, b, n) => a + (b - a) * n;

/* ---------- custom cursor ---------- */
(() => {
  const cursor = qs(".cursor");
  if (!cursor) return;
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let cx = mx, cy = my;
  window.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; });
  const tick = () => {
    cx = lerp(cx, mx, 0.18);
    cy = lerp(cy, my, 0.18);
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(tick);
  };
  tick();
  qsa("a, button, [data-magnet]").forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
  });
})();

/* ---------- magnetic links ---------- */
qsa("[data-magnet]").forEach((el) => {
  const strength = 0.25;
  el.addEventListener("mousemove", (e) => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    gsap.to(el, { x: x * strength, y: y * strength, duration: 0.5, ease: "power3.out" });
  });
  el.addEventListener("mouseleave", () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
  });
});

/* ---------- loader ---------- */
const runLoader = () =>
  new Promise((resolve) => {
    const counter = qs("#loaderCount");
    const fill = qs("#loaderBar");
    const obj = { v: 0 };
    const tl = gsap.timeline({ onComplete: resolve });
    tl.to(obj, {
      v: 100,
      duration: 1.6,
      ease: "power2.inOut",
      onUpdate: () => {
        counter.textContent = String(Math.floor(obj.v)).padStart(2, "0");
        fill.style.right = 100 - obj.v + "%";
      },
    });
    tl.to(".loader__line", { y: "0%", duration: 0.9, ease: "power4.out", stagger: 0.05 }, 0.2);
    tl.to(".loader__line", { y: "-110%", duration: 0.7, ease: "power4.in", stagger: 0.04 }, "+=0.4");
    tl.to(
      ".loader",
      { yPercent: -100, duration: 1, ease: "expo.inOut", onComplete: () => qs("#loader").style.display = "none" },
      "-=0.2"
    );
  });

/* ---------- hero reveal ---------- */
const heroReveal = () => {
  const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
  tl.to(".hero__row .word", {
    y: "0%",
    duration: 1.1,
    stagger: 0.08,
  });
  tl.from(".hero__meta .meta-line", { y: 20, opacity: 0, stagger: 0.1, duration: 0.8 }, "-=0.6");
  tl.from(".hero__lede p", { y: 24, opacity: 0, duration: 0.8 }, "-=0.6");
  tl.from(".hero__scroll", { y: 24, opacity: 0, duration: 0.8 }, "-=0.7");
  tl.from(".plate", { scale: 0.8, opacity: 0, duration: 1.2, stagger: 0.1 }, "-=1");
  tl.from(".plate__caption", { opacity: 0, x: -20, duration: 0.6 }, "-=0.6");
  tl.from(".nav", { y: -30, opacity: 0, duration: 0.8 }, "-=1");
};

/* ---------- plate parallax ---------- */
const platePara = () => {
  gsap.to(".plate--silk1", {
    yPercent: -25,
    rotate: -4,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });
  gsap.to(".plate--silk2", {
    yPercent: 30,
    rotate: 6,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });
};

/* ---------- marquee infinite ---------- */
const marquee = () => {
  const track = qs(".marquee__track");
  if (!track) return;
  const distance = track.scrollWidth / 2;
  gsap.to(track, {
    x: -distance,
    duration: 28,
    ease: "none",
    repeat: -1,
  });
};

/* ---------- manifesto word reveal (safe DOM build) ---------- */
const manifesto = () => {
  const el = qs("#manifestoText");
  if (!el) return;

  const wrapTextNode = (node) => {
    const text = node.nodeValue;
    const frag = document.createDocumentFragment();
    const parts = text.split(/(\s+)/);
    parts.forEach((part) => {
      if (part.trim() === "") {
        frag.appendChild(document.createTextNode(part));
      } else {
        const span = document.createElement("span");
        span.className = "reveal-word";
        span.textContent = part;
        frag.appendChild(span);
      }
    });
    node.parentNode.replaceChild(frag, node);
  };

  const walk = (root) => {
    const kids = [...root.childNodes];
    kids.forEach((n) => {
      if (n.nodeType === Node.TEXT_NODE) wrapTextNode(n);
      else if (n.nodeType === Node.ELEMENT_NODE) walk(n);
    });
  };
  walk(el);

  const words = qsa(".reveal-word", el);
  gsap.to(words, {
    opacity: 1,
    stagger: 0.04,
    ease: "none",
    scrollTrigger: {
      trigger: el,
      start: "top 75%",
      end: "bottom 55%",
      scrub: true,
    },
  });
};

/* ---------- works cards entry ---------- */
const works = () => {
  qsa(".card").forEach((card) => {
    gsap.from(card.querySelector(".card__media"), {
      yPercent: 12,
      ease: "none",
      scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
    });
    gsap.from(card.querySelector(".card__body"), {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: card, start: "top 75%" },
    });
    gsap.from(card.querySelector(".card__no"), {
      x: -20,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: card, start: "top 80%" },
    });
  });

  qsa(".section-head").forEach((sh) => {
    gsap.from(sh.children, {
      y: 30, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.08,
      scrollTrigger: { trigger: sh, start: "top 85%" },
    });
  });
};

/* ---------- horizontal gallery ---------- */
const gallery = () => {
  if (window.innerWidth < 800) return;
  const pin = qs(".gallery__pin");
  const track = qs("#galleryTrack");
  if (!pin || !track) return;

  const initScroll = () => {
    const getDistance = () => Math.max(0, track.scrollWidth - pin.offsetWidth);

    gsap.fromTo(
      track,
      { x: 0 },
      {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: ".gallery",
          start: "top top",
          end: () => "+=" + getDistance(),
          pin: pin,
          pinSpacing: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      }
    );

    ScrollTrigger.refresh();
  };

  // IG embed.js processes blockquotes asynchronously — wait for iframes before measuring
  if (window.instgrm && window.instgrm.Embeds) {
    window.instgrm.Embeds.process();
    // Give iframes ~1.5s to render then init
    setTimeout(initScroll, 1500);
  } else {
    // embed.js not yet loaded — wait for it
    const interval = setInterval(() => {
      if (window.instgrm && window.instgrm.Embeds) {
        clearInterval(interval);
        window.instgrm.Embeds.process();
        setTimeout(initScroll, 1500);
      }
    }, 200);
    // Fallback: init anyway after 4s so layout doesn't stay broken
    setTimeout(() => { clearInterval(interval); initScroll(); }, 4000);
  }
};

/* ---------- atelier steps ---------- */
const atelier = () => {
  qsa(".step").forEach((s, i) => {
    gsap.from(s, {
      y: 60, opacity: 0, duration: 1, ease: "power3.out", delay: i * 0.05,
      scrollTrigger: { trigger: ".steps", start: "top 75%" },
    });
  });
};

/* ---------- contact rows ---------- */
const contact = () => {
  qsa(".contact__row").forEach((row) => {
    gsap.from(row, {
      y: 30, opacity: 0, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: row, start: "top 90%" },
    });
  });

  gsap.from(".contact__title span", {
    y: "100%", opacity: 0, duration: 1.1, ease: "power4.out", stagger: 0.08,
    scrollTrigger: { trigger: ".contact__title", start: "top 80%" },
  });

  gsap.fromTo(
    "#footBig",
    { x: "8%" },
    {
      x: "-8%",
      ease: "none",
      scrollTrigger: { trigger: ".foot", start: "top bottom", end: "bottom top", scrub: true },
    }
  );
};

/* ---------- boot ---------- */
window.addEventListener("load", async () => {
  gsap.set(".hero__row .word", { y: "110%" });
  await runLoader();
  heroReveal();
  platePara();
  marquee();
  manifesto();
  works();
  gallery();
  atelier();
  contact();
  ScrollTrigger.refresh();
});
