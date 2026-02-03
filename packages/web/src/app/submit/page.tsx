"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SnippetFrequency, SnippetCategory } from "@thrumhub/shared";

const frequencies: SnippetFrequency[] = [
  "none",
  "1h",
  "2h",
  "4h",
  "8h",
  "12h",
  "24h",
];

const frequencyLabels: Record<SnippetFrequency, string> = {
  none: "None",
  "1h": "Every 1 hour",
  "2h": "Every 2 hours",
  "4h": "Every 4 hours",
  "8h": "Every 8 hours",
  "12h": "Every 12 hours",
  "24h": "Every 24 hours",
};

function getFrequencyPrefix(frequency: SnippetFrequency, name: string): string | null {
  if (frequency === "none") return null;
  const hours = parseInt(frequency);
  const label = hours === 1 ? "1+ hour" : `${hours}+ hours`;
  return `If ${label} since last ${name || "unnamed"} check AND not currently busy with human:`;
}

const categories: SnippetCategory[] = [
  "utilities",
  "social",
  "finance",
  "productivity",
  "monitoring",
  "other",
];

interface Variable {
  placeholder: string;
  prompt_text: string;
}

export default function SubmitPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [content, setContent] = useState("");
  const [frequency, setFrequency] = useState<SnippetFrequency>("24h");
  const [category, setCategory] = useState<SnippetCategory>("utilities");
  const [variables, setVariables] = useState<Variable[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (status === "loading") {
    return (
      <div className="text-center py-16 text-slate-400">Loading...</div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-white mb-4">
          Sign in to submit snippets
        </h1>
        <a
          href="/login"
          className="inline-block bg-teal-600 hover:bg-teal-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
        >
          Sign In
        </a>
      </div>
    );
  }

  const addVariable = () => {
    setVariables([...variables, { placeholder: "", prompt_text: "" }]);
  };

  const removeVariable = (index: number) => {
    setVariables(variables.filter((_, i) => i !== index));
  };

  const updateVariable = (
    index: number,
    field: keyof Variable,
    value: string
  ) => {
    const updated = [...variables];
    updated[index] = { ...updated[index], [field]: value };
    setVariables(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/snippets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          name,
          description: description || undefined,
          website: website || undefined,
          content: frequency !== "none"
            ? `${getFrequencyPrefix(frequency, name)}\n${content}`
            : content,
          frequency,
          category,
          variables: variables.filter(
            (v) => v.placeholder.trim() && v.prompt_text.trim()
          ),
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Failed to create snippet");
        return;
      }

      router.push(`/snippets/${result.data.id}`);
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500";
  const labelClass = "block text-sm font-medium text-slate-300 mb-1.5";

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Submit a Snippet</h1>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className={labelClass}>
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My awesome snippet"
            required
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="slug" className={labelClass}>
            Slug (ID)
          </label>
          <input
            id="slug"
            type="text"
            value={id}
            onChange={(e) =>
              setId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))
            }
            placeholder="my-awesome-snippet"
            required
            pattern="[a-z0-9-]+"
            className={inputClass}
          />
          <p className="text-xs text-slate-500 mt-1">
            Used in <code className="text-teal-400">thrum add {id || "slug"}</code>
          </p>
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>
            Description <span className="text-slate-500 font-normal">(optional)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A short description of what this snippet does"
            rows={3}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="website" className={labelClass}>
            Website <span className="text-slate-500 font-normal">(optional)</span>
          </label>
          <input
            id="website"
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://example.com"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="frequency" className={labelClass}>
              Frequency
            </label>
            <select
              id="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as SnippetFrequency)}
              className={inputClass}
            >
              {frequencies.map((f) => (
                <option key={f} value={f}>
                  {frequencyLabels[f]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="category" className={labelClass}>
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as SnippetCategory)}
              className={inputClass}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="content" className={labelClass}>
            Content
          </label>
          {frequency !== "none" && (
            <div className="bg-slate-900 border border-slate-700 rounded-t-lg px-4 py-2.5 font-mono text-sm text-slate-400 border-b-0">
              {getFrequencyPrefix(frequency, name)}
            </div>
          )}
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Snippet content..."
            required
            rows={12}
            className={`${inputClass} font-mono text-sm ${frequency !== "none" ? "rounded-t-none" : ""}`}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className={labelClass}>Variables</label>
            <button
              type="button"
              onClick={addVariable}
              className="text-xs text-teal-400 hover:text-teal-300 transition-colors"
            >
              + Add variable
            </button>
          </div>
          {variables.length === 0 && (
            <p className="text-sm text-slate-500">
              No variables defined. Add variables for user-configurable placeholders.
            </p>
          )}
          <div className="space-y-3">
            {variables.map((v, i) => (
              <div
                key={i}
                className="bg-slate-900 border border-slate-800 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-500">
                    Variable {i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeVariable(i)}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={v.placeholder}
                    onChange={(e) =>
                      updateVariable(i, "placeholder", e.target.value)
                    }
                    placeholder="PLACEHOLDER_NAME"
                    className={inputClass}
                  />
                  <input
                    type="text"
                    value={v.prompt_text}
                    onChange={(e) =>
                      updateVariable(i, "prompt_text", e.target.value)
                    }
                    placeholder="Prompt shown to user"
                    className={inputClass}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-teal-600 hover:bg-teal-500 disabled:bg-teal-600/50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
        >
          {submitting ? "Submitting..." : "Submit Snippet"}
        </button>
      </form>
    </div>
  );
}
