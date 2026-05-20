import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-100 bg-white">
      <div className="mx-auto flex max-w-[1184px] items-center justify-between px-5 py-5 sm:px-8 sm:py-6">
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
            className="h-[46px] w-auto"
          />
          <span className="text-sm font-normal text-slate-400">/ Forge</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 sm:flex">
          <a className="transition-colors hover:text-[#0A1F1F]" href="#broker-check">How it works</a>
          <a className="transition-colors hover:text-[#0A1F1F]" href="#how-to-vet">What to ask</a>
          <a className="transition-colors hover:text-[#0A1F1F]" href="#faq">FAQ</a>
          <a
            href="#cta"
            className="inline-flex h-9 items-center rounded-full bg-[#007fe8] px-5 text-xs font-semibold text-white transition-colors hover:bg-[#006bc5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006bc5] focus-visible:ring-offset-2 motion-safe:transition-all"
          >
            Talk to us
          </a>
        </nav>
      </div>
    </header>
  );
}
