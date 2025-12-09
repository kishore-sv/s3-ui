import { ModeToggle } from "@/components/toggle-theme-button";
import Link from "next/link";
import S3KeysForm from "@/components/s3keysform";
import { ArrowUp, ExternalLink, GithubIcon } from "lucide-react";
import Image from "next/image";
import CodeBlock from "@/components/CodeBlock";

export default function Home() {
  return (
    <div className="w-full min-h-screen relative text-sm">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full h-16 border-b bg-neutral-50/70 dark:bg-neutral-950/70 backdrop-blur-md px-4 lg:px-12 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            width={36}
            height={36}
            src="/logo.svg"
            alt="logo"
            className="w-8 h-8 rounded bg-neutral-900"
          />
          <h1 className="text-xl font-semibold">S3 UI</h1>
        </Link>
        <ModeToggle />
      </nav>

      {/* HERO */}
      <section
        className="w-full h-screen
    bg-gradient-to-tr via-neutral-100 to-blue-100 to-100%
      dark:via-neutral-950 dark:to-blue-900 dark:to-200%"
      >
        <main id="#" className=" w-full h-full ">
          <div className="w-full h-full flex justify-center items-center ">
            <S3KeysForm />
          </div>
        </main>
      </section>

      {/* DOCS */}
      <section id="demo" className="w-full py-10">
        <div className="mx-auto max-w-6xl px-4 space-y-16">
          {/* BLOCK TEMPLATE */}
          {/* 1 — AWS Account */}
          <div className="grid grid-cols-1 lg:grid-cols-2 border-b-2 pb-4 gap-6 items-center">
            <div className="space-y-2">
              <h1 className="text-lg flex items-center gap-2 font-semibold text-primary">
                <RoundedStep step="1" />
                Create an AWS Account
              </h1>
              <Link
                href="https://aws.amazon.com/"
                target="_blank"
                className="flex items-center gap-1 text-blue-500 hover:underline"
              >
                AWS Console <ExternalLink className="h-3 w-3" />
              </Link>
              <p className="text-neutral-500">
                After login, you'll land on the AWS console.
              </p>
            </div>
            <img
              src="/aws_signin.png"
              alt="aws_signin"
              className="rounded-md border-1 border-neutral-500 shadow-sm w-full  object-cover"
            />
          </div>

          {/* 2 — IAM User */}
          <div className="grid grid-cols-1 lg:grid-cols-2 border-b-2 pb-4 gap-6 items-start">
            <div className="space-y-2">
              <h1 className="text-lg flex items-center gap-2 font-semibold text-primary">
                <RoundedStep step="2" /> Create IAM User
              </h1>

              <p className="text-neutral-500">
                You must create a user to generate access keys.
              </p>

              <ul className="space-y-3">
                <li>
                  <strong>Step 1:</strong> User details
                  <p className="dark:text-neutral-400 my-1 text-neutral-600">Give any username.</p>
                </li>

                <li>
                  <strong>Step 2:</strong> Permissions
                  <p className="dark:text-neutral-400 my-1 text-neutral-600">Add AmazonS3FullAccess.</p>
                  <img
                    src="/permissions.png"
                    className="rounded-md mt-2 border-1 border-neutral-500 shadow-sm w-full  object-cover"
                  />
                </li>

                <li>
                  <strong>Step 3:</strong> Review
                  <p className="dark:text-neutral-400 text-neutral-600">Get access + secret key.</p>
                </li>
              </ul>
            </div>

            <img
              src="/iam.png"
              alt="iam"
              className="rounded-md shadow-sm w-full  object-cover"
            />
          </div>

          {/* 3 — Access Keys */}
          <div className="grid grid-cols-1 lg:grid-cols-2 border-b-2 pb-4 gap-6 items-start">
            <div className="space-y-2">
              <h1 className="text-lg flex items-center gap-2 font-semibold text-primary">
                <RoundedStep step="3" /> Create Access Keys
              </h1>
              <p className="text-neutral-500">Open user → Create Access Key.</p>

              <ul className="space-y-3">
                <li>
                  <strong>Step 1:</strong> Choose use-case
                  <img
                    src="/access_keys_step_1.png"
                    className="rounded-md border-1 border-neutral-500 shadow-sm  mt-2 w-full  object-cover"
                  />
                </li>

                <li>
                  <strong>Step 2:</strong> Add tags (optional)
                </li>

                <li>
                  <strong>Step 3:</strong> Copy or download keys
                </li>
              </ul>
            </div>

            <img
              src="/access_keys.png"
              alt="keys"
              className="rounded-md  border-1 border-neutral-500 shadow-sm w-full object-cover"
            />
          </div>

          {/* 4 — S3 Bucket */}
          <div className="grid grid-cols-1 lg:grid-cols-2 border-b-2 pb-4 gap-6 items-start">
            <div className="space-y-2">
              <h1 className="text-lg flex items-center gap-2 font-semibold text-primary">
                <RoundedStep step="4" /> Create S3 Bucket
              </h1>
              <p className="text-neutral-500">Bucket name must be unique.</p>

              <img
                src="/create_bucket.png"
                className="rounded-md border-1 border-neutral-500 shadow-sm object-cover"
              />

              <p className="">Disable block public access & set CORS.</p>
            </div>

            <img
              src="/s3_search.png"
              alt="bucket"
              className="rounded-md border-1 border-neutral-500 shadow-sm w-full object-cover"
            />
          </div>

          {/* 5 — CORS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 border-b-2 pb-4 gap-6 items-start">
            <div className="space-y-2">
              <h1 className="text-lg flex items-center gap-2 font-semibold text-primary">
                <RoundedStep step="5" /> Set CORS & Public Access
              </h1>

              <p className="text-neutral-500">Paste this CORS config:</p>

              <CodeBlock
                language="json"
                code={`[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://s3-ui.kishore-sv.me/"],
    "ExposeHeaders": []
  }
]`}
              />
            </div>

            <img
              src="/cors.png"
              className="rounded-md border-1 border-neutral-500 shadow-sm w-full object-cover"
            />
          </div>

          {/* 6 — Policy */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="space-y-2">
              <h1 className="text-lg flex items-center gap-2 font-semibold text-primary">
                <RoundedStep step="6" /> Bucket Policy (Optional)
              </h1>
              <CodeBlock
                language="json"
                code={`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::yourbucketName/*"
    }
  ]
}`}
              />
            </div>

            <img
              src="/bucket_policy.png"
              className="rounded-md border-1 border-neutral-500 shadow-sm w-full object-cover"
            />
          </div>

          {/* FOOTER */}
          <footer className="text-center space-y-3 pt-8 border-t">
            <p>You're ready to go 🎉</p>

            <a
              href="#"
              className="flex justify-center items-center gap-1 text-blue-500 hover:underline group"
            >
              Go to top
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition" />
            </a>

            <p className="text-xs text-neutral-500 max-w-md mx-auto">
              Keys are never stored on our servers — only in your browser's
              local storage.
            </p>

            <div className="flex justify-center items-center gap-6 text-xs opacity-70 hover:opacity-100 transition">
              <Link
                href="https://github.com/kishore-sv"
                className="flex items-center gap-1"
              >
                <GithubIcon className="w-4 h-4" />
                @kishore-sv
              </Link>

              <Link
                href="https://x.com/kishore_sv_7"
                className="flex items-center gap-1"
              >
                <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                @kishore_sv_7
              </Link>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
}

const RoundedStep = ({ step }: { step: string }) => {
  return (
    <div
      className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center
            text-white text-sm font-bold "
    >
      {step}
    </div>
  );
};
