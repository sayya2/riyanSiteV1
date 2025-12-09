import Link from "next/link";
import { getCareerPosts } from "@/lib/db";
import { FirmPageBySlug } from "../_components/FirmPage";

const stripHtml = (input: string) =>
  input
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

const sanitizeContent = (input: string) =>
  input
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");

const formatDate = (
  value?: string | null,
  fallback: string = "Not specified"
) => {
  if (!value) return fallback;
  const date = new Date(value);
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  return value;
};

export const dynamic = "force-dynamic";

export default async function CareerPage() {
  const roles = await getCareerPosts({ limit: 30 });

  return (
    <FirmPageBySlug slug="career" currentPath="career" titleOverride="Career" hideContent hideHero>
      {/* Header Section */}
      <div className="mb-10 ">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
          Career
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed max-w-4xl">
          We provide career development opportunities through our comprehensive
          in-house learning and development initiatives. Offering exposure to a
          wide range of projects in the built environment, we ensure our staff
          gain diverse knowledge and experience. With a flat hierarchy and a
          welcoming atmosphere, we cultivate a friendly work environment.
        </p>
      </div>

      {/* Job Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-2xl font-semibold text-gray-900">Open roles</h3>
          <p className="text-sm text-gray-600">
            {roles.length
              ? `${roles.length} position${
                  roles.length > 1 ? "s" : ""
                } available`
              : "No active listings"}
          </p>
        </div>

        {roles.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => {
              const href = role.post_name
                ? `/firm/career/${role.post_name}`
                : "#";
              const cleanedContent = sanitizeContent(role.post_content || "");
              const excerpt =
                role.post_excerpt && role.post_excerpt.trim().length > 0
                  ? stripHtml(sanitizeContent(role.post_excerpt))
                  : stripHtml(cleanedContent).slice(0, 140);
              const deadline = formatDate(
                role.closing_date,
                "Open until filled"
              );

              return (
                <div
                  key={role.ID}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="p-6 space-y-4">
                    {/* Deadline Badge */}
                    {role.closing_date && (
                      <div className="inline-block">
                        <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-4 py-2 rounded inline-block">
                          Deadline: {deadline}
                        </span>
                      </div>
                    )}

                    {/* Job Title with Arrow */}
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-semibold text-gray-900 pr-2">
                        {role.post_title}
                      </h2>
                      <svg
                        className="w-6 h-6 text-gray-400 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {excerpt}
                    </p>

                    {/* View More Button */}
                    <Link
                      href={href}
                      className="inline-block bg-gradient-to-r from-red-800 to-gray-800 text-white text-xs font-semibold px-6 py-2 rounded hover:from-red-900 hover:to-gray-900 transition-all duration-200 uppercase tracking-wider"
                    >
                      View More Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-gray-700 shadow-sm">
            <p className="font-semibold text-gray-900 text-lg mb-2">
              No current openings
            </p>
            <p>
              We&apos;re always interested in meeting talented people. Check
              back soon or{" "}
              <Link
                href="/firm/contact"
                className="text-red-800 font-semibold hover:underline"
              >
                reach out to our team
              </Link>
              .
            </p>
          </div>
        )}
      </div>
    </FirmPageBySlug>
  );
}
