import { GalleryVerticalEnd } from "lucide-react";

import { LoginForm } from "@/components/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-blue-50 dark:bg-gray-950">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <span className="hidden text-lg font-bold md:inline">SocioEco</span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full md:max-w-lg max-w-xs ">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/imageEnquete.jpg"
          alt="Image"
          fill
          sizes="100vw"
          priority
          quality={100}
          placeholder="blur"
          blurDataURL="/imageEnquete.jpg"
          loading="eager"
          unoptimized
          draggable={false}
          fetchPriority="high"
          style={{ objectFit: "cover" }}
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.5] dark:grayscale"
        />
      </div>
    </div>
  );
}
