import React from "react";

export default function PageShell({ title, description, children }) {
  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8 space-y-8">
      <header className="space-y-1">
        {title && (
          <div className="flex items-center gap-3">
            <div className="w-1 h-7 rounded-full bg-gradient-to-b from-primary to-primary-dim" />
            <h1 className="text-2xl sm:text-3xl font-extrabold font-headline text-on-surface tracking-tight">
              {title}
            </h1>
          </div>
        )}
        {description && (
          <p className="text-on-surface-variant text-sm mt-1 max-w-2xl leading-relaxed pl-4">
            {description}
          </p>
        )}
      </header>
      {children}
    </div>
  );
}
