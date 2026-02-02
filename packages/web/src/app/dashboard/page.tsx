import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSnippetsByAuthor } from "@/lib/queries";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const dbId = (session as unknown as Record<string, unknown>)?.dbId as number | undefined;
  if (!session || !dbId) {
    redirect("/login");
  }
  const snippets = await getSnippetsByAuthor(dbId);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Your Snippets</h1>
        <Link
          href="/submit"
          className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          New Snippet
        </Link>
      </div>

      {snippets.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-lg">
          <p className="text-lg text-slate-400 mb-2">
            You haven&apos;t submitted any snippets yet.
          </p>
          <p className="text-sm text-slate-500 mb-6">
            Share your automation snippets with the community.
          </p>
          <Link
            href="/submit"
            className="inline-block bg-teal-600 hover:bg-teal-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
          >
            Submit Your First Snippet
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {snippets.map((snippet) => (
            <Link
              key={snippet.id}
              href={`/snippets/${snippet.id}`}
              className="block bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-teal-500/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-white font-semibold">{snippet.name}</h2>
                  <p className="text-xs text-slate-500 font-mono mt-1">
                    {snippet.id}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-slate-800 text-cyan-400 px-2 py-0.5 rounded">
                    {snippet.frequency}
                  </span>
                  <span className="text-xs bg-slate-800 text-teal-400 px-2 py-0.5 rounded">
                    {snippet.category}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
