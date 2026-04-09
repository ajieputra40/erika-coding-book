import React from "react";

const base =
  "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50";

const variants = {
  default: "bg-[#4285F4] text-white hover:bg-[#3b78da]",
  outline: "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50",
};

export function Button({ className = "", variant = "default", type = "button", ...props }) {
  const variantClasses = variants[variant] || variants.default;
  return <button type={type} className={`${base} ${variantClasses} ${className}`.trim()} {...props} />;
}
