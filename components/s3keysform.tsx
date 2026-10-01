"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  detectProvider,
  getProviderInfo,
  saveStorageConfigToLocalStorage,
} from "@/utils/storageConfig";

const formSchema = z.object({
  bucketName: z.string().nonempty({ message: "Bucket Name is required." }),
  accessKey: z.string().nonempty({ message: "ACCESS KEY is required." }),
  secrectAccessKey: z
    .string()
    .nonempty({ message: "SECRECT ACCESS KEY is required." }),
  region: z.string().nonempty({ message: "REGION is required." }),
  endpoint: z.string().optional(),
});

export default function S3KeysForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bucketName: "",
      accessKey: "",
      secrectAccessKey: "",
      region: "",
      endpoint: "",
    },
  });

  const router = useRouter();
  const endpointValue = form.watch("endpoint");
  const detectedProvider = detectProvider({
    region: form.watch("region") || "",
    accessKeyId: form.watch("accessKey") || "",
    secretAccessKey: form.watch("secrectAccessKey") || "",
    bucketName: form.watch("bucketName") || "",
    endpoint: endpointValue,
  });
  const providerInfo = getProviderInfo(detectedProvider);

  function onSubmit(values: z.infer<typeof formSchema>) {
    saveStorageConfigToLocalStorage({
      bucketName: values.bucketName,
      accessKeyId: values.accessKey,
      secretAccessKey: values.secrectAccessKey,
      region: values.region,
      endpoint: values.endpoint?.trim() || undefined,
    });
    router.push("/s3");
  }

  return (
    <div className="bg-neutral-50/20 dark:bg-neutral-950/50 border px-10 pb-4 pt-2 rounded-md mt-10 flex flex-col gap-4 justify-center items-center">
      <h1>Welcome to S3 UI</h1>
      <p className="text-sm text-neutral-500 text-center max-w-md">
        Connect to AWS S3, MinIO, Cloudflare R2, Supabase, or any S3-compatible
        storage.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full"
        >
          <FormField
            control={form.control}
            name="bucketName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bucket Name</FormLabel>
                <FormControl>
                  <Input placeholder="your bucket name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="accessKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ACCESS KEY</FormLabel>
                <FormControl>
                  <Input placeholder="your access key" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="secrectAccessKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SECRECT ACCESS KEY</FormLabel>
                <FormControl>
                  <Input placeholder="your secret access key" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>REGION</FormLabel>
                <FormControl>
                  <Input placeholder="eu-north-1 or auto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endpoint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endpoint URL (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="http://localhost:9000 (MinIO) or leave empty for AWS S3"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Required for MinIO, Cloudflare R2, Supabase. Leave empty for
                  AWS S3.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {endpointValue?.trim() && (
            <p className="text-sm text-neutral-500">
              Detected provider:{" "}
              <span
                className="font-medium"
                style={{ color: providerInfo.color }}
              >
                {providerInfo.name}
              </span>
            </p>
          )}

          <Button type="submit">Continue</Button>
        </form>
        <FormDescription>
          Where To Get These things?{" "}
          <Link href={"#demo"} className="hover:text-blue-500 hover:underline">
            See Demo
          </Link>{" "}
        </FormDescription>
      </Form>
    </div>
  );
}
