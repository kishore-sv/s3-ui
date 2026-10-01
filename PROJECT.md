# S3-UI - Project Documentation

This document explains what S3-UI is, how it is built, and how the pieces fit together. Read this when you return to the project after a break and need to understand the codebase quickly.

---

## What is S3-UI?

S3-UI is a **browser-based file manager for S3-compatible object storage**. Users enter their storage credentials once, then browse buckets, upload files, create folders, download, preview, and delete objects - similar to Google Drive or Dropbox, but for S3-style storage.

It is **not** a backend storage service. It is a **frontend UI** that talks directly (or via one API route) to your existing bucket using the AWS S3 API.

**Live demo:** [https://s3-ui.kishore-sv.me](https://s3-ui.kishore-sv.me)

---

## Why this project exists

Object storage (S3, R2, Supabase Storage, MinIO, etc.) is powerful but not user-friendly out of the box. Developers often need a quick way to:

- Inspect bucket contents without the AWS Console
- Upload or delete files during development
- Connect to **non-AWS** providers that expose an S3-compatible API

S3-UI solves this with:

- **No server-side credential storage** - keys stay in the user's browser (`localStorage`)
- **One unified UI** for multiple providers
- **A production-style file explorer** instead of a basic CRUD form

---

## Supported storage providers

All providers use the **same AWS SDK** (`@aws-sdk/client-s3`). Differences are handled by **endpoint URL** and **path-style addressing**.

| Provider | How it is detected | Endpoint example |
|----------|-------------------|------------------|
| **Amazon S3** | No endpoint (empty) | *(leave blank)* |
| **MinIO** | `localhost`, `127.0.0.1`, or `minio` in URL | `http://localhost:9000` |
| **Cloudflare R2** | `r2.cloudflarestorage.com` | `https://<account>.r2.cloudflarestorage.com` |
| **Supabase Storage** | `supabase.co` in URL | `https://<project>.supabase.co/storage/v1/s3` |
| **S3-compatible** | Any other custom endpoint | Backblaze B2, Wasabi, DigitalOcean Spaces, etc. |

Detection logic lives in `utils/storageConfig.ts` → `detectProvider()`.

There is **no manual provider picker**. The app infers the provider from the endpoint you type in the login form.

---

## Tech stack

| Technology | Purpose | Why it was chosen |
|------------|---------|-------------------|
| **Next.js 15** (App Router) | Framework, routing, API routes | File-based routing, `app/` structure, server route for listing |
| **React 19** | UI | Standard for Next.js; client components for interactive explorer |
| **TypeScript** | Type safety | Shared types for storage config, explorer items, API responses |
| **Tailwind CSS 4** | Styling | Utility-first, works with design tokens |
| **shadcn/ui** (New York style) | UI components | Accessible primitives: sidebar, table, dialog, command palette, etc. |
| **AWS SDK v3** | S3 operations | Official client; works with any S3-compatible endpoint |
| **Sonner** | Toast notifications | Success/error feedback for uploads, deletes, etc. |
| **next-themes** | Dark/light mode | System preference + manual toggle |
| **react-hook-form + Zod** | Login form validation | Validated credential entry on `/` |
| **Lucide React** | Icons | Consistent icon set for files, folders, actions |
| **cmdk** | Command palette | Cmd/Ctrl+K power-user shortcuts |

---

## High-level architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser                                  │
│  ┌──────────────┐    ┌─────────────────────────────────────────┐ │
│  │ localStorage │    │           React UI                       │ │
│  │ (credentials)│───▶│  /  → S3KeysForm (connect)              │ │
│  └──────────────┘    │  /s3 → FileExplorer (main product)      │ │
│                      └───────────┬─────────────────────────────┘ │
│                                  │                                 │
│         ┌────────────────────────┼────────────────────────┐       │
│         ▼                        ▼                        ▼       │
│  POST /api/objects      Client S3 SDK (upload,            Presigned│
│  (list files/folders)   delete, create folder)           URLs     │
└─────────┬───────────────────────┬──────────────────────────┬───────┘
          │                       │                          │
          ▼                       ▼                          ▼
   Next.js API route         Direct to provider          Direct to provider
   (ListObjectsV2)          (PutObject, Delete, etc.)   (GetObject signed)
          │                       │                          │
          └───────────────────────┴──────────────────────────┘
                                  │
                                  ▼
                    S3-compatible storage (AWS, R2, Supabase, MinIO, …)
```

### Important design choice: split between API and client

| Operation | Where it runs | Why |
|-----------|---------------|-----|
| **List objects** | Server - `app/api/objects/route.ts` | Keeps listing logic in one place; uses `ListObjectsV2` with delimiter `/` |
| **Upload** | Client - `utils/uploadObject.ts` | `PutObjectCommand` in browser |
| **Delete file** | Client - `utils/deleteObject.ts` | `DeleteObjectCommand` in browser |
| **Delete folder** | Client - `utils/deleteFolder.ts` | Lists all keys under prefix (paginated), then bulk delete |
| **Create folder** | Client - `utils/createFolder.ts` | Zero-byte object with trailing `/` (S3 folder convention) |
| **Download / preview** | Client - `getPresignedObjectUrl()` | 1-hour signed URL, generated on demand |

Credentials are sent in the **POST body** when listing, and used directly in the browser for mutations. They are **never stored on the server**.

---

## Project structure

```
s3-ui/
├── app/
│   ├── layout.tsx          # Root layout: theme, fonts, toaster
│   ├── page.tsx            # Landing page + credential form + docs
│   ├── globals.css         # Tailwind + shadcn CSS variables
│   ├── s3/
│   │   └── page.tsx        # File explorer entry (ExplorerProvider + FileExplorer)
│   └── api/
│       └── objects/
│           └── route.ts    # POST - list files and folders
│
├── components/
│   ├── file-explorer/      # ★ Main product - full file manager UI
│   ├── s3keysform.tsx      # Credential entry form
│   ├── storage-provider-icon.tsx
│   ├── supported-providers-table.tsx
│   ├── toggle-theme-button.tsx
│   └── ui/                 # shadcn components (button, table, sidebar, …)
│
├── hooks/
│   ├── use-explorer-items.ts    # Current folder items, sort, search filter
│   ├── use-folder-tree.ts       # Lazy sidebar tree expand/load
│   ├── use-keyboard-shortcuts.ts
│   ├── use-local-preference.ts  # Persist view mode, sort in localStorage
│   └── use-mobile.ts            # Responsive breakpoint (from shadcn)
│
├── types/
│   └── explorer.ts         # S3Object, ObjectsResponse, ExplorerItem, etc.
│
├── utils/
│   ├── storageConfig.ts    # Provider detection, localStorage, presigned URLs
│   ├── s3Client.ts         # S3Client factory (path-style for non-AWS)
│   ├── fetchObjects.ts     # Client wrapper for POST /api/objects
│   ├── uploadObject.ts
│   ├── deleteObject.ts
│   ├── deleteFolder.ts
│   ├── createFolder.ts
│   ├── mapObjectsToExplorerItems.ts
│   ├── formatExplorer.ts   # Bytes, dates, file type labels
│   └── countFolderContents.ts
│
└── public/
    ├── logo.svg
    └── providers/          # Provider logos (aws-s3, supabase, r2, …)
```

---

## User flow

### 1. Connect (`/`)

1. User opens the homepage.
2. `S3KeysForm` collects: bucket name, access key, secret key, region, optional endpoint.
3. On submit → `saveStorageConfigToLocalStorage()` → redirect to `/s3`.
4. Provider is auto-detected from endpoint and shown in the form.

### 2. Explore (`/s3`)

1. `ExplorerProvider` reads credentials from `localStorage`. If missing → redirect to `/`.
2. Fetches root bucket contents via `fetchObjects(config)`.
3. Renders `FileExplorer`: sidebar tree + main table/grid + toolbars + dialogs.
4. URL reflects current folder: `/s3?path=uploads/user-123` (browser back/forward works).

### 3. Sign out

"Remove Keys" clears `localStorage` and sends user back to `/`.

---

## File explorer (`components/file-explorer/`)

The explorer is the **main product**. It replaced an older recursive accordion UI.

### Layout

```
┌──────────────────────────────────────────────────────────────┐
│ ExplorerAppHeader - logo, search, theme, provider, Remove Keys│
├─────────────┬────────────────────────────────────────────────┤
│ Sidebar     │ Breadcrumbs                                    │
│ (folder     │ Storage header (bucket, stats, Upload/New)     │
│  tree)      │ Toolbar (upload, refresh, list/grid, search)   │
│             │ Selection toolbar (when items selected)        │
│             │ File table OR file grid                        │
├─────────────┴────────────────────────────────────────────────┤
│ Status bar - item count, connection status                   │
└──────────────────────────────────────────────────────────────┘
```

### Key components

| File | Responsibility |
|------|----------------|
| `explorer-context.tsx` | Global explorer state: path, selection, cache, URL sync |
| `file-explorer.tsx` | Shell wiring, delete/upload dialogs, drag-and-drop overlay |
| `explorer-sidebar.tsx` + `folder-tree.tsx` | Lazy-loading folder tree |
| `file-table.tsx` / `file-grid.tsx` | List and grid views |
| `upload-dialog.tsx` | Multi-file upload with queue |
| `new-folder-dialog.tsx` | Create folder in current path |
| `explorer-delete-dialog.tsx` | Safe delete (file, empty/non-empty folder, bulk) |
| `file-preview-dialog.tsx` | Image, PDF, text preview via presigned URL |
| `file-details-sheet.tsx` | Metadata side panel |
| `explorer-command.tsx` | Cmd/Ctrl+K command palette |

### State management

There is **no Redux/Zustand**. State is split as follows:

| Layer | What it holds |
|-------|----------------|
| `localStorage` | Credentials, view mode (`list`/`grid`), sort preferences |
| `ExplorerProvider` | Current path, selection, folder cache, connection status, dialog open flags |
| Component `useState` | Dialog-local state (upload queue, form inputs) |
| Custom hooks | Derived data (`useExplorerItems`), tree loading (`useFolderTree`) |

### Folder navigation model

S3 does not have real directories - only **object keys** with `/` separators. The UI treats prefixes as folders:

- `uploads/` → folder named `uploads`
- `uploads/invoice.pdf` → file inside `uploads`

`ListObjectsV2` with `Delimiter: "/"` returns:
- `Contents` → files at current level
- `CommonPrefixes` → subfolder prefixes

Folder markers (zero-byte keys ending in `/`) are filtered out in `mapObjectsToExplorerItems.ts`.

---

## Credentials and security

### What is stored in `localStorage`

| Key | Maps to |
|-----|---------|
| `accessKey` | `accessKeyId` |
| `secrectAccessKey` | `secretAccessKey` *(typo preserved in codebase)* |
| `region` | AWS region |
| `bucketName` | Bucket name |
| `endpoint` | Optional custom endpoint |
| `storageProvider` | Detected provider ID (informational) |

### Security notes

- Credentials exist **only in the user's browser**.
- They are sent to `/api/objects` in the request body when listing.
- Mutations run in the browser with the AWS SDK.
- **Do not** commit real keys or deploy this as a multi-tenant service without proper auth.
- Suitable for: personal use, dev tools, trusted single-user scenarios.

---

## API reference

### `POST /api/objects`

Lists objects at a given prefix.

**Query params:**
- `prefix` (optional) - folder path, e.g. `uploads/` or `uploads/user-123/`

**Body:** `StorageConfig` JSON

```json
{
  "region": "us-east-1",
  "accessKeyId": "...",
  "secretAccessKey": "...",
  "bucketName": "my-bucket",
  "endpoint": "https://..."
}
```

**Response:**

```json
{
  "files": [
    { "Key": "uploads/file.pdf", "Size": 1024, "LastModified": "2026-09-16T..." }
  ],
  "folders": ["uploads/images/"]
}
```

---

## S3 client configuration

`utils/s3Client.ts` creates an `S3Client` with:

- Static credentials from user input
- Custom `endpoint` when provided (non-AWS providers)
- `forcePathStyle: true` for all non-AWS providers (`shouldUsePathStyle()` in `storageConfig.ts`)

This is required for MinIO, R2, Supabase, and most S3-compatible services.

---

## Keyboard shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Open command palette |
| `Cmd/Ctrl + B` | Toggle sidebar |
| `Delete` | Delete selected items (with confirmation) |
| `Enter` | Open selected folder or preview file |
| `Escape` | Clear selection / close overlays |

---

## Known limitations

1. **No rename or move** - not implemented; menus hide these actions.
2. **Single-page listing** - `ListObjectsV2` returns one page; very large folders may truncate.
3. **Search** - filters **current folder only** (client-side); no recursive bucket search.
4. **Upload progress** - best-effort; AWS SDK v3 in browser does not provide reliable byte-level progress.
5. **Folder delete count** - accurate up to 1000 objects per list call; shows "at least N" if truncated.
6. **Credentials in localStorage** - convenient but not suitable for shared or production multi-user apps without additional auth.

---

## Development

### Prerequisites

- Node.js 20+
- npm or yarn

### Commands

```bash
npm install      # Install dependencies
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build
npm run start    # Run production build
npm run lint     # ESLint
```

### Adding a shadcn component

```bash
npx shadcn@latest add <component-name>
```

Config is in `components.json` (New York style, neutral base color).

### Where to start when debugging

| Problem | Look at |
|---------|---------|
| Can't connect / wrong provider | `utils/storageConfig.ts`, `components/s3keysform.tsx` |
| Listing fails | `app/api/objects/route.ts`, `utils/fetchObjects.ts` |
| Upload/delete fails | `utils/uploadObject.ts`, `utils/deleteObject.ts`, `utils/deleteFolder.ts` |
| UI navigation / path wrong | `components/file-explorer/explorer-context.tsx` |
| Sidebar tree not loading | `hooks/use-folder-tree.ts`, `components/file-explorer/folder-tree-item.tsx` |
| Table/grid display | `hooks/use-explorer-items.ts`, `utils/mapObjectsToExplorerItems.ts` |

---

## Data types (quick reference)

Defined in `types/explorer.ts`:

```ts
// Raw API response
type ObjectsResponse = {
  files: S3Object[];
  folders: string[];  // prefix strings like "uploads/"
};

// Normalized UI model
type ExplorerItem = {
  key: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  lastModified?: string;
  path: string;
  parentPath: string;
};
```

---

## Pages overview

| Route | File | Purpose |
|-------|------|---------|
| `/` | `app/page.tsx` | Marketing/docs + `S3KeysForm` to connect |
| `/s3` | `app/s3/page.tsx` | File explorer (main app) |
| `/api/objects` | `app/api/objects/route.ts` | Server-side object listing |

---

## Styling and theming

- **CSS variables** in `app/globals.css` (oklch colors, light/dark via `.dark` class)
- **shadcn semantic tokens**: `background`, `foreground`, `muted`, `border`, `destructive`, etc.
- **Theme toggle**: `components/toggle-theme-button.tsx` using `next-themes`
- Prefer semantic tokens over hardcoded `neutral-*` in new explorer components

---

## Summary

S3-UI is a **Next.js + TypeScript** app that provides a **multi-provider S3 file manager** in the browser. Credentials stay local; listing goes through one API route; everything else uses the AWS SDK client-side. The **file explorer** under `components/file-explorer/` is the core product - sidebar navigation, table/grid views, upload, delete, preview, and keyboard shortcuts - built on a thin storage abstraction in `utils/`.

When you come back to this project:

1. Read credentials flow: `s3keysform.tsx` → `storageConfig.ts`
2. Read data flow: `fetchObjects` → `explorer-context` → `file-explorer`
3. Run `npm run dev`, connect a bucket, and explore `/s3`

That is the full picture.
