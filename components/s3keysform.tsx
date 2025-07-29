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

const formSchema = z.object({
  bucketName: z.string().nonempty({ message: "Bucket Name is required." }),
  accessKey: z.string().nonempty({ message: "ACCESS KEY is required." }),
  secrectAccessKey: z
    .string()
    .nonempty({ message: "SECRECT ACCESS KEY is required." }),
  region: z.string().nonempty({ message: "REGION is required." }),
});

export default function S3KeysForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bucketName: "",
      accessKey: "",
      secrectAccessKey: "",
      region: "",
    },
  });

  const router = useRouter();

  function onSubmit(values: z.infer<typeof formSchema>) {
    localStorage.setItem("bucketName", values.bucketName);
    localStorage.setItem("accessKey", values.accessKey);
    localStorage.setItem("secrectAccessKey", values.secrectAccessKey);
    localStorage.setItem("region", values.region);

    console.log("Saved to localStorage:", values);

    router.push("/s3");
  }
  return (
    <div className="bg-neutral-50/20 dark:bg-neutral-950/50 border px-10 pb-4 pt-2 rounded-md mt-10 flex flex-col gap-4 justify-center items-center">
      <h1>Welcome to S3 UI</h1>

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
                  <Input placeholder="your s3 bucket name" {...field} />
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
                  <Input placeholder="your s3 access key" {...field} />
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
                  <Input placeholder="your s3 secrect access key" {...field} />
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
                  <Input placeholder="eu-north-1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
