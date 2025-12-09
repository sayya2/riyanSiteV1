import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/db";

const fallbackImg = "/images/about-hero.png";

export const firmPages = [
  { path: "about", slug: "about", label: "About" },
  { path: "career", slug: "career", label: "Career" },
  { path: "career/internships", slug: "internships", label: "Internships" },
  { path: "contact", slug: "contact", label: "Contact" },
];

const stripHtml = (input: string) =>
  input
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

export async function FirmPageBySlug({
  slug,
  currentPath,
  titleOverride,
  children,
  hideContent = false,
  hideHero = false,
}: {
  slug: string;
  currentPath: string;
  titleOverride?: string;
  children?: ReactNode;
  hideContent?: boolean;
  hideHero?: boolean;
}) {
  const page = await getPageBySlug(slug);

  if (!page) {
    return notFound();
  }

  if (process.env.NODE_ENV !== "production") {
    console.log("[FirmPage] page", {
      ID: page.ID,
      slug: page.post_name,
      title: page.post_title,
    });
  }

  const img = page.thumbnail_url || fallbackImg;
  const lead =
    page.post_excerpt && page.post_excerpt.trim().length > 0
      ? stripHtml(page.post_excerpt)
      : "";
  const title = titleOverride || page.post_title;

  const navLinks = firmPages.filter((link) => link.path !== currentPath);

  return (
    <main className="min-h-screen bg-white ml-[10%] mr-[10%]">
      {!hideHero ? (
        <div className="full-bleed relative min-h-[240px] md:h-[320px] lg:h-[420px] w-full overflow-hidden">
          <Image src={img} alt={title} fill className="object-cover" sizes="100vw" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 pb-8 md:pb-10 space-y-2 md:space-y-3">
              <p className="text-xs uppercase tracking-[0.35em] text-white/70">Firm</p>
              <h1 className="text-4xl md:text-5xl font-semibold text-white">{title}</h1>
            </div>
          </div>
        </div>
      ) : null}

      <section className="container mx-auto px-4 py-12 space-y-10">
        <article className="space-y-6 max-w-5xl">
          {lead ? <p className="text-lg text-gray-700 leading-relaxed">{lead}</p> : null}
          {!hideContent ? (
            <div
              className="prose prose-lg max-w-none text-gray-800"
              dangerouslySetInnerHTML={{ __html: page.post_content || "" }}
            />
          ) : null}
        </article>

        {children ? <div className="pt-10 max-w-6xl w-full">{children}</div> : null}

        <div className="flex flex-wrap gap-3 pt-4 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={`/firm/${link.path}`}
              className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-gray-800 font-semibold hover:bg-gray-100 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
