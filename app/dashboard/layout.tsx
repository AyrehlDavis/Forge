"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navItems = [
  { href: "/dashboard", label: "Portfolio Overview", icon: GridIcon },
  { href: "/dashboard/timeline", label: "Contract Timeline", icon: TimelineIcon },
  { href: "/dashboard/budget", label: "Budget vs Actual", icon: ChartIcon },
  { href: "/dashboard/scenarios", label: "Scenario Planner", icon: SlidersIcon },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="h-screen text-gray-900 relative overflow-hidden bg-[#e8ecf1] p-3" style={{ colorScheme: "light" }}>
      {/* Gradient mesh behind the glass */}
      <div className="absolute inset-0">
        <div className="absolute top-[-10%] right-[5%] w-[700px] h-[700px] rounded-full bg-arise-200/70 blur-[120px]" />
        <div className="absolute bottom-[0%] left-[5%] w-[600px] h-[600px] rounded-full bg-arise-300/40 blur-[100px]" />
        <div className="absolute top-[40%] left-[45%] w-[500px] h-[500px] rounded-full bg-blue-200/40 blur-[100px]" />
      </div>

      {/* Outer shell — rounded window like the reference */}
      <div className="relative z-10 flex h-full rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(60px) saturate(1.6)", WebkitBackdropFilter: "blur(60px) saturate(1.6)", border: "1px solid rgba(255,255,255,0.7)", boxShadow: "0 8px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)" }}>

      {/* Sidebar */}
      <aside className="w-64 relative flex flex-col shrink-0 border-r border-gray-200/50 bg-white/40">
        {/* Logo */}
        <div className="p-6 border-b border-arise-200/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-arise-700 flex items-center justify-center font-bold text-white text-sm">
              A
            </div>
            <div>
              <div className="font-semibold text-gray-900 tracking-tight">Arise Energy</div>
              <div className="text-xs text-gray-400">Portfolio Manager</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-arise-700/10 text-arise-800 font-medium"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                <item.icon active={isActive} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-arise-200/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-arise-100 flex items-center justify-center text-xs font-medium text-arise-700">
              BD
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700">Brian D.</div>
              <div className="text-xs text-gray-400">CBRE Portfolio</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>

      </div>{/* end outer shell */}
    </div>
  );
}

function GridIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className={active ? "text-arise-700" : "text-gray-400"}>
      <rect x="1" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="10" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="1" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="10" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function TimelineIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className={active ? "text-arise-700" : "text-gray-400"}>
      <rect x="1" y="3" width="10" height="3" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="4" y="8" width="13" height="3" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="2" y="13" width="8" height="3" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ChartIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className={active ? "text-arise-700" : "text-gray-400"}>
      <rect x="2" y="10" width="3" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="7.5" y="5" width="3" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="1" width="3" height="16" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function SlidersIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className={active ? "text-arise-700" : "text-gray-400"}>
      <line x1="2" y1="5" x2="16" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="2" y1="13" x2="16" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="6" cy="5" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="13" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
