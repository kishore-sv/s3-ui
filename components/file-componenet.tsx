"use client";
import { getS3Client } from "@/utils/s3Client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import {
  Calendar,
  Download,
  File,
  Inbox,
  Loader2Icon,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";

export default function FileComponent({
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

  const [bucketNameForDownload, setbucketNameForDownload] =
    useState<string>("");
  useEffect(() => {
    const bucketName = localStorage.getItem("bucketName");
    setbucketNameForDownload(bucketName!);
  }, []);

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
      toast(`File: ${fileKey} deleted successfully.`);
      router.refresh();
    } catch (err) {
      console.error("❌ Failed to delete file:", err);
      toast.error("Failed to delete file.");
    } finally {
      setIsLoading(false);
    }
  };

  const signedUrl = `https://${bucketNameForDownload}.s3.eu-north-1.amazonaws.com/${
    link || name
  }`;

  return (
    <div className="border rounded-md my-2 lg:px-4 py-2 text-balance hover:bg-neutral-100 dark:hover:bg-neutral-800">
      <div className=" w-full flex justify-between items-center ">
        <div className=" w-[70%] ">
          <p
            title={name}
            className="px-2 w-full overflow-hidden flex items-center gap-2 "
          >
            <File className="w-5 h-5 shrink-0 text-neutral-700 dark:text-neutral-200" />{" "}
            <span className=" text-primary truncate font-medium text-shadow-accent ">
              {name}
            </span>
          </p>
          <div className="w-full text-sm flex items-center gap-4 text-neutral-500 lg:px-8 pt-2 ">
            <p className=" flex items-center gap-1 ">
              <Inbox className=" w-4 h-4 shrink-0 " /> {formatSize(size!)}
            </p>
            <p className=" flex items-center gap-1 ">
              <Calendar className=" w-4 h-4 shrink-0 " />
              {formatDate(time!)}
            </p>
            <ImageWithLoader signedUrl={signedUrl} />
          </div>
        </div>
        <div className=" flex flex-col lg:flex-row items-center gap-3 px-2">
          <a href={signedUrl}>
            <Button
              variant="outline"
              className="lg:p-2 scale-[.9] lg:scale-[1] cursor-pointer"
            >
              <Download /> Download
            </Button>
          </a>
          <Button
            disabled={isLoading}
            onClick={() => handleFileDelete(link || name!)}
            variant="destructive"
            className=" lg:p-2 scale-[.9] lg:scale-[1] cursor-pointer"
          >
            {isLoading ? <Loader2Icon className=" animate-spin" /> : <Trash />}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ImageWithLoader({ signedUrl }: { signedUrl: string }) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="w-10 h-10 shrink-0 mx-auto relative bg-neutral-100 dark:bg-neutral-900 ">
      {loading && (
        <div className="absolute inset-0 flex rounded items-center justify-center bg-neutral-200 dark:bg-neutral-800 animate-pulse z-10" />
      )}
      <img
        src={signedUrl}
        alt="img"
        className="w-full h-full rounded object-cover transition-opacity duration-300"
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
        style={{ opacity: loading ? 0 : 1 }}
      />
    </div>
  );
}
