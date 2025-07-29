"use client";
import { ModeToggle } from "@/components/toggle-theme-button";
import { Button } from "@/components/ui/button";
import { getS3Client } from "@/uitils/s3Client";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import {
  Calendar,
  ChevronRight,
  Download,
  File,
  Folder,
  Inbox,
  Loader2Icon,
  LogOutIcon,
  Plus,
  Trash,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type S3Object = {
  Key?: string;
  Size?: number;
  LastModified?: string;
};

type ObjectsResponse = {
  files: S3Object[];
  folders: string[];
};

export default function S3page() {
  const [objects, setObjects] = useState<ObjectsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
        router.refresh();
        alert("Upload successful!");
      } catch (err) {
        console.error("❌ Upload error:", err);
        alert("Upload failed.");
      }
    };

    input.click(); // open the file dialog
  };

  return (
    <div className=" h-screen w-screen  flex items-center ">
      <div className=" w-full h-full">
        <nav className=" w-full py-4 border-b flex justify-between items-center px-14 ">
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

        <div className=" pb-20 mx-auto w-[50%] border py-3 mt-2 rounded-2xl shadow px-2 ">
          <div className=" border-b py-3 w-full flex items-center justify-between ">
            <h2 className=" tetx-xl font-semibold flex items-center gap-3 ml-2 ">
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
              <p className="ml-3 text-[12px] text-neutral-500 ">
                Total {objects?.files ? objects.files.length - 1 : 0} files /{" "}
                {objects?.folders ? objects.folders.length : 0} folders
              </p>
              <p className="ml-2 text-[12px] text-neutral-500 ">
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
            </h2>
            <div className=" px-4 ">
              <Button
                onClick={handleUpload}
                disabled={isLoading}
                variant="outline"
                className=" cursor-pointer "
              >
                {isLoading ? (
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

          <div className=" w-full px-6 py-4 ">
            <Accordion type="multiple" className="w-full p-3 ">
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

function FileComponent({
  name,
  time,
  size,
  link,
}: {
  name?: string;
  time?: string;
  size?: number;
  link?: string;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const router = useRouter();

 const handleFileDelete = async (fileKey: string) => {
  try {
    setIsLoading(true);

    const region = localStorage.getItem("region");
    const accessKeyId = localStorage.getItem("accessKey");
    const secretAccessKey = localStorage.getItem("secrectAccessKey");
    const bucketName = localStorage.getItem("bucketName");

    if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
      return router.replace("/");
    }

    const s3 = getS3Client({
      region,
      accessKeyId,
      secretAccessKey,
    });

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
    });

    await s3.send(command);
    console.log(`✅ File deleted: ${fileKey}`);
    alert("File deleted successfully.");

    // ✅ Refresh page data
    router.refresh();
  } catch (err) {
    console.error("❌ Failed to delete file:", err);
    alert("Failed to delete file.");
  } finally {
    setIsLoading(false);
  }
};


  const signedUrl = `https://kishore-protfolio.s3.eu-north-1.amazonaws.com/${
    link || name
  }`;
  return (
    <div className="border rounded-md my-2 px-4 py-2 text-balance hover:bg-neutral-100 dark:hover:bg-neutral-800">
      <div className=" w-full flex justify-between items-center ">
        <div className=" w-[70%] ">
          <p className="px-2 w-full overflow-hidden flex items-center gap-2 ">
            <File className="w-5 h-5 shrink-0 text-neutral-700 dark:text-neutral-200" />{" "}
            <span className=" text-primary truncate font-medium text-shadow-accent ">
              {name}
            </span>
          </p>
          <div className="w-full text-sm flex items-center gap-4 text-neutral-500 px-8 pt-2 ">
            <p className=" flex items-center gap-1 ">
              <Inbox className=" w-4 h-4 shrink-0 " /> {formatSize(size!)}
            </p>
            <p className=" flex items-center gap-1 ">
              <Calendar className=" w-4 h-4 shrink-0 " />
              {formatDate(time!)}
            </p>
          </div>
        </div>
        <div className=" flex items-center gap-3 px-2">
          <a href={signedUrl}>
            <Button variant="outline" className=" p-2 cursor-pointer">
              <Download /> Download
            </Button>
          </a>
          <Button
            disabled={isLoading}
            onClick={() => handleFileDelete( link || name!)}
            variant="destructive"
            className=" p-2 cursor-pointer"
          >
            {isLoading ? <Loader2Icon className=" animate-spin" /> : <Trash />}
          </Button>
        </div>
      </div>
    </div>
  );
}

function FolderComponent({ id, name }: { id: string; name?: string }) {
  const [objects, setObjects] = useState<ObjectsResponse | null>(null);
  const [s3Keys, setS3Keys] = useState({
    region: "",
    accessKeyId: "",
    secretAccessKey: "",
    bucketName: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchObjects = async () => {
      try {
        const region = localStorage.getItem("region");
        const accessKeyId = localStorage.getItem("accessKey");
        const secretAccessKey = localStorage.getItem("secrectAccessKey");
        const bucketName = localStorage.getItem("bucketName");
        if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
          return router.replace("/");
        }

        setS3Keys({ region, accessKeyId, secretAccessKey, bucketName });
        const res = await fetch(`/api/objects?prefix=${name}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            region: localStorage.getItem("region"),
            accessKeyId: localStorage.getItem("accessKey"),
            secretAccessKey: localStorage.getItem("secrectAccessKey"),
            bucketName: localStorage.getItem("bucketName"),
          }),
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setObjects(data);
      } catch (error) {
        console.error("Error fetching objects:", error);
      }
    };

    fetchObjects();
  }, []);

  const router = useRouter();

  const handleUploadWithSpecificFolder = async (foldername: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "*/*";

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      console.log("file:", file.name);

      try {
        setIsLoading(true);
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        const key = `${foldername}${file.name}`;

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
        console.log("✅ Uploaded:", uploadedUrl, "key:", key);
        router.refresh();
        alert("Upload successful!");
      } catch (err) {
        console.error("❌ Upload error:", err);
        alert("Upload failed.");
      } finally {
        setIsLoading(false);
      }
    };

    input.click();
  };

  return (
    <AccordionItem
      value={id}
      className=" border rounded-md transition-transform ease-in-out"
    >
      <div className="w-full flex items-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md overflow-hidden">
        <AccordionTrigger className="group cursor-pointer rounded-md p-1 w-full  ">
          <div className="h-10 px-4 w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChevronRight className="h-6 w-6 transition-transform duration-200 group-data-[state=open]:rotate-90" />
              <Folder className=" w-7 h-7 shrink-0 text-blue-400 " />
              <span className="text-primary truncate hover:underline font-medium text-shadow-accent">
                {name}
              </span>
              <p className="ml-3 flex items-center text-[12px] text-neutral-500 ">
                Total {objects?.files ? objects.files.length - 1 : 0} objects
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <Button
          disabled={isLoading}
          onClick={() => handleUploadWithSpecificFolder(name!)}
          variant="outline"
          className=" cursor-pointer mr-4 "
        >
          {isLoading ? (
            <Loader2Icon className=" animate-spin " />
          ) : (
            <>
              <Upload className=" h-4 w-4 shrink-0 " />
              <span>Upload</span>
            </>
          )}
        </Button>
        <Button
          disabled={isLoading}
          variant="destructive"
          className=" p-2 mr-2 cursor-pointer"
        >
          <Trash />
        </Button>
      </div>
      {objects?.files
        ?.filter((file) => file.Key !== name)
        .filter(
          (file) => file.Key && file.LastModified && file.Size !== undefined
        )
        .sort(
          (a, b) =>
            new Date(b.LastModified!).getTime() -
            new Date(a.LastModified!).getTime()
        )
        .map((file, idx) => {
          const fileName = file.Key?.split("/").pop() ?? file.Key;
          return (
            <AccordionContent
              key={idx}
              className="px-6 py-1 rounded-md text-balance"
            >
              <FileComponent
                name={fileName}
                link={file.Key}
                size={file.Size}
                time={file.LastModified}
              />
            </AccordionContent>
          );
        })}
    </AccordionItem>
  );
}
