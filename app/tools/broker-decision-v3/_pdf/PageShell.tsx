// Print-page sized container for the PDF preview. Letter portrait = 8.5×11"
// at 96dpi = 816×1056 px. Letter landscape = 11×8.5" = 1056×816 px.
//
// The shell mimics print conventions (white bg, slate-200 border to indicate
// the page edge, shadow to lift the page off the preview canvas) without
// trying to be a perfect WYSIWYG @react-pdf/renderer mock. When the real PDF
// build lands at story 7.10, the children of these pages become @react-pdf
// <View> trees; the shell is preview-only.

import type { ReactNode } from "react";

interface PageShellProps {
  number: number;
  total: number;
  title: string;
  orientation?: "portrait" | "landscape";
  runningSlug?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  children: ReactNode;
}

export function PageShell({
  number,
  total,
  title,
  orientation = "portrait",
  runningSlug,
  showHeader = true,
  showFooter = true,
  children,
}: PageShellProps) {
  const dims =
    orientation === "landscape"
      ? { width: 1056, height: 816 }
      : { width: 816, height: 1056 };

  return (
    <article
      aria-label={`PDF page ${number} of ${total}: ${title}`}
      data-pdf-page={number}
      data-pdf-orientation={orientation}
      style={{ width: dims.width, height: dims.height }}
      className="relative mx-auto flex flex-col overflow-hidden border border-slate-200 bg-white shadow-[0_24px_80px_-24px_rgba(15,23,42,0.18)]"
    >
      {showHeader && number > 1 && (
        <header className="flex shrink-0 items-center justify-between border-b border-slate-100 px-12 pb-4 pt-8 text-[10px] uppercase tracking-[0.16em] text-slate-400">
          <span>Broker meeting kit{runningSlug ? ` · ${runningSlug}` : ""}</span>
          <span className="tabular-nums">
            Page {number} of {total}
          </span>
        </header>
      )}

      <div className="relative flex-1 overflow-hidden">{children}</div>

      {showFooter && number > 1 && (
        <footer className="flex shrink-0 items-baseline justify-between border-t border-slate-100 px-12 pb-8 pt-4 text-[10px] text-slate-400">
          <span>Forge · part of Arise Energy</span>
          <span className="tabular-nums">Prepared May 19, 2026 · v1.0</span>
        </footer>
      )}
    </article>
  );
}
