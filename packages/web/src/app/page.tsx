import { getSnippets, searchSnippets } from "@/lib/queries";
import type { Snippet, SnippetCategory, SnippetFrequency } from "@thrumhub/shared";
import Link from "next/link";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; frequency?: string }>;
}) {
  const params = await searchParams;
  const q = params.q;
  const category = params.category as SnippetCategory | undefined;
  const frequency = params.frequency as SnippetFrequency | undefined;

  let snippets: Snippet[];

  if (q) {
    snippets = await searchSnippets(q);
  } else {
    snippets = await getSnippets({ category, frequency });
  }

  return (
    <div>
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-3">
          Discover <span className="text-teal-400">Thrum</span> Snippets
        </h1>
        <p className="text-slate-400 mb-8 max-w-xl mx-auto">
          Browse community HEARTBEAT snippets and keep your ClawdBot in sync
        </p>

        <form action="/" method="GET" className="max-w-2xl mx-auto flex gap-3">
          <input
            type="text"
            name="q"
            defaultValue={q || ""}
            placeholder="Search snippets..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500"
          />
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-500 text-white px-3 sm:px-6 py-2.5 rounded-lg font-medium transition-colors"
            aria-label="Search"
          >
            <svg
              className="sm:hidden w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span className="hidden sm:inline">Search</span>
          </button>
        </form>

        <div className="flex justify-center gap-3 mt-4 flex-wrap">
          {(
            [
              "utilities",
              "social",
              "finance",
              "productivity",
              "monitoring",
              "other",
            ] as SnippetCategory[]
          ).map((cat) => (
            <Link
              key={cat}
              href={category === cat ? "/" : `/?category=${cat}`}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                category === cat
                  ? "border-teal-500 bg-teal-500/20 text-teal-300"
                  : "border-slate-700 text-slate-400 hover:border-slate-500"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {q && (
        <p className="text-sm text-slate-400 mb-4">
          {snippets.length} result{snippets.length !== 1 ? "s" : ""} for{" "}
          <span className="text-teal-400">&quot;{q}&quot;</span>
        </p>
      )}

      {snippets.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <p className="text-lg">No snippets found.</p>
          <p className="text-sm mt-2">
            {q ? "Try a different search term." : "Be the first to submit one!"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {snippets.map((snippet) => (
            <Link
              key={snippet.id}
              href={`/snippets/${snippet.id}`}
              className="group block bg-slate-900 border border-slate-800 rounded-lg p-5 hover:border-teal-500/40 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-white font-semibold group-hover:text-teal-400 transition-colors">
                  {snippet.name}
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-mono mb-3">
                thrum add {snippet.id}
              </p>
              <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                {snippet.content.slice(0, 120)}
                {snippet.content.length > 120 ? "..." : ""}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-slate-800 text-cyan-400 px-2 py-0.5 rounded">
                  {snippet.frequency}
                </span>
                <span className="text-xs bg-slate-800 text-teal-400 px-2 py-0.5 rounded">
                  {snippet.category}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
