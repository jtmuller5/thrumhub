"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SnippetFrequency, SnippetCategory, SnippetWithVariables } from "@thrumhub/shared";

const frequencies: SnippetFrequency[] = ["none", "1h", "2h", "4h", "8h", "12h", "24h"];
const categories: SnippetCategory[] = ["utilities", "social", "finance", "productivity", "monitoring", "other"];

const frequencyLabels: Record<SnippetFrequency, string> = {
  none: "None",
  "1h": "Every 1 hour",
  "2h": "Every 2 hours",
  "4h": "Every 4 hours",
  "8h": "Every 8 hours",
  "12h": "Every 12 hours",
  "24h": "Every 24 hours",
};

export default function EditForm({
  snippet,
  onCancel,
}: {
  snippet: SnippetWithVariables;
  onCancel: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState(snippet.name);
  const [description, setDescription] = useState(snippet.description || "");
  const [website, setWebsite] = useState(snippet.website || "");
  const [content, setContent] = useState(snippet.content);
  const [frequency, setFrequency] = useState<SnippetFrequency>(snippet.frequency);
  const [category, setCategory] = useState<SnippetCategory>(snippet.category);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const res = await fetch(`/api/snippets/${snippet.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description: description || undefined, website: website || undefined, content, frequency, category }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Failed to update snippet");
        return;
      }

      onCancel();
      router.refresh();
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500";
  const labelClass = "block text-sm font-medium text-slate-300 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="edit-name" className={labelClass}>Name</label>
        <input
          id="edit-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="edit-description" className={labelClass}>
          Description <span className="text-slate-500 font-normal">(optional)</span>
        </label>
        <textarea
          id="edit-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A short description of what this snippet does"
          rows={3}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="edit-website" className={labelClass}>
          Website <span className="text-slate-500 font-normal">(optional)</span>
        </label>
        <input
          id="edit-website"
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://example.com"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="edit-frequency" className={labelClass}>Frequency</label>
          <select
            id="edit-frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as SnippetFrequency)}
            className={inputClass}
          >
            {frequencies.map((f) => (
              <option key={f} value={f}>{frequencyLabels[f]}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="edit-category" className={labelClass}>Category</label>
          <select
            id="edit-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as SnippetCategory)}
            className={inputClass}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="edit-content" className={labelClass}>Content</label>
        <textarea
          id="edit-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={12}
          className={`${inputClass} font-mono text-sm`}
        />
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="bg-teal-600 hover:bg-teal-500 disabled:bg-teal-600/50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
