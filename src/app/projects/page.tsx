import Link from "next/link";
import Image from "next/image";
import {
  getProjectCategories,
  getProjectServices,
  getProjects,
} from "@/lib/db";
import FiltersBar from "@/components/FiltersBar";

const fallbackImg =
  "http://beta.riyan.com.mv/wp-content/uploads/about_gallery/1_Collaboration-Space.jpg";

const contentShell = "w-full mx-auto px-[10%]";

function stripHtml(input: string) {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams?:
    | Promise<Record<string, string | string[] | undefined>>
    | Record<string, string | string[] | undefined>;
}) {
  const resolvedParams =
    searchParams && typeof (searchParams as Promise<any>).then === "function"
      ? await (searchParams as Promise<
          Record<string, string | string[] | undefined>
        >)
      : ((searchParams || {}) as Record<string, string | string[] | undefined>);

  const category =
    typeof resolvedParams?.category === "string" ? resolvedParams.category : "";
  const service =
    typeof resolvedParams?.service === "string" ? resolvedParams.service : "";
  const search = typeof resolvedParams?.q === "string" ? resolvedParams.q : "";
  const perPage =
    typeof resolvedParams?.perPage === "string"
      ? Number(resolvedParams.perPage)
      : 24;
  const limit = [20, 40, 60, 100].includes(perPage) ? perPage : 24;

  const [categories, services, projects] = await Promise.all([
    getProjectCategories(),
    getProjectServices(),
    getProjects({
      categorySlug: category || undefined,
      serviceSlug: service || undefined,
      search: search || undefined,
      limit,
    }),
  ]);

  if (process.env.NODE_ENV !== "production") {
    console.log("[ProjectsPage] filters", { category, service, search, limit });
    console.log(
      "[ProjectsPage] projects sample",
      projects.slice(0, 3).map((p) => ({
        ID: p.ID,
        slug: p.post_name,
        title: p.post_title,
        categories: p.categories,
        services: p.services,
      })),
      "total",
      projects.length
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className={`${contentShell} py-16 space-y-10 mt-30`}>
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900">
              Projects
            </h1>
            <p className="text-gray-700 mt-2 max-w-2xl">
              Explore completed and ongoing work across buildings, resorts, infrastructure, and planning.
            </p>
          </div>
          <FiltersBar
            categories={categories}
            services={services}
            selectedCategory={category}
            selectedService={service}
            search={search}
            perPage={limit}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project) => {
            const href = project.post_name
              ? `/projects/${project.post_name}`
              : "#";
            const categoriesText = (project.categories || []).join(", ");
            const servicesText = (project.services || []).join(", ");
            const excerpt =
              project.post_excerpt && project.post_excerpt.trim().length > 0
                ? stripHtml(project.post_excerpt)
                : stripHtml(project.post_content || "").slice(0, 140);
            const img = project.thumbnail_url || fallbackImg;

            return (
              <Link
                key={project.ID}
                href={href}
                className="group relative block overflow-hidden rounded-xl h-72 md:h-80 bg-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <Image
                  src={img}
                  alt={project.post_title}
                  fill
                  sizes="(min-width:1024px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-5 space-y-2">
                  <p className="text-xs uppercase tracking-widest text-white/80 font-semibold">
                    {categoriesText || servicesText || "Project"}
                  </p>
                  <h3 className="text-xl font-semibold text-white drop-shadow-sm">
                    {project.post_title}
                  </h3>
                  <p className="text-sm text-white/80 leading-relaxed line-clamp-2">
                    {excerpt}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
