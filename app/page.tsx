import { ModeToggle } from "@/components/toggle-theme-button";
import Link from "next/link";
import S3KeysForm from "@/components/s3keysform";
import { ArrowUp, ExternalLink, GithubIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="lg:w-full w-screen relative ">
      <nav className=" w-full h-18 lg:fixed top-0 gap-18 px-10 flex lg:justify-between items-center lg:px-20 py-2 bg-neutral-50/80 border-b dark:bg-neutral-950/80 backdrop-blur-md ">
        <div className=" w-50 h-full flex items-center ">
          <Link href="/">
            <h1 className="text-3xl font-bold ">S3 UI</h1>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
        </div>
      </nav>

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

      <section
        id="demo"
        className="w-full h-screen pt-20 lg:px-30 transition-transform ease-in-out"
      >
        <div className=" w-full border-x space-y-30 h-fit px-7 ">
          <div className=" flex flex-col lg:flex-row gap-4 items-center lg:justify-between ">
            <div className=" lg:w-[40%] gap-2 ">
              <h1 className=" text-xl font-semibold text-primary ">
                1. Create a AWS Account, if not there
              </h1>
              <Link
                href="https://aws.amazon.com/"
                target="_blank"
                className=" flex my-1 ml-4 gap-px items-center hover:underline text-blue-400 "
              >
                AWS Console <ExternalLink className=" h-4 w-4 shrink-0 " />{" "}
              </Link>
              <p className=" text-neutral-400 text-sm ml-3 ">
                After Signin/Signup , You will be landed to AWS Console.
              </p>
            </div>
            <div className=" lg:w-[60%] bg-red-700 h-auto rounded-md overflow-hidden ">
              <img
                src="/aws_signin.png"
                alt="aws_signin"
                className=" h-full w-full object-cover "
              />
            </div>
          </div>

          <div className=" flex flex-col gap-4 items-center justify-between lg:flex-row-reverse ">
            <div className=" lg:w-[40%] gap-2 ">
              <h1 className=" text-xl font-semibold text-primary ">
                2. Create Identity and Access Management (IAM) USER
              </h1>
              <p className=" text-neutral-400 text-sm ml-3 ">
                You can create a individual USER or make a group and add USER to
                group. <br />
                To get ACCESS KEYS, you need to create a IAM USER. <br />
                Click on Users and create a one
              </p>
              <div className="w-full ">
                <ul>
                  <li className=" flex flex-col ">
                    Step 1: Specify user details{" "}
                    <span className=" text-neutral-800 dark:text-neutral-500 text-sm ">
                      {" "}
                      give any name to USER{" "}
                    </span>
                  </li>
                  <li className=" flex flex-col ">
                    Step 2: Set permissions{" "}
                    <span className=" text-neutral-800 dark:text-neutral-500 text-sm ">
                      In Set permissions boundary, enable Use a permissions
                      boundary to control the maximum permissions
                    </span>{" "}
                    <br />
                    Give AmazonS3FullAccess to the USER.
                    <div className="rounded-md overflow-hidden ">
                      <img
                        src="/permissions.png"
                        className="w-full h-full object-cover "
                        alt="permissions"
                      />
                    </div>
                  </li>
                  <li className=" flex flex-col ">
                    Step 3: Review and create{" "}
                    <span className=" text-neutral-800 dark:text-neutral-500 text-sm ">
                      {" "}
                      Create user and you will get your access key and access
                      secect key{" "}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className=" lg:w-[60%] h-auto rounded-md overflow-hidden ">
              <img
                src="/iam.png"
                alt="aws_signin"
                className=" h-full w-full object-cover "
              />
            </div>
          </div>

          <div className=" flex flex-col lg:flex-row gap-4 items-center lg:justify-between ">
            <div className=" lg:w-[40%] gap-2 ">
              <h1 className=" text-xl font-semibold text-primary ">
                3. Create ACCESS Keys
              </h1>
              <p className=" text-neutral-400 text-sm ml-3 ">
                After Creating a user , You will see user in USERS Console.Click
                on the Your created user.
              </p>
              <p>Click on Create Access Key</p>
              <div className="w-full my-3 ">
                <ul>
                  <li className=" flex flex-col ">
                    Step 1: Access key best practices & alternatives{" "}
                    <span className=" text-neutral-800 text-sm ">
                      {" "}
                      give use case.{" "}
                    </span>
                    <div className=" w-full h-auto rounded-md overflow-hidden ">
                      <img src="/access_keys_step_1.png" alt="" />
                    </div>
                    <p>
                      {" "}
                      check on, I understand the above recommendation and want
                      to proceed to create an access key.
                    </p>
                    <p>Next</p>
                  </li>
                  <li className=" flex flex-col ">
                    Step 2: Set description tag
                    <span className=" text-neutral-800 dark:text-neutral-500 text-sm ">
                      give any tags , if you want which is optional.
                    </span>
                    <p>Then , Click On Create Access Key</p>
                  </li>
                  <li className=" flex flex-col ">
                    Step 3: Retrieve access keys
                    <p>
                      Copy the Access key and Secret access key or download the
                      .csv file.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
            <div className=" lg:w-[60%] h-auto rounded-md overflow-hidden ">
              <img
                src="/access_keys.png"
                alt="aws_signin"
                className=" h-full w-full object-cover "
              />
            </div>
          </div>

          <div className=" flex flex-col gap-4 items-center justify-between lg:flex-row-reverse ">
            <div className=" lg:w-[40%] gap-2 ">
              <h1 className=" text-xl font-semibold text-primary ">
                4. Create S3 Bucket
              </h1>
              <p className=" text-neutral-400 text-sm ml-3 ">Create a Bucket</p>
              <div className="w-full ">
                <div className=" w-full h-auto rounded-md overflow-hidden ">
                  <img
                    src="/create_bucket.png"
                    alt="aws_signin"
                    className=" h-full w-full object-cover "
                  />
                </div>
                <p>Note: Bucket name should unique over global</p>
                <p>
                  Then , we need to setup Cross-origin resource sharing (CORS)
                </p>
                <p>
                  Now click on youe bucket, <br />
                  Go to Permissions tab scroll down down untill you get
                  Cross-origin resource sharing (CORS) section and Block public
                  access (bucket settings) section
                </p>
                <p>
                  Disable Block public access (bucket settings) and see cors
                  setup in next step.
                </p>
              </div>
            </div>
            <div className=" lg:w-[60%] bg-red-700 h-auto rounded-md overflow-hidden ">
              <img
                src="/s3_search.png"
                alt="aws_signin"
                className=" h-full w-full object-cover "
              />
            </div>
          </div>

          <div className=" flex flex-col lg:flex-row gap-4 items-center lg:justify-between ">
            <div className=" lg:w-[40%] gap-2 ">
              <h1 className=" text-xl font-semibold text-primary ">
                5. Set CORS And Block public access (bucket settings)
              </h1>
              <p className="text-md font-semibold my-2">
                Disable Block all public access
              </p>
              <p className=" text-neutral-400 text-sm ml-3 ">
                The CORS configuration, written in JSON, defines a way for
                client web applications that are loaded in one domain to
                interact with resources in a different domain
              </p>
              <div className="w-full ">
                <p>Copy this code and paste there and save changes</p>
                <code lang="json" className=" border my-2 ">
                  <pre>
                    {`[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "PUT",
            "POST",
            "DELETE"
        ],
        "AllowedOrigins": [
            "http://localhost:3000"
        ],
        "ExposeHeaders": []
    }
]`}
                  </pre>
                </code>
                <p>Note: Will get your REGION name on your BUCKETS console.</p>
                <p className=" font-semibold ">
                  Please wait for some time after CORS update.AWS need to update
                  it.
                </p>
                <p className="text-neutral-400 text-sm mt-2">
                  Set any other permissions if you need.
                </p>
              </div>
            </div>
            <div className=" lg:w-[60%]h-auto rounded-md overflow-hidden ">
              <img
                src="/cors.png"
                alt="aws_signin"
                className=" h-full w-full object-cover "
              />
            </div>
          </div>

          <div className=" flex flex-col lg:flex-row gap-4 items-center lg:justify-between ">
            <div className=" lg:w-[40%] gap-2 ">
              <h1 className=" text-xl font-semibold text-primary ">
                6. Bucket policy (optional)
              </h1>
              <p className="text-md font-semibold my-2">
                for dowanloading and preview of images you need to setuip Bucket
                policy.
              </p>
              <div className="w-full ">
                <p>Copy this code and paste there and save changes</p>
                <code lang="json" className=" border my-2 ">
                  <pre>
                    {`{
    "Version": "2012-10-17",
    "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::yourbucketName/*"
    }
    ]
}`}
                  </pre>
                </code>
                <p className="text-neutral-400 text-sm mt-2">
                  Set any other policy if you need.
                </p>
              </div>
            </div>
            <div className=" lg:w-[60%]h-auto rounded-md overflow-hidden ">
              <img
                src="/bucket_policy.png"
                alt="aws_signin"
                className=" h-full w-full object-cover "
              />
            </div>
          </div>

          <div className=" w-full  flex flex-col px-10 justify-center items-center mb-3 pb-10 ">
            <p>That`s it 🎉,you are set to go.</p>
            <a href="#" className=" flex justify-center gap-2 group items-center text-blue-400 hover:underline ">
              Now Go To TOP <ArrowUp className=" w-5 h-5 group-hover:-translate-y-1 transition-transform ease-in-out " />
            </a>
            <div className=" flex justify-center items-center gap-4 mt-4 ">
              <Link
                href="https://github.com/kishore-sv"
                className=" opacity-50 hover:opacity-[1] flex justify-center items-center gap-1 transition-opacity ease-in-out  "
              >
                <GithubIcon className=" w-[1.2rem] h-[1.2rem] shrink-0" />
                <span>@kishore-sv</span>
              </Link>

              <Link
                href="https://x.com/kishore_sv_7"
                className=" opacity-50 hover:opacity-[1] flex justify-center items-center gap-1 transition-opacity ease-in-out  "
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </svg>
                <span>@kishore_sv_7</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
