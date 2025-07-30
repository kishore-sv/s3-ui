"use client";
import FileComponent from "@/components/file-componenet";
import FolderComponent from "@/components/folder-component";
import { ModeToggle } from "@/components/toggle-theme-button";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { getS3Client } from "@/utils/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Loader2Icon, LogOutIcon, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type S3Object = {
  Key?: string;
  Size?: number;
  LastModified?: string;
};

export type ObjectsResponse = {
  files: S3Object[];
  folders: string[];
};

export default function S3page() {
  const [objects, setObjects] = useState<ObjectsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingFileUpload, setIsLoadingFileUpload] =
    useState<boolean>(false);
  const [s3Keys, setS3Keys] = useState({
    region: "",
    accessKeyId: "",
    secretAccessKey: "",
    bucketName: "",
  });

  const router = useRouter();

  useEffect(() => {
    const fetchObjects = async () => {
      const region = localStorage.getItem("region");
      const accessKeyId = localStorage.getItem("accessKey");
      const secretAccessKey = localStorage.getItem("secrectAccessKey");
      const bucketName = localStorage.getItem("bucketName");
      if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
        return router.replace("/");
      }

      setS3Keys({ region, accessKeyId, secretAccessKey, bucketName });

      try {
        setIsLoading(true);
        const res = await fetch(`/api/objects`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            region,
            accessKeyId,
            secretAccessKey,
            bucketName,
          }),
        });

        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setObjects(data);
      } catch (error) {
        toast.error(`Invaild keys, please check and try again`);
        router.replace('/')
        console.error("Error fetching objects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchObjects();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("region");
    localStorage.removeItem("accessKey");
    localStorage.removeItem("secrectAccessKey");
    localStorage.removeItem("bucketName");
    router.replace("/");
    toast(` Signed Out succeefully! `);
  };

  const handleUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "*/*";

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      console.log("file:", file.name);

      try {
        setIsLoadingFileUpload(true);
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        const key = file.name;

        const s3 = getS3Client({
          region: s3Keys.region,
          accessKeyId: s3Keys.accessKeyId,
          secretAccessKey: s3Keys.secretAccessKey,
        });

        const command = new PutObjectCommand({
          Bucket: s3Keys.bucketName,
          Key: key,
          Body: buffer,
          ContentType: file.type,
        });

        await s3.send(command);

        const uploadedUrl = `https://${s3Keys.bucketName}.s3.${s3Keys.region}.amazonaws.com/${key}`;
        console.log("✅ Uploaded:", uploadedUrl);
        toast.success(` File:${key} uploaded successfully `);
      } catch (err) {
        console.error("❌ Upload error:", err);
        toast.error(`Somthing went wrong while uploading:${err}`)
      } finally {
        setIsLoadingFileUpload(false);
      }
    };

    input.click(); 
  };

  return (
    <div className=" h-screen w-screen flex items-center ">
      <div className=" w-full h-full">
        <nav className=" w-full py-4 border-b flex justify-between items-center px-2 lg:px-14 ">
          <div>
            <h1 className=" text-xl font-bold ">
              {" "}
              {s3Keys.bucketName}`s S3 Bucket
            </h1>
          </div>
          <div className=" flex items-center gap-4 ">
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="cursor-pointer"
            >
              <LogOutIcon /> Sign Out
            </Button>
            <ModeToggle />
          </div>
        </nav>

        <div className=" pb-20 mx-auto w-full lg:w-[50%] border py-3 mt-2 rounded-2xl shadow lg:px-2 ">
          <div className=" border-b py-3 w-full flex items-center justify-evenly lg:justify-between ">
            <h2 className="lg:text-xl truncate font-semibold flex flex-col lg:flex-row justify-center lg:justify-normal items-center lg:gap-3 gap-2 ml-2 ">
              <svg
                width="25px"
                height="25px"
                className="rounded h-7 w-7"
                viewBox="0 0 80 80"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>S3</title>
                <defs>
                  <linearGradient
                    x1="0%"
                    y1="100%"
                    x2="100%"
                    y2="0%"
                    id="linearGradient-1"
                  >
                    <stop stopColor="#1B660F" offset="0%"></stop>
                    <stop stopColor="#6CAE3E" offset="100%"></stop>
                  </linearGradient>
                </defs>
                <g
                  id="s3"
                  stroke="none"
                  strokeWidth="1"
                  fill="none"
                  fillRule="evenodd"
                >
                  <g id="Rectangle" fill="url(#linearGradient-1)">
                    <rect x="0" y="0" width="80" height="80"></rect>
                  </g>
                  <g
                    id="Icon-Service/64/Amazon-Simple-Storage-Service_64"
                    transform="translate(8.000000, 8.000000)"
                    fill="#FFFFFF"
                  >
                    <path
                      d="M52.8359,34.8926 L53.2199,32.1886 C56.7609,34.3096 56.8069,35.1856 56.8059132,35.2096 C56.7999,35.2146 56.1959,35.7186 52.8359,34.8926 L52.8359,34.8926 Z M50.8929,34.3526 C44.7729,32.5006 36.2499,28.5906 32.8009,26.9606 C32.8009,26.9466 32.8049,26.9336 32.8049,26.9196 C32.8049,25.5946 31.7269,24.5166 30.4009,24.5166 C29.0769,24.5166 27.9989,25.5946 27.9989,26.9196 C27.9989,28.2446 29.0769,29.3226 30.4009,29.3226 C30.9829,29.3226 31.5109,29.1056 31.9279,28.7606 C35.9859,30.6816 44.4429,34.5346 50.6079,36.3546 L48.1699,53.5606 C48.1629,53.6076 48.1599,53.6546 48.1599,53.7016 C48.1599,55.2166 41.4529,57.9996 30.4939,57.9996 C19.4189,57.9996 12.6409,55.2166 12.6409,53.7016 C12.6409,53.6556 12.6379,53.6106 12.6319,53.5656 L7.5379,16.3586 C11.9469,19.3936 21.4299,20.9996 30.4999,20.9996 C39.5559,20.9996 49.0229,19.3996 53.4409,16.3736 L50.8929,34.3526 Z M6.9999,12.4776 C7.0719,11.1616 14.6339,5.9996 30.4999,5.9996 C46.3639,5.9996 53.9269,11.1606 53.9999,12.4776 L53.9999,12.9266 C53.1299,15.8776 43.3299,18.9996 30.4999,18.9996 C17.6479,18.9996 7.8429,15.8676 6.9999,12.9126 L6.9999,12.4776 Z M55.9999,12.4996 C55.9999,9.0346 46.0659,3.9996 30.4999,3.9996 C14.9339,3.9996 4.9999,9.0346 4.9999,12.4996 L5.0939,13.2536 L10.6419,53.7776 C10.7749,58.3096 22.8609,59.9996 30.4939,59.9996 C39.9659,59.9996 50.0289,57.8216 50.1589,53.7806 L52.5549,36.8836 C53.8879,37.2026 54.9849,37.3656 55.8659,37.3656 C57.0489,37.3656 57.8489,37.0766 58.3339,36.4986 C58.7319,36.0246 58.8839,35.4506 58.7699,34.8396 C58.5109,33.4556 56.8679,31.9636 53.5219,30.0546 L55.8979,13.2926 L55.9999,12.4996 Z"
                      id="Amazon-Simple-Storage-Service-Icon_64_Squid"
                    ></path>
                  </g>
                </g>
              </svg>
              {s3Keys.bucketName}
              {isLoading ? (
                <span className="w-30 h-5 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse " />
              ) : (
                <p className="lg:ml-3 text-[10px] lg:text-[12px] text-neutral-500 ">
                  Total {objects?.files ? objects.files.length : 0} files /{" "}
                  {objects?.folders ? objects.folders.length : 0} folders
                </p>
              )}
              {isLoading ? (
                <span className=" w-30 h-5 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse " />
              ) : (
                <p className="lg:ml-2 text-[10px] lg:text-[12px] text-neutral-500 ">
                  Total Size:{" "}
                  {objects?.files
                    ? `${(
                        objects.files.reduce(
                          (acc, file) => acc + (file.Size || 0),
                          0
                        ) /
                        (1024 * 1024)
                      ).toFixed(2)} MB`
                    : "0 MB"}
                </p>
              )}
            </h2>
            <div className="lg:px-4 ">
              <Button
                onClick={handleUpload}
                disabled={isLoading && isLoadingFileUpload }
                variant="outline"
                className=" cursor-pointer "
              >
                {isLoadingFileUpload ? (
                  <Loader2Icon className=" animate-spin " />
                ) : (
                  <>
                    <Upload className=" h-4 w-4 shrink-0 " />
                    <span>Upload</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className=" w-full lg:px-6 py-4 ">
            <Accordion type="multiple" className="w-full p-2 lg:p-3 ">
              <h2 className=" my-3 ">Folders</h2>
              <div className="flex flex-col gap-3 w-full">
                {isLoading ? (
                  <div className=" w-full flex justify-center items-center gap-2 ">
                    <Loader2Icon className=" animate-spin " /> Loading....{" "}
                  </div>
                ) : objects?.folders.length === 0 ? (
                  <p className="text-center">No Folders Found</p>
                ) : (
                  objects?.folders.map((folder, idx) => (
                    <FolderComponent key={idx} id={folder} name={folder} />
                  ))
                )}
              </div>
            </Accordion>

            <div className=" w-full px-2">
              <h2 className=" my-3 ">Files</h2>
              {isLoading ? (
                <div className="w-full flex justify-center items-center gap-2">
                  <Loader2Icon className="animate-spin" />
                  Loading...
                </div>
              ) : (
                objects?.files
                  ?.filter(
                    (file) =>
                      file.Key && file.LastModified && file.Size !== undefined
                  )
                  .sort(
                    (a, b) =>
                      new Date(b.LastModified!).getTime() -
                      new Date(a.LastModified!).getTime()
                  )
                  .map((file, idx) => (
                    <FileComponent
                      key={idx}
                      name={file.Key}
                      time={file.LastModified}
                      size={file.Size}
                    />
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
