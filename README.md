# 🌩️ Simple S3 File Manager

A lightweight, web-based AWS S3 file manager built with dynamic credentials. Easily upload, browse, and delete files or folders in any S3 bucket using credentials stored in `localStorage`.

**🚀 Live Demo**

[🔗 https://s3-ui.kishore-sv.me](https://s3-ui.kishore-sv.me)

---

## ✨ Features

- Dynamic S3 credentials via a simple form
- List all files and folders in your bucket
- Upload files to specific folders
- Delete files from S3
- Credentials stored in `localStorage` (no backend required)

---

## Tech Stack

- Next.js (App Router)
- AWS SDK v3 (`@aws-sdk/client-s3`)
- Tailwind CSS
- TypeScript

---

![homepage](https://www.kishore-sv.me/_next/image?url=https%3A%2F%2Fkishore-protfolio.s3.amazonaws.com%2Fd38caf43-450f-4417-9bd2-2d6f5b2f448b-home_dark.png&w=1080&q=75)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/kishore-sv/s3-ui.git
cd s3-ui
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Run the development server

```bash
npm run dev
# or
yarn dev
```

## Usage

1. On the homepage, enter your:

- Bucket Name

- Access Key ID

- Secret Access Key

- AWS Region

2. Click Continue to save credentials in localStorage.

3. Browse files and folders.

4. Upload or delete files with one click.

That's it — you're all set! ✅ Done and dusted.

``Don't worry! We never store your keys on our servers. They'resaved only in your browser's local storage — visible an manageable by you alone.``
