import { Link } from "@/i18n/routing";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("Index");

  return (
    <>
      <Header />
      <main className="min-h-screen flex flex-col items-center justify-center bg-white text-black p-8 pt-24">
        {/* Grid overlay effect */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-2xl w-full">
          {/* Technical label */}
          <span className="label-mono block mb-4">
            {t("label")}
          </span>

          {/* Hero heading */}
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-8">
            {t("title")}
          </h1>

          {/* Divider */}
          <div className="w-full border-t border-black mb-8" />

          {/* Description */}
          <p className="text-sm font-light tracking-wide max-w-md mb-12 leading-relaxed">
            {t.rich("description", {
              b: (chunks) => <span className="font-bold">{chunks}</span>,
            })}
          </p>

          {/* CTA */}
          <div className="flex gap-4">
            <Link
              href="/login"
              className="border border-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors duration-150"
            >
              {t("enterLab")}
            </Link>
            <Link
              href="/login"
              className="border border-gray-300 px-8 py-3 text-xs font-bold uppercase tracking-widest text-gray-500 hover:border-black hover:text-black transition-colors duration-150"
            >
              {t("viewTemplates")}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
