import { getSnippetById } from "@/lib/queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import CopyButton from "./copy-button";

export default async function SnippetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const snippet = await getSnippetById(id);

  if (!snippet) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">{snippet.name}</h1>
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <span className="bg-slate-800 text-cyan-400 px-2 py-0.5 rounded">
            {snippet.frequency}
          </span>
          <span className="bg-slate-800 text-teal-400 px-2 py-0.5 rounded">
            {snippet.category}
          </span>
          {snippet.author && (
            <div className="flex items-center gap-2 ml-auto">
              <Image
                src={snippet.author.avatar_url}
                alt={snippet.author.username}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span>{snippet.author.username}</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg mb-6">
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800">
          <span className="text-xs text-slate-500 font-mono">
            thrum add {snippet.id}
          </span>
          <CopyButton text={`thrum add ${snippet.id}`} label="Copy install command" />
        </div>
        <pre className="p-4 overflow-x-auto text-sm text-slate-300 leading-relaxed">
          <code>{snippet.content}</code>
        </pre>
      </div>

      {snippet.variables.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 mb-6">
          <h2 className="text-white font-semibold mb-3">Variables</h2>
          <div className="space-y-3">
            {snippet.variables.map((v) => (
              <div key={v.id} className="flex flex-col gap-1">
                <code className="text-teal-400 text-sm">
                  {"{{"}{v.placeholder}{"}}"}
                </code>
                <p className="text-sm text-slate-400">{v.prompt_text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-xs text-slate-500">
        Created{" "}
        {new Date(snippet.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
        {snippet.updated_at && snippet.updated_at !== snippet.created_at && (
          <>
            {" "}
            &middot; Updated{" "}
            {new Date(snippet.updated_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </>
        )}
      </div>
    </div>
  );
}
