"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function CodeBlock({
  code = "",
  language = "bash",
  className = "",
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "relative w-full rounded-lg overflow-hidden",
        "border border-neutral-300 dark:border-neutral-800",
        "bg-neutral-50 dark:bg-neutral-900 shadow-sm",
        className
      )}
    >
      {/* COPY BUTTON FIXED */}
      <motion.button
        onClick={handleCopy}
        whileTap={{ scale: 0.9 }}
        className={cn(
          "absolute cursor-pointer top-1 right-2 z-20 p-1.5 rounded-md",
          "bg-neutral-200 dark:bg-neutral-800",
          "hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-all"
        )}
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
        )}
      </motion.button>

      {/* TOP LANGUAGE BAR */}
      <div className="px-4 py-2 text-xs font-medium uppercase tracking-wide bg-neutral-200/80 dark:bg-neutral-800/80 border-b border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400">
        {language}
      </div>

      {/* CODE CONTENT */}
      <pre className="p-4 text-sm leading-relaxed font-mono whitespace-pre overflow-x-auto">
        {code}
      </pre>
    </div>
  );
}
