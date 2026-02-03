"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import type { SnippetWithVariables } from "@thrumhub/shared";
import EditForm from "./edit-form";

export function EditToggle({
  snippet,
}: {
  snippet: SnippetWithVariables;
}) {
  const { data: session } = useSession();
  const [editing, setEditing] = useState(false);

  const dbId = (session as unknown as Record<string, unknown>)?.dbId;
  if (!dbId || dbId !== snippet.author_id) return null;

  return (
    <>
      <button
        onClick={() => setEditing(!editing)}
        className="text-sm text-slate-400 hover:text-teal-400 transition-colors"
      >
        {editing ? "Cancel" : "Edit"}
      </button>
      {editing && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 mt-4 mb-6">
          <h2 className="text-white font-semibold mb-4">Edit Snippet</h2>
          <EditForm snippet={snippet} onCancel={() => setEditing(false)} />
        </div>
      )}
    </>
  );
}

export default EditToggle;
