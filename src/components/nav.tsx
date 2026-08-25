"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, FlaskConical, TrendingUp, Database, TestTube, BookMarked, ScanText } from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";

const LINKS = [
  { href: "/", label: "Hitung", icon: Calculator },
  { href: "/explorer", label: "Explorer", icon: FlaskConical },
  { href: "/kenali-zat", label: "Kenali Zat", icon: ScanText },
  { href: "/simulasi", label: "Simulasi", icon: TrendingUp },
  { href: "/database", label: "Zat", icon: Database },
  { href: "/lab", label: "Lab", icon: TestTube },
  { href: "/referensi", label: "Referensi", icon: BookMarked },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile: header atas (toggle) */}
      <div
        className="sticky top-0 z-40 flex items-center justify-end px-4 py-3 md:hidden"
        style={{
          background: "color-mix(in srgb, var(--bg) 80%, transparent)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <ThemeToggle />
      </div>

      {/* Desktop: pill nav di atas */}
      <nav
        className="sticky top-4 z-40 mx-auto mb-2 hidden w-fit items-center gap-1 rounded-full p-1 md:flex"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          backdropFilter: "blur(var(--glass-blur)) saturate(1.4)",
          WebkitBackdropFilter: "blur(var(--glass-blur))",
        }}
        aria-label="Navigasi utama"
      >
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-colors ${
                active ? "bg-[var(--accent)] font-medium text-white" : "text-[var(--muted)] hover:text-[var(--text)]"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={15} strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
        <span className="mx-1 h-5 w-px bg-[var(--border)]" />
        <ThemeToggle />
      </nav>

      {/* Mobile: pill nav scrollable horizontal */}
      <nav
        className="z-40 mx-auto mb-2 flex w-fit max-w-full items-center gap-1 overflow-x-auto rounded-full p-1 md:hidden"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          backdropFilter: "blur(var(--glass-blur)) saturate(1.4)",
          WebkitBackdropFilter: "blur(var(--glass-blur))",
          scrollbarWidth: "none",
        }}
        aria-label="Navigasi utama"
      >
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs transition-colors ${
                active ? "bg-[var(--accent)] font-medium text-white" : "text-[var(--muted)]"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={14} strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
