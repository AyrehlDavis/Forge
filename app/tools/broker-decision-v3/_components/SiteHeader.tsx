"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { href: "https://ariseenergy.com/how-it-works", label: "How it works" },
  { href: "https://ariseenergy.com/about", label: "About" },
  { href: "https://ariseenergy.com/our-process", label: "Our process" },
  { href: "https://ariseenergy.com/pricewatch", label: "PriceWatch" },
];

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    hamburgerRef.current?.focus();
  }, []);

  // Focus first drawer link on open
  useEffect(() => {
    if (!isMenuOpen) return;
    const firstLink = drawerRef.current?.querySelector<HTMLElement>("a");
    requestAnimationFrame(() => firstLink?.focus());
  }, [isMenuOpen]);

  // ESC + focus trap
  useEffect(() => {
    if (!isMenuOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") { closeMenu(); return; }
      if (e.key !== "Tab" || !drawerRef.current) return;
      const focusable = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>("a[href]")
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen, closeMenu]);

  // Click-outside to close
  useEffect(() => {
    if (!isMenuOpen) return;
    function onPointerDown(e: PointerEvent) {
      if (!(e.target as Element).closest?.("header")) closeMenu();
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isMenuOpen, closeMenu]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/55 shadow-[0_1px_0_rgba(255,255,255,0.85)_inset,0_8px_24px_-12px_rgba(15,23,42,0.08)] backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex max-w-[1184px] items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
        <Link
          href="/"
          aria-label="Arise Energy — home"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80 focus:outline-none focus-visible:opacity-80"
        >
          <Image
            src="/arise-logo.png"
            alt="Arise Energy"
            width={1330}
            height={324}
            priority
            className="h-[42px] w-auto"
          />
        </Link>

        {/* Inline nav — sm+ only. MP6: canonical focus rings on nav links. */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 sm:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded transition-colors hover:text-[#0A1F1F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006bc5] focus-visible:ring-offset-2"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://ariseenergy.com/get-in-touch"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center rounded-[10px] bg-[#006bc5] px-5 text-xs font-semibold text-white shadow-[0_2px_6px_-1px_rgba(0,107,197,0.4)] transition-colors hover:bg-[#0058a3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006bc5] focus-visible:ring-offset-2 motion-safe:transition-all"
          >
            Talk to us
          </a>
        </nav>

        {/* Mobile cluster — MP8: CTA h-11 (44px); MP7: hamburger h-11 w-11 (44px). */}
        <div className="flex items-center gap-2 sm:hidden">
          <a
            href="https://ariseenergy.com/get-in-touch"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center rounded-[10px] bg-[#006bc5] px-4 text-xs font-semibold text-white shadow-[0_2px_6px_-1px_rgba(0,107,197,0.4)] transition-colors hover:bg-[#0058a3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006bc5] focus-visible:ring-offset-2"
          >
            Talk to us
          </a>
          <button
            ref={hamburgerRef}
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="site-header-mobile-drawer"
            onClick={() => setIsMenuOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] border border-white/60 bg-white/55 text-slate-700 backdrop-blur-md transition-colors hover:text-[#0A1F1F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006bc5] focus-visible:ring-offset-2"
          >
            <span aria-hidden className="text-base leading-none">
              {isMenuOpen ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </div>

      {/* MP3/MP4: focus trap + click-outside handled in useEffect above.
          MP5: canonical ring focus pattern on drawer links. */}
      {isMenuOpen && (
        <nav
          ref={drawerRef}
          id="site-header-mobile-drawer"
          aria-label="Mobile navigation"
          className="border-b border-white/60 bg-white/55 backdrop-blur-xl backdrop-saturate-150 sm:hidden"
        >
          <ul className="mx-auto flex max-w-[1184px] flex-col px-5 py-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="block rounded py-3 text-sm font-medium text-slate-600 transition-colors hover:text-[#0A1F1F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006bc5] focus-visible:ring-offset-2"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
