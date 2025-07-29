"use client";
import { ModeToggle } from "@/components/toggle-theme-button";
import Link from "next/link";
import S3KeysForm from "@/components/s3keysform";

export default function Home() {

  return (
    <div className="w-full relative">
      <nav className=" w-full h-18 fixed top-0 flex justify-between items-center px-20 py-2 bg-neutral-50/80 border-b dark:bg-neutral-950/80 backdrop-blur-md ">
        <div className=" w-50 h-full flex items-center ">
          <Link href="/">
            <h1 className="text-3xl font-bold ">S3-UI</h1>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
        </div>
      </nav>

      <section className=" w-full h-screen ">
        <div className="w-full h-full flex justify-center items-center ">
          <S3KeysForm />
        </div>
      </section>

      <div className=" w-full h-screen bg-red-500  ">

      </div>
    </div>
  );
}
