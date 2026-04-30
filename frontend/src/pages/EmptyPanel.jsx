import React from "react";

export default function EmptyPanel({ icon = "inbox", title, detail }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-20 h-20 rounded-2xl bg-primary/8 border border-primary/15 flex items-center justify-center mb-5 mx-auto">
        <span className="material-symbols-outlined text-primary text-[40px]">{icon}</span>
      </div>
      <p className="text-base font-semibold font-headline text-on-surface">{title}</p>
      {detail && (
        <p className="text-sm text-outline mt-2 max-w-md mx-auto leading-relaxed">{detail}</p>
      )}
    </div>
  );
}
