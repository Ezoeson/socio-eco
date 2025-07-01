"use client";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { ModeToggle } from "./toggle-theme";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

type WrapperProps = {
  children: React.ReactNode;
};

const Wrapper = ({ children }: WrapperProps) => {
  const path = usePathname();
  const name1 = path?.split("/").filter(Boolean)[0];
  const name2 = path?.split("/")?.filter(Boolean)[1];

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center  gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    {" "}
                    <span className="uppercase font-bold">
                      {name1 ? name1 : " Dashboard"}{" "}
                    </span>{" "}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  {name2 ? (
                    <BreadcrumbLink href="#">
                      {" "}
                      <span className="capitalize">{name2}</span>{" "}
                    </BreadcrumbLink>
                  ) : null}
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Separator
              orientation="vertical"
              className="ml-2 data-[orientation=vertical]:h-4"
            />
            <div className="absolute right-4 cursor-pointer">
              <ModeToggle />
            </div>
          </div>
        </header>
        <div className="my-16 mx-5">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Wrapper;
