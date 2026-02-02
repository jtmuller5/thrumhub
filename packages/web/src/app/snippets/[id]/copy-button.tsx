"use client";

import { useState } from "react";

export default function CopyButton({
  text,
  label,
}: {
  text: string;
  label: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="text-xs text-slate-400 hover:text-teal-400 transition-colors"
      title={label}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
