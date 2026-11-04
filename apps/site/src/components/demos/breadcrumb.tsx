import { Breadcrumb, BreadcrumbItem } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

function Examples({ surface }: { surface: "solid" | "glass" }) {
  return (
    <div className="flex flex-wrap items-start justify-center gap-4">
      <Breadcrumb surface={surface}>
        <BreadcrumbItem href="#" tile="H">
          Horon HQ
        </BreadcrumbItem>
        <BreadcrumbItem href="#">Q4 hiring</BreadcrumbItem>
        <BreadcrumbItem current>Chief of staff</BreadcrumbItem>
      </Breadcrumb>
      <Breadcrumb surface={surface}>
        <BreadcrumbItem href="#" tile="H">
          Horon HQ
        </BreadcrumbItem>
        <BreadcrumbItem current>Q4 hiring</BreadcrumbItem>
      </Breadcrumb>
    </div>
  );
}

export default function BreadcrumbDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4">
        <p className="text-caption text-text-secondary">Solid</p>
        <Examples surface="solid" />
      </div>
      <Backdrop className="flex-col">
        <p className="text-caption text-text-secondary">Glass</p>
        <Examples surface="glass" />
      </Backdrop>
    </div>
  );
}
