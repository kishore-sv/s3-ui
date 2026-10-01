import Image from "next/image";
import {
  Cloud,
  FolderTree,
  Lock,
  Upload,
} from "lucide-react";

export function HomeAboutSection() {
  return (
    <section className="w-full border-t border-border/60 bg-background py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-6">
          <div className="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
            Storage Explorer
          </div>

          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            A modern file manager for S3-compatible storage
          </h2>

          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            S3-UI turns any S3-compatible bucket into a polished cloud storage
            workspace. Connect once, then browse folders, upload files, preview
            documents, and manage objects — without touching the AWS console.
          </p>

          <ul className="space-y-4">
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FolderTree className="h-4 w-4" />
              </span>
              <div>
                <p className="font-medium">VS Code-style explorer</p>
                <p className="text-sm text-muted-foreground">
                  Sidebar tree, breadcrumbs, list and grid views, and a
                  resizable layout built for real folder navigation.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Cloud className="h-4 w-4" />
              </span>
              <div>
                <p className="font-medium">Works with your provider</p>
                <p className="text-sm text-muted-foreground">
                  Amazon S3, Supabase Storage, Cloudflare R2, MinIO, and any
                  other S3-compatible endpoint.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Upload className="h-4 w-4" />
              </span>
              <div>
                <p className="font-medium">Full file operations</p>
                <p className="text-sm text-muted-foreground">
                  Upload, download, create folders, delete, preview, search, and
                  inspect file details from one interface.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Lock className="h-4 w-4" />
              </span>
              <div>
                <p className="font-medium">Your keys stay in your browser</p>
                <p className="text-sm text-muted-foreground">
                  Credentials are saved only in local storage on your device —
                  never on our servers.
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div className="mx-auto w-full max-w-lg lg:mx-0">
          <Image
            src="/home.png"
            alt="S3-UI file explorer"
            width={2880}
            height={1550}
            className="w-full rounded-xl border border-border/60 shadow-lg dark:hidden"
            priority
          />
          <Image
            src="/home_dark.png"
            alt="S3-UI file explorer"
            width={2880}
            height={1550}
            className="hidden w-full rounded-xl border border-border/60 shadow-lg dark:block"
            priority
          />
        </div>
      </div>
    </section>
  );
}
