import { Breadcrumb, BreadcrumbItem } from "@horon-ai/react";

import { Backdrop } from "../../demo-backdrop";

export default function BreadcrumbSurfaces() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Breadcrumb surface="solid">
        <BreadcrumbItem href="#" tile="H">
          Horon HQ
        </BreadcrumbItem>
        <BreadcrumbItem href="#">Q4 hiring</BreadcrumbItem>
        <BreadcrumbItem current>Chief of staff</BreadcrumbItem>
      </Breadcrumb>
      <Backdrop className="flex-col">
        <Breadcrumb surface="glass">
          <BreadcrumbItem href="#" tile="H">
            Horon HQ
          </BreadcrumbItem>
          <BreadcrumbItem href="#">Q4 hiring</BreadcrumbItem>
          <BreadcrumbItem current>Chief of staff</BreadcrumbItem>
        </Breadcrumb>
      </Backdrop>
    </div>
  );
}
