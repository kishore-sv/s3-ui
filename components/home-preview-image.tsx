"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function HomePreviewImage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const src =
    mounted && resolvedTheme === "dark" ? "/home_dark.png" : "/home.png";

  return (
    <div className="relative mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none overflow-hidden">
      <div
        className="pointer-events-none absolute -inset-6 overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600/15 via-sky-500/10 to-violet-500/10 blur-2xl"
        aria-hidden="true"
      />

      <div className="relative overflow-hidden rounded-b-3xl">
        <div className="relative aspect-[2880/1480] w-full">
          <Image
            src={src}
            alt="S3-UI file explorer"
            fill
            sizes="(max-width: 1024px) 90vw, 540px"
            className="object-cover object-top"
            priority
          />

          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-10 rounded-t-2xl border border-b-0 border-border/70 bg-card/5 p-3 pb-0 shadow-2xl"
            style={{ height: "72%" }}
            aria-hidden="true"
          >
            <div className="h-full rounded-t-xl border border-b-0 border-border/50" />
          </div>

          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 bg-gradient-to-t from-background via-background/95 to-transparent"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
