"use client";

import { useState } from "react";
import { NavAuth } from "./nav-auth";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="text-slate-300 hover:text-teal-400 transition-colors"
        aria-label="Toggle menu"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {open ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="4" y1="8" x2="20" y2="8" />
              <line x1="4" y1="16" x2="20" y2="16" />
            </>
          )}
        </svg>
      </button>
      {open && (
        <div className="absolute top-14 left-0 right-0 border-b border-slate-800 bg-slate-900 px-4 py-4 flex flex-col gap-4 text-sm">
          <a href="/" onClick={() => setOpen(false)} className="hover:text-teal-400 transition-colors">
            Browse
          </a>
          <a href="/install" onClick={() => setOpen(false)} className="hover:text-teal-400 transition-colors">
            Install
          </a>
          <a href="/submit" onClick={() => setOpen(false)} className="hover:text-teal-400 transition-colors">
            Submit
          </a>
          <a href="/dashboard" onClick={() => setOpen(false)} className="hover:text-teal-400 transition-colors">
            Dashboard
          </a>
          <NavAuth />
        </div>
      )}
    </div>
  );
}
