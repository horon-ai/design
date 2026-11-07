import { Breadcrumb, BreadcrumbItem } from "@horon-ai/react";

export default function BreadcrumbTile() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Breadcrumb surface="solid">
        <BreadcrumbItem href="#" tile="H">
          Horon HQ
        </BreadcrumbItem>
        <BreadcrumbItem current>Q4 hiring</BreadcrumbItem>
      </Breadcrumb>
      <Breadcrumb surface="solid">
        <BreadcrumbItem href="#" tile="L">
          Horon Labs
        </BreadcrumbItem>
        <BreadcrumbItem href="#">Launch campaign</BreadcrumbItem>
        <BreadcrumbItem current>Press kit</BreadcrumbItem>
      </Breadcrumb>
    </div>
  );
}
