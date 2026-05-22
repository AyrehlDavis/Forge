"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const DRAWER_LINKS = [
  { href: "#broker-check", label: "How it works" },
  { href: "#how-to-vet", label: "What to ask" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsMenuOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

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
          <span className="text-sm font-normal text-slate-400">/ Forge</span>
        </Link>

        {/* Inline nav — sm+ only. Mobile gets the CTA + hamburger pair below. */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 sm:flex">
          <a className="transition-colors hover:text-[#0A1F1F]" href="#broker-check">
            How it works
          </a>
          <a className="transition-colors hover:text-[#0A1F1F]" href="#how-to-vet">
            What to ask
          </a>
          <a className="transition-colors hover:text-[#0A1F1F]" href="#faq">
            FAQ
          </a>
          <a
            href="#cta"
            className="inline-flex h-9 items-center rounded-[10px] bg-[#006bc5] px-5 text-xs font-semibold text-white shadow-[0_2px_6px_-1px_rgba(0,107,197,0.4)] transition-colors hover:bg-[#0058a3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006bc5] focus-visible:ring-offset-2 motion-safe:transition-all"
          >
            Talk to us
          </a>
        </nav>

        {/* Mobile cluster — Talk to us stays visible; hamburger opens drawer. */}
        <div className="flex items-center gap-2 sm:hidden">
          <a
            href="#cta"
            className="inline-flex h-9 items-center rounded-[10px] bg-[#006bc5] px-4 text-xs font-semibold text-white shadow-[0_2px_6px_-1px_rgba(0,107,197,0.4)] transition-colors hover:bg-[#0058a3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006bc5] focus-visible:ring-offset-2"
          >
            Talk to us
          </a>
          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="site-header-mobile-drawer"
            onClick={() => setIsMenuOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-white/60 bg-white/55 text-slate-700 backdrop-blur-md transition-colors hover:text-[#0A1F1F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006bc5] focus-visible:ring-offset-2"
          >
            <span aria-hidden className="text-base leading-none">
              {isMenuOpen ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav
          id="site-header-mobile-drawer"
          aria-label="Mobile navigation"
          className="border-b border-white/60 bg-white/55 backdrop-blur-xl backdrop-saturate-150 sm:hidden"
        >
          <ul className="mx-auto flex max-w-[1184px] flex-col px-5 py-2">
            {DRAWER_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-3 text-sm font-medium text-slate-600 transition-colors hover:text-[#0A1F1F] focus:outline-none focus-visible:text-[#0A1F1F]"
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
