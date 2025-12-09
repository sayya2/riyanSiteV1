import Image from "next/image";
import Link from "next/link";
import { getAdjacentNews, getNewsBySlug } from "@/lib/db";

const fallbackImg =
  "http://localhost/riyansite/wp-content/uploads/about_gallery/1_Collaboration-Space.jpg";

const stripHtml = (input: string) =>
  input
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

type PageProps = {
  params: { slug: string } | Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export default async function NewsDetailPage({ params }: PageProps) {
  const resolvedParams =
    params && typeof (params as Promise<any>).then === "function"
      ? await (params as Promise<{ slug: string }>)
      : (params as { slug: string });

  const slug = resolvedParams?.slug;

  if (!slug) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Article not found.</p>
      </main>
    );
  }

  const article = await getNewsBySlug(slug);
  const adjacent = await getAdjacentNews(slug);

  if (!article) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Article not found.</p>
      </main>
    );
  }

  if (process.env.NODE_ENV !== "production") {
    console.log("[NewsDetail] article", {
      ID: article.ID,
      slug: article.post_name,
      title: article.post_title,
      categories: article.categories,
      tags: article.tags,
      galleryCount: article.gallery?.length || 0,
    });
    console.log("[NewsDetail] adjacent", adjacent);
  }

  const categories = article.categories || [];
  const tags = article.tags || [];
  const img = article.thumbnail_url || fallbackImg;
  const categoriesText = categories.join(", ");
  const lead = article.post_excerpt ? stripHtml(article.post_excerpt) : "";
  const publishedDate = article.post_date ? new Date(article.post_date) : null;
  const published =
    publishedDate && !isNaN(publishedDate.getTime())
      ? publishedDate.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Not specified";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const shareUrl = `${siteUrl}/news/${slug}`;
  const shareText = article.post_title;
  const shareLinks = [
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareUrl
      )}&text=${encodeURIComponent(shareText)}`,
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M18.9 3H22l-7.2 8.2L22.6 21H16l-4.7-6-5.3 6H2l7.7-8.7L1.7 3H8l4.2 5.5L18.9 3Z" />
        </svg>
      ),
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M13 10h2.8l.2-3H13V5.4c0-.9.3-1.4 1.5-1.4H16V1h-2.6C10.4 1 9 2.6 9 5.1V7H6v3h3v9h4v-9Z" />
        </svg>
      ),
    },
    {
      label: "Pinterest",
      href: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
        shareUrl
      )}&description=${encodeURIComponent(shareText)}`,
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M12.2 3C7.4 3 5 6.2 5 9.4c0 1.6.9 3.6 2.5 4.2.2.1.3 0 .3-.2l.5-1.9c0-.1 0-.2-.1-.3-.6-.8-.3-2.4.9-2.4 1.5 0 1.4 2.1.3 2.8-.2.1-.3.3-.2.5.2.8.5 2.2.6 2.5.1.5.4.6.6.4.3-.4.9-1.2 1.1-1.8.1-.3.5-1.7.5-1.7.3.6 1.2 1 2.1 1 2.8 0 4.7-2.4 4.7-5.3C18.8 6 16 3 12.2 3Z" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
        shareUrl
      )}&title=${encodeURIComponent(shareText)}`,
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M5.2 8.5V20H2V8.5h3.2ZM3.6 4c-1 0-1.9.9-1.9 1.9 0 1 .9 1.8 1.9 1.8 1 0 1.8-.8 1.8-1.8C5.5 4.9 4.6 4 3.6 4ZM21 20v-6.3c0-3.1-1.7-4.5-4-4.5-1.8 0-2.6 1-3 1.7V8.5H11c0 .7 0 11.5 0 11.5h3V13c0-.4 0-.8.2-1 .4-.8 1.2-1.6 2.3-1.6 1.5 0 2.1 1.2 2.1 2.8V20H21Z" />
        </svg>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-white ml-[10%] mr-[10%]">
      <div className="relative min-h-lvh md:h-[420px] w-full overflow-hidden">
        <Image src={img} alt={article.post_title} fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-10 space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-white/70">
              {categoriesText || "News"}
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold text-white">{article.post_title}</h1>
            <p className="text-sm text-white/80">{published}</p>
          </div>
        </div>
      </div>

      <section className="container mx-auto px-4 py-12 space-y-10">
        <div className="grid lg:grid-cols-[2fr,1fr] gap-10">
          <article className="space-y-6">
            {lead ? <p className="text-lg text-gray-700 leading-relaxed">{lead}</p> : null}
            <div
              className="prose prose-lg max-w-none text-gray-800"
              dangerouslySetInnerHTML={{ __html: article.post_content || "" }}
            />
            {tags.length ? (
              <div className="flex flex-wrap gap-2 pt-4">
                {tags.map((tag) => (
                  <span
                    key={`tag-${tag}`}
                    className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}

            {article.gallery && article.gallery.length ? (
              <div className="pt-6">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {article.gallery.map((src, idx) => (
                    <div
                      key={`gallery-${idx}`}
                      className="relative aspect-square overflow-hidden rounded-lg bg-gray-100"
                    >
                      <Image
                        src={src}
                        alt={`${article.post_title} image ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="(min-width:1024px) 33vw, 50vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </article>

          <div className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5 space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Details</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Published</p>
                  <p className="text-base font-semibold text-gray-900">{published}</p>
                </div>
                {categories.length ? (
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Categories</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {categories.map((cat) => (
                        <span
                          key={`cat-${cat}`}
                          className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-200"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="text-sm font-semibold text-gray-800">Share</span>
              {shareLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-800 hover:bg-gray-100 transition-colors"
                  aria-label={`Share on ${link.label}`}
                >
                  {link.icon}
                </a>
              ))}
            </div>

            <div className="flex justify-between items-center gap-3">
              {adjacent.previous ? (
                <Link
                  href={`/news/${adjacent.previous.post_name}`}
                  className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100 transition-colors"
                >
                  &larr; {adjacent.previous.post_title}
                </Link>
              ) : (
                <span />
              )}

              {adjacent.next ? (
                <Link
                  href={`/news/${adjacent.next.post_name}`}
                  className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100 transition-colors"
                >
                  {adjacent.next.post_title} &rarr;
                </Link>
              ) : (
                <span />
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
