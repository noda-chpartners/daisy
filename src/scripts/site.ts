import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const header = document.querySelector<HTMLElement>(".header");
const toggle = document.querySelector<HTMLButtonElement>(".menu-toggle");
const overlay = document.querySelector<HTMLElement>(".nav-overlay");
const closeBtn = document.querySelector<HTMLButtonElement>(".nav-close");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const lenis = new Lenis({
  duration: 1.15,
  anchors: { offset: -88 },
  stopInertiaOnNavigate: true,
});

lenis.on("scroll", (instance) => {
  ScrollTrigger.update();
  header?.classList.toggle("is-scrolled", instance.scroll > 8);
});

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

function closeMenu(returnFocus = true) {
  if (!overlay || !toggle) return;
  lenis.start();
  document.documentElement.classList.remove("menu-open");
  toggle.setAttribute("aria-expanded", "false");
  gsap.to(overlay, {
    autoAlpha: 0,
    duration: reduceMotion ? 0 : 0.32,
    ease: "power2.in",
    overwrite: true,
    onComplete: () => {
      overlay.setAttribute("inert", "");
      overlay.setAttribute("aria-hidden", "true");
      if (returnFocus) toggle.focus();
    },
  });
}

function openMenu() {
  if (!overlay || !toggle || !closeBtn) return;
  lenis.stop();
  document.documentElement.classList.add("menu-open");
  overlay.removeAttribute("inert");
  overlay.setAttribute("aria-hidden", "false");
  toggle.setAttribute("aria-expanded", "true");
  gsap.to(overlay, {
    autoAlpha: 1,
    duration: reduceMotion ? 0 : 0.45,
    ease: "power2.out",
    overwrite: true,
  });
  if (!reduceMotion) {
    gsap.fromTo(
      overlay.querySelectorAll("a, .nav-overlay-foot"),
      { autoAlpha: 0, y: 16 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.05,
        delay: 0.06,
        ease: "power3.out",
        overwrite: true,
      },
    );
  }
  closeBtn.focus();
}

toggle?.addEventListener("click", openMenu);
closeBtn?.addEventListener("click", () => closeMenu());

overlay?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href") ?? "";
    closeMenu(false);
    if (!href.startsWith("#")) return;
    event.preventDefault();
    lenis.scrollTo(href, { offset: -88 });
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && toggle?.getAttribute("aria-expanded") === "true") {
    closeMenu();
  }
});

document.querySelectorAll<HTMLElement>("[data-section]").forEach((section) => {
  const id = section.id;
  ScrollTrigger.create({
    trigger: section,
    start: "top center",
    end: "bottom center",
    onToggle: (self) => {
      document
        .querySelector(`.rail a[href="#${id}"]`)
        ?.classList.toggle("is-active", self.isActive);
    },
  });
});

const motion = gsap.matchMedia();

motion.add("(prefers-reduced-motion: no-preference)", () => {
  document.documentElement.dataset.animated = "true";

  const hero = gsap.timeline({
    defaults: { ease: "power3.out" },
    onComplete: () => {
      document.documentElement.classList.remove("hero-prepare");
      gsap.set(
        ".hero-kicker, .hero-title, .hero-place, .hero-lead, .hero-foot, .hero-frame, .hero-visual .media, .hero-visual .parallax img",
        { clearProps: "transform,opacity,visibility,clipPath" },
      );
    },
  });

  hero
    .to(".hero-kicker", { autoAlpha: 1, y: 0, duration: 0.75 }, 0.08)
    .to(".hero-title", { autoAlpha: 1, y: 0, duration: 1.05 }, 0.18)
    .to(".hero-place", { autoAlpha: 1, y: 0, duration: 0.8 }, 0.36)
    .to(".hero-lead", { autoAlpha: 1, y: 0, duration: 0.85 }, 0.48)
    .to(
      ".hero-visual .media",
      { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1.25, ease: "power3.inOut" },
      0.12,
    )
    .to(".hero-frame", { autoAlpha: 1, duration: 1 }, 0.4)
    .to(".hero-visual .parallax img", { scale: 1, duration: 1.55, ease: "power2.out" }, 0.12)
    .to(".hero-foot", { autoAlpha: 1, y: 0, duration: 0.8 }, 0.62);

  gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
    gsap.from(el, {
      autoAlpha: 0,
      y: 32,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 86%",
        once: true,
      },
    });
  });

  gsap.from(".step", {
    autoAlpha: 0,
    y: 28,
    duration: 0.9,
    stagger: 0.12,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".steps",
      start: "top 82%",
      once: true,
    },
  });
});

motion.add("(min-width: 980px) and (prefers-reduced-motion: no-preference)", () => {
  gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
    const trigger = el.closest(".media, .atmosphere-media");
    if (!trigger) return;
    gsap.to(el, {
      yPercent: 5,
      ease: "none",
      scrollTrigger: {
        trigger,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });
});

window.addEventListener("load", () => {
  ScrollTrigger.refresh();
});
