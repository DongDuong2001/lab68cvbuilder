import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useTranslations } from "next-intl";

// Cache this fully-static page for 24 hours (ISR)
export const revalidate = 86400;

export default function HomePage() {
  const t = useTranslations("Index");

  return (
    <>
      <Header />
      <main className="bg-white text-black w-full overflow-hidden">
        {/* Grid overlay effect - global */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
          <div className="grid-overlay w-full h-full" />
        </div>

        {/* HERO SECTION */}
        <section className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8 pt-22">
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
            <div className="flex flex-wrap gap-4">
              <Link
                href="/login"
                className="border border-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors duration-150"
              >
                {t("enterLab")}
              </Link>
              <Link
                href="/try"
                className="border border-black px-8 py-3 text-xs font-bold uppercase tracking-widest bg-black text-white hover:bg-white hover:text-black transition-colors duration-150"
              >
                {t("tryFree")}
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

        {/* FEATURED IN */}
        <section className="relative z-10 border-t border-black bg-gray-50">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
            <div className="shrink-0 border-b md:border-b-0 md:border-r border-black px-8 md:px-12 py-5 md:py-6">
              <span className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-gray-400">Featured In</span>
            </div>
            <div className="flex items-center gap-6 overflow-x-auto px-8 py-5 md:py-6 scrollbar-none flex-nowrap w-full">
              <a href="https://buildinprocess.com" target="_blank" rel="noopener noreferrer" title="Featured on BuildInProcess" className="shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-200">
                <Image src="https://buildinprocess.com/badges/badge-1-dark.svg" alt="Featured on BuildInProcess" width={160} height={36} style={{ width: 160, height: 36, objectFit: "contain" }} />
              </a>
              <a href="https://unikorn.vn/p/lab68dev-cv-builder?ref=embed" target="_blank" rel="noopener noreferrer" title="lab68CV Builder trên Unikorn.vn" className="shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-200">
                <Image src="https://unikorn.vn/api/widgets/badge/lab68dev-cv-builder?theme=light" alt="lab68CV Builder trên Unikorn.vn" width={160} height={36} style={{ width: 160, height: 36, objectFit: "contain" }} unoptimized />
              </a>
              <a href="https://www.producthunt.com/products/lab68dev-cv-builder/reviews/new?utm_source=badge-product_review&utm_medium=badge&utm_source=badge-lab68dev-cv-builder" target="_blank" rel="noopener noreferrer" title="Review on Product Hunt" className="shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-200">
                <Image src="https://api.producthunt.com/widgets/embed-image/v1/product_review.svg?product_id=1177121&theme=dark" alt="Product Hunt Review" width={160} height={36} style={{ width: 160, height: 36, objectFit: "contain" }} unoptimized />
              </a>
              <a href="https://www.producthunt.com/products/lab68dev-cv-builder?utm_source=badge-follow&utm_medium=badge&utm_source=badge-lab68dev-cv-builder" target="_blank" rel="noopener noreferrer" title="Follow on Product Hunt" className="shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-200">
                <Image src="https://api.producthunt.com/widgets/embed-image/v1/follow.svg?product_id=1177121&theme=dark" alt="Follow on Product Hunt" width={160} height={36} style={{ width: 160, height: 36, objectFit: "contain" }} unoptimized />
              </a>
              <a href="https://www.producthunt.com/products/lab68dev-cv-builder?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-lab68dev-cv-builder" target="_blank" rel="noopener noreferrer" title="Featured on Product Hunt" className="shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-200">
                <Image src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1093292&theme=dark&t=1773130393873" alt="Featured on Product Hunt" width={160} height={36} style={{ width: 160, height: 36, objectFit: "contain" }} unoptimized />
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

        {/* AI WRITING ASSISTANT */}
        <section className="relative z-10 border-t border-black bg-black text-white">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
            {/* Left label panel */}
            <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-white/20 p-8 md:p-16 flex flex-col justify-between gap-8">
              <div>
                <span className="label-mono block text-white/40 mb-4 text-xs tracking-widest">{t("AI.label")}</span>
                <h2 className="text-3xl font-black tracking-tight uppercase leading-tight">
                  {t("AI.title")}
                </h2>
                <p className="text-sm text-white/60 font-light leading-relaxed mt-4">
                  {t("AI.subtitle")}
                </p>
              </div>
              <Link
                href="/try"
                className="self-start border border-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-150"
              >
                {t("AI.cta")}
              </Link>
            </div>
            {/* Right features */}
            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-3">
              <div className="p-8 md:p-12 border-b sm:border-b-0 sm:border-r border-white/20">
                <div className="w-8 h-8 border border-white/40 flex items-center justify-center mb-6">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                </div>
                <h3 className="text-sm font-bold tracking-widest uppercase mb-4">01. {t("AI.feature1Title")}</h3>
                <p className="text-sm text-white/50 leading-relaxed font-light">{t("AI.feature1Desc")}</p>
              </div>
              <div className="p-8 md:p-12 border-b sm:border-b-0 sm:border-r border-white/20">
                <div className="w-8 h-8 border border-white/40 flex items-center justify-center mb-6">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg>
                </div>
                <h3 className="text-sm font-bold tracking-widest uppercase mb-4">02. {t("AI.feature2Title")}</h3>
                <p className="text-sm text-white/50 leading-relaxed font-light">{t("AI.feature2Desc")}</p>
              </div>
              <div className="p-8 md:p-12">
                <div className="w-8 h-8 border border-white/40 flex items-center justify-center mb-6">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                </div>
                <h3 className="text-sm font-bold tracking-widest uppercase mb-4">03. {t("AI.feature3Title")}</h3>
                <p className="text-sm text-white/50 leading-relaxed font-light">{t("AI.feature3Desc")}</p>
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
                  <div className="w-full h-px bg-black mb-4"></div>
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

        {/* TESTIMONIALS */}
        <section className="relative z-10 border-t border-black bg-white">
          <div className="max-w-7xl mx-auto p-8 md:p-16">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between pb-8 border-b border-black mb-12 gap-4">
              <h2 className="text-3xl font-black tracking-tight uppercase">{t("Testimonials.title")}</h2>
              <p className="text-xs text-gray-500 font-light tracking-widest uppercase">{t("Testimonials.subtitle")}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-0 border-l border-t border-black">
              {/* Testimonial 1 */}
              <div className="border-r border-b border-black p-8 flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 fill-black" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-1">{t("Testimonials.review1Title")}</p>
                  <p className="text-sm text-gray-600 font-light leading-relaxed">{t("Testimonials.review1Body")}</p>
                </div>
                <p className="text-xs font-bold tracking-widest uppercase mt-auto pt-4 border-t border-gray-200">{t("Testimonials.review1Author")}</p>
              </div>
              {/* Testimonial 2 */}
              <div className="border-r border-b border-black p-8 flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 fill-black" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-1">{t("Testimonials.review2Title")}</p>
                  <p className="text-sm text-gray-600 font-light leading-relaxed">{t("Testimonials.review2Body")}</p>
                </div>
                <p className="text-xs font-bold tracking-widest uppercase mt-auto pt-4 border-t border-gray-200">{t("Testimonials.review2Author")}</p>
              </div>
              {/* Testimonial 3 */}
              <div className="border-r border-b border-black p-8 flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 fill-black" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-1">{t("Testimonials.review3Title")}</p>
                  <p className="text-sm text-gray-600 font-light leading-relaxed">{t("Testimonials.review3Body")}</p>
                </div>
                <p className="text-xs font-bold tracking-widest uppercase mt-auto pt-4 border-t border-gray-200">{t("Testimonials.review3Author")}</p>
              </div>
              {/* Testimonial 4 */}
              <div className="border-r border-b border-black p-8 flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 fill-black" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-1">{t("Testimonials.review4Title")}</p>
                  <p className="text-sm text-gray-600 font-light leading-relaxed">{t("Testimonials.review4Body")}</p>
                </div>
                <p className="text-xs font-bold tracking-widest uppercase mt-auto pt-4 border-t border-gray-200">{t("Testimonials.review4Author")}</p>
              </div>
              {/* Testimonial 5 */}
              <div className="border-r border-b border-black p-8 flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 fill-black" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-1">{t("Testimonials.review5Title")}</p>
                  <p className="text-sm text-gray-600 font-light leading-relaxed">{t("Testimonials.review5Body")}</p>
                </div>
                <p className="text-xs font-bold tracking-widest uppercase mt-auto pt-4 border-t border-gray-200">{t("Testimonials.review5Author")}</p>
              </div>
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
