"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import { ProductsDropdown } from "./products-dropdown";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslations } from "next-intl";

export function Header() {
  const t = useTranslations("Common");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white">
      {/* Announcement Strip */}
      <div className="h-8 bg-black text-white flex items-center justify-center gap-3 px-6">
        <span className="text-[0.6rem] font-bold tracking-[0.18em] uppercase">✦ {t("announcementText")}</span>
        <Link
          href="/try"
          className="text-[0.6rem] font-bold tracking-[0.18em] uppercase border-b border-white/40 hover:border-white transition-colors duration-150 pb-px"
        >
          {t("announcementCta")}
        </Link>
      </div>
      {/* Main Nav */}
      <div className="border-b border-black">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-14">
        {/* Left: Logo + Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/lab68dev_logo.png"
              alt="lab68dev"
              width={28}
              height={28}
              className="invert"
            />
            <span className="text-sm font-black uppercase tracking-wider">
              lab68dev
            </span>
          </Link>

          {/* Products Dropdown */}
          <ProductsDropdown />
        </div>

        {/* Right: Current product label */}
        <div className="flex items-center gap-4">
          <span className="label-mono hidden sm:block">{t("cvBuilder")}</span>
          <LanguageSwitcher />
          <Link
            href="/login"
            className="border border-black px-4 py-1.5 text-[0.6875rem] font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors duration-150"
          >
            {t("login")}
          </Link>
        </div>
      </div>
      </div>
    </header>
  );
}
