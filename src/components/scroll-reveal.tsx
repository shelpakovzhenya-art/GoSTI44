"use client";

import { useEffect } from "react";

const selectors = [
  ".section-heading", ".about-copy", ".about-visual", ".house-card",
  ".company-copy", ".why-copy", ".why-visual", ".spa-copy", ".spa-visual",
  ".service-card", ".atmosphere-copy", ".gallery-photo", ".review-card",
  ".host-copy", ".host-photo", ".booking-intro", ".booking-box",
  ".rules-section > div", ".contact-copy", ".location-map", ".footer-main",
].join(",");

/** One entrance per block. Native scroll, no pinned content or animation dependency. */
export function ScrollReveal() {
  useEffect(() => {
    const root = document.getElementById("top");
    if (!root || !("IntersectionObserver" in window)) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const elements = Array.from(root.querySelectorAll<HTMLElement>(selectors));
    const animations = new Set<Animation>();
    const prepared = new Set<HTMLElement>();

    const show = (element: HTMLElement, animate: boolean) => {
      if (!prepared.delete(element)) return;
      delete element.dataset.enterPending;
      if (!animate || motion.matches) return;
      const card = element.matches(".house-card,.service-card,.review-card,.gallery-photo");
      const siblings = Array.from(element.parentElement?.children ?? []);
      const delay = card && window.innerWidth > 760 ? Math.min(Math.max(siblings.indexOf(element), 0), 3) * 75 : 0;
      const animation = element.animate([
        { opacity: 0, transform: `translateY(${card ? 56 : 36}px) scale(${card ? .975 : .99})`, transformOrigin: "50% 100%" },
        { opacity: 1, transform: "translateY(0) scale(1)", transformOrigin: "50% 100%" },
      ], { duration: card ? 1000 : 850, delay, easing: "cubic-bezier(.16,1,.3,1)", fill: "backwards" });
      animations.add(animation);
      animation.onfinish = () => { animations.delete(animation); animation.cancel(); };
    };
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        show(entry.target as HTMLElement, true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0, rootMargin: "0px 0px -24px 0px" });

    const clear = () => {
      observer.disconnect();
      for (const element of prepared) delete element.dataset.enterPending;
      prepared.clear();
      for (const animation of animations) animation.cancel();
      animations.clear();
    };
    const prepare = () => {
      clear();
      if (motion.matches) return;
      for (const element of elements) {
        // Above-the-fold content and restored/hash scroll positions never disappear on hydration.
        if (element.getBoundingClientRect().top < window.innerHeight) continue;
        element.dataset.enterPending = "";
        prepared.add(element);
        observer.observe(element);
      }
    };
    const onFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      const element = event.target.closest<HTMLElement>("[data-enter-pending]");
      if (element) { show(element, false); observer.unobserve(element); }
    };
    prepare();
    motion.addEventListener("change", prepare);
    root.addEventListener("focusin", onFocus);
    return () => { clear(); motion.removeEventListener("change", prepare); root.removeEventListener("focusin", onFocus); };
  }, []);
  return null;
}
