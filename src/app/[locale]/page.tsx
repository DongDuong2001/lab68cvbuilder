import { Link } from "@/i18n/routing";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("Index");

  return (
    <>
      <Header />
      <main className="bg-white text-black w-full overflow-hidden">
        {/* Grid overlay effect - global */}
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

        {/* HERO SECTION */}
        <section className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8 pt-24">
          <div className="max-w-2xl w-full">
            <span className="label-mono block mb-4">{t("label")}</span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-8">
              {t("title")}
            </h1>
            <div className="w-full border-t border-black mb-8" />
            <p className="text-sm font-light tracking-wide max-w-md mb-12 leading-relaxed">
              {t.rich("description", {
                b: (chunks) => <span className="font-bold">{chunks}</span>,
              })}
            </p>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="border border-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors duration-150"
              >
                {t("enterLab")}
              </Link>
              <a
                href="#templates"
                className="border border-gray-300 px-8 py-3 text-xs font-bold uppercase tracking-widest text-gray-500 hover:border-black hover:text-black transition-colors duration-150"
              >
                {t("viewTemplates")}
              </a>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="relative z-10 border-t border-black bg-white">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
            <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-black p-8 md:p-16 flex items-start">
              <h2 className="text-3xl font-black tracking-tight uppercase">
                {t("Features.title")}
              </h2>
            </div>
            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2">
              <div className="p-8 md:p-12 border-b sm:border-r border-black">
                <h3 className="text-sm font-bold tracking-widest uppercase mb-4">01. {t("Features.pdfTitle")}</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-light">{t("Features.pdfDesc")}</p>
              </div>
              <div className="p-8 md:p-12 border-b border-black">
                <h3 className="text-sm font-bold tracking-widest uppercase mb-4">02. {t("Features.atsTitle")}</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-light">{t("Features.atsDesc")}</p>
              </div>
              <div className="p-8 md:p-12 border-b sm:border-b-0 sm:border-r border-black">
                <h3 className="text-sm font-bold tracking-widest uppercase mb-4">03. {t("Features.templatesTitle")}</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-light">{t("Features.templatesDesc")}</p>
              </div>
              <div className="p-8 md:p-12">
                <h3 className="text-sm font-bold tracking-widest uppercase mb-4">04. {t("Features.freeTitle")}</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-light">{t("Features.freeDesc")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* TEMPLATES SHOWCASE */}
        <section id="templates" className="relative z-10 border-t border-black bg-gray-50">
          <div className="max-w-7xl mx-auto p-8 md:p-16">
            <h2 className="text-3xl font-black tracking-tight uppercase pb-8 border-b border-black mb-12 text-center md:text-left">
              {t("Templates.title")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Executive */}
              <div className="group cursor-default">
                <div className="aspect-[1/1.4] w-full border border-black bg-white mb-4 p-4 shadow-[4px_4px_0_#000] group-hover:shadow-[8px_8px_0_#000] group-hover:-translate-y-1 transition-all flex flex-col">
                  {/* Wireframe representation */}
                  <div className="w-full h-8 bg-black mb-4"></div>
                  <div className="flex gap-4">
                    <div className="w-1/3 space-y-2">
                      <div className="w-full h-2 bg-gray-200"></div>
                      <div className="w-full h-2 bg-gray-200"></div>
                      <div className="w-2/3 h-2 bg-gray-200"></div>
                    </div>
                    <div className="w-2/3 space-y-4">
                      <div className="w-full h-4 bg-gray-300"></div>
                      <div className="w-full h-12 bg-gray-100 border border-dashed border-gray-300"></div>
                      <div className="w-full h-12 bg-gray-100 border border-dashed border-gray-300"></div>
                    </div>
                  </div>
                </div>
                <h3 className="text-sm font-bold tracking-widest uppercase mb-2">{t("Templates.executiveTitle")}</h3>
                <p className="text-xs text-gray-600">{t("Templates.executiveDesc")}</p>
              </div>

              {/* Harvard */}
              <div className="group cursor-default">
                <div className="aspect-[1/1.4] w-full border border-black bg-white mb-4 p-4 shadow-[4px_4px_0_#000] group-hover:shadow-[8px_8px_0_#000] group-hover:-translate-y-1 transition-all flex flex-col items-center">
                  {/* Wireframe representation */}
                  <div className="w-2/3 h-6 bg-black mb-2"></div>
                  <div className="w-full h-[1px] bg-black mb-4"></div>
                  <div className="w-full space-y-3">
                    <div className="w-1/3 h-3 bg-gray-300 mx-auto"></div>
                    <div className="w-full h-8 bg-gray-100 border border-dashed border-gray-300"></div>
                    <div className="w-full h-8 bg-gray-100 border border-dashed border-gray-300"></div>
                  </div>
                </div>
                <h3 className="text-sm font-bold tracking-widest uppercase mb-2">{t("Templates.harvardTitle")}</h3>
                <p className="text-xs text-gray-600">{t("Templates.harvardDesc")}</p>
              </div>

              {/* Creative */}
              <div className="group cursor-default">
                <div className="aspect-[1/1.4] w-full border border-black bg-white mb-4 shadow-[4px_4px_0_#000] group-hover:shadow-[8px_8px_0_#000] group-hover:-translate-y-1 transition-all flex">
                  {/* Wireframe representation */}
                  <div className="w-1/3 h-full bg-black p-2 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-white mb-4 cursor-default"></div>
                    <div className="w-full h-1 bg-gray-700 mb-1"></div>
                    <div className="w-2/3 h-1 bg-gray-700"></div>
                  </div>
                  <div className="w-2/3 p-4 space-y-4">
                    <div className="w-2/3 h-6 bg-gray-300"></div>
                    <div className="w-full h-8 bg-gray-100 border border-dashed border-gray-300"></div>
                    <div className="w-full h-8 bg-gray-100 border border-dashed border-gray-300"></div>
                  </div>
                </div>
                <h3 className="text-sm font-bold tracking-widest uppercase mb-2">{t("Templates.creativeTitle")}</h3>
                <p className="text-xs text-gray-600">{t("Templates.creativeDesc")}</p>
              </div>

              {/* ATS */}
              <div className="group cursor-default">
                <div className="aspect-[1/1.4] w-full border border-black bg-white mb-4 p-4 shadow-[4px_4px_0_#000] group-hover:shadow-[8px_8px_0_#000] group-hover:-translate-y-1 transition-all flex flex-col">
                  {/* Wireframe representation */}
                  <div className="w-1/2 h-5 bg-black mb-4"></div>
                  <div className="w-full space-y-2">
                    <div className="w-full h-1 bg-gray-200"></div>
                    <div className="w-full h-1 bg-gray-200"></div>
                    <div className="w-2/3 h-1 bg-gray-200 mb-4"></div>
                    <div className="w-1/3 h-3 bg-gray-300"></div>
                    <div className="w-full h-1 bg-gray-200"></div>
                    <div className="w-full h-1 bg-gray-200"></div>
                  </div>
                </div>
                <h3 className="text-sm font-bold tracking-widest uppercase mb-2">{t("Templates.atsTitle")}</h3>
                <p className="text-xs text-gray-600">{t("Templates.atsDesc")}</p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/login"
                className="inline-block border border-black bg-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors duration-150"
              >
                {t("enterLab")}
              </Link>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="relative z-10 border-t border-black bg-black text-white p-8 md:p-24 text-center">
          <div className="max-w-2xl mx-auto flex flex-col items-center">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
              {t("CTA.title")}
            </h2>
            <p className="text-sm font-light text-gray-400 mb-10 tracking-widest uppercase">
              {t("CTA.subtitle")}
            </p>
            <Link
              href="/login"
              className="border border-white bg-white text-black px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-transparent hover:text-white transition-all duration-150"
            >
              {t("enterLab")}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
