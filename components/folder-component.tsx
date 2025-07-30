"use client";
import { getS3Client } from "@/utils/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { ChevronRight, Folder, Loader2Icon, Trash, Upload } from "lucide-react";
import { Button } from "./ui/button";
import FileComponent from "./file-componenet";
import { ObjectsResponse } from "@/app/s3/page";
import { deleteFolder } from "@/utils/deleteFolder";
import { toast } from "sonner";


export type S3KeysType={
  region:string;
  accessKeyId:string;
  secretAccessKey:string;
  bucketName:string;
}

export default function FolderComponent({
  id,
  name,
}: {
  id: string;
  name?: string;
}) {
  const [objects, setObjects] = useState<ObjectsResponse | null>(null);
  const [s3Keys, setS3Keys] = useState({
    region: "",
    accessKeyId: "",
    secretAccessKey: "",
    bucketName: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingFolderDelete, setIsLoadingFolderDelete] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchObjects = async () => {
      try {
        setIsLoading(true);
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
        toast.error(`Error fetching objects:${error}`)
      } finally {
        setIsLoading(false);
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
        toast(`File: ${key} Uploaded successfully.`);
      } catch (err) {
        console.error("❌ Upload error:", err);
        toast.error('Upload failed.')
      } finally {
        setIsLoading(false);
      }
    };

    input.click();
  };

  const handleDeleteFolder = async (folderName: string, s3Keys: S3KeysType) => {
    try {
      setIsLoadingFolderDelete(true);
      await deleteFolder(folderName!, s3Keys);
      toast(`Folder: ${folderName} DELETED successfully.`);
    } catch (error) {
      console.log(error);
      toast.error(`Somthing went wrong: ${error}`)
    } finally {
      setIsLoadingFolderDelete(false);
    }
  };

  const filteredFiles =
    objects?.files?.filter((file) => file.Key !== name) ?? [];

  return (
    <AccordionItem value={id} className="border rounded-md ">
      <div className="w-full flex justify-between items-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md ">
        <AccordionTrigger className="group cursor-pointer rounded-md p-1 w-full  ">
          <div className="h-10 px-4 w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChevronRight className="h-6 w-6 transition-transform duration-200 group-data-[state=open]:rotate-90" />
              <Folder className=" w-7 h-7 shrink-0 text-blue-400 " />
              <span
                title={name}
                className="text-primary truncate hover:underline font-medium text-shadow-accent"
              >
                 {name?.split("/").filter(Boolean).pop()}
              </span>
              <p className="ml-3 flex items-center text-[12px] text-neutral-500 ">
                {isLoading ? (
                  <span className="w-18 h-4 rounded bg-neutral-200 animate-pulse " />
                ) : (
                  <span>
                    Total {objects?.files ? objects.files.length - 1 : 0}{" "}
                    objects
                  </span>
                )}
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <Button
          disabled={isLoading}
          onClick={() => handleUploadWithSpecificFolder(name!)}
          variant="outline"
          className="cursor-pointer lg:ml-[13rem]"
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
          onClick={() => handleDeleteFolder(name!, s3Keys)}
          disabled={isLoadingFolderDelete}
          variant="destructive"
          className=" p-2 mr-2 cursor-pointer"
        >
          {isLoadingFolderDelete ? (
            <Loader2Icon className=" animate-spin " />
          ) : (
            <Trash />
          )}
        </Button>
      </div>

      <AccordionContent className="px-6 py-1 rounded-md text-balance">
        {(objects?.folders ?? []).length > 0 ?(
          <>
            <p className="text-sm font-semibold mb-1">Folders</p>
            {(objects?.folders ?? []).map((folder, idx) => (
              <FolderComponent key={idx} id={folder} name={folder} />
            ))}
          </>
        ) : (
          <p className="text-muted-foreground text-sm">No Objects Found</p>
        )}

        {filteredFiles.length > 0 ? (
          <>
            <p className="text-sm font-semibold mt-3 mb-1">Files</p>
            {filteredFiles.map((file, idx) => {
              const fileName = file.Key?.split("/").pop() ?? file.Key;
              return (
                <FileComponent
                  key={idx}
                  name={fileName}
                  link={file.Key}
                  size={file.Size}
                  time={file.LastModified}
                />
              );
            })}
          </>
        ) : null}
      </AccordionContent>
    </AccordionItem>
  );
}






{
  /* {(() => {
        const filteredFiles =
          objects?.files
            ?.filter((file) => file.Key !== name)
            .filter(
              (file) => file.Key && file.LastModified && file.Size !== undefined
            )
            .sort(
              (a, b) =>
                new Date(b.LastModified!).getTime() -
                new Date(a.LastModified!).getTime()
            ) || [];

        if (filteredFiles.length === 0 && objects?.folders.length ===0 ) {
            console.log(objects.folders)
          return (
            <p className="px-6 py-2 text-sm text-muted-foreground">
              No objects found.
            </p>
          );
        }

        return filteredFiles.map((file, idx) => {
          const fileName = file.Key?.split("/").pop() ?? file.Key;
          return (
            <AccordionContent
              key={idx}
              className="px-6 py-1 rounded-md text-balance"
            >
              Files
              <FileComponent
                name={fileName}
                link={file.Key}
                size={file.Size}
                time={file.LastModified}
              />
              Folders
              {objects?.folders.length === 0 ? (
                <p className="text-center">No Folders Found</p>
              ) : (
                objects?.folders.map((folder, idx) => (
                  <FolderComponent key={idx} id={folder} name={folder}  />
                ))
              )}
            </AccordionContent>
          );
        });
      })()} */
}
