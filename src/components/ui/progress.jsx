import React from "react";

export function Progress({ value = 0, className = "" }) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className={`w-full overflow-hidden rounded-full bg-slate-200 ${className}`.trim()}>
      <div
        className="h-full bg-blue-500 transition-all"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}
