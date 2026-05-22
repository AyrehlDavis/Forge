import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-[1184px] flex-col gap-6 px-5 py-10 text-sm text-slate-500 sm:px-8 sm:py-12 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/arise-logo.png"
            alt="Arise Energy"
            width={1330}
            height={324}
            className="h-8 w-auto"
          />
          <span className="text-sm font-medium text-slate-400">/ Forge</span>
        </div>
        <p className="max-w-md text-xs leading-6">
          A free decision tool for commercial energy buyers. Arise Energy is part of Constellation, the largest competitive supplier in the U.S.
        </p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
          <li>
            <a className="transition-colors hover:text-[#006bc5]" href="/privacy">
              Privacy
            </a>
          </li>
          <li>
            <a className="transition-colors hover:text-[#006bc5]" href="/terms">
              Terms
            </a>
          </li>
          <li>
            <a className="transition-colors hover:text-[#006bc5]" href="#cta">
              Contact
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
