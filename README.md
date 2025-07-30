# 🌩️ Simple S3 File Manager

A lightweight, web-based AWS S3 file manager built with dynamic credentials. Easily upload, browse, and delete files or folders in any S3 bucket using credentials stored in `localStorage`.

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

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/s3-file-manager.git
cd s3-file-manager
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


https://docs.aws.amazon.com/AmazonS3/latest/userguide/testing-cors.html
