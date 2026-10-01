import { getS3Client } from "@/utils/s3Client";
import { type StorageConfig } from "@/utils/storageConfig";
import { parseStorageError } from "@/utils/storageErrors";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const {
      region,
      accessKeyId,
      secretAccessKey,
      bucketName,
      endpoint,
    }: StorageConfig = await request.json();

    const s3 = getS3Client({
      region,
      accessKeyId,
      secretAccessKey,
      bucketName,
      endpoint,
    });

    const prefix = request.nextUrl.searchParams.get("prefix") ?? undefined;

    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Delimiter: "/",
      Prefix: prefix,
    });

    const result = await s3.send(command);

    const rootFiles =
      result.Contents?.map((e) => ({
        Key: e.Key,
        Size: e.Size,
        LastModified: e.LastModified,
      })) || [];

    const rootFolders = result.CommonPrefixes?.map((e) => e.Prefix) || [];

    return NextResponse.json({ files: rootFiles, folders: rootFolders });
  } catch (error) {
    const parsed = parseStorageError(error);

    if (parsed.kind === "auth") {
      console.warn(`Storage auth failed [${parsed.code}]:`, parsed.message);
    } else {
      console.error("Error listing objects:", error);
    }

    return NextResponse.json(
      { error: parsed.message, code: parsed.code, kind: parsed.kind },
      { status: parsed.status }
    );
  }
}
