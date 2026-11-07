import { Breadcrumb, BreadcrumbItem } from "@horon-ai/react";

export default function BreadcrumbThumbnail() {
  return (
    <Breadcrumb surface="solid">
      <BreadcrumbItem href="#" tile="H">
        Horon HQ
      </BreadcrumbItem>
      <BreadcrumbItem href="#">Hiring</BreadcrumbItem>
      <BreadcrumbItem current>Support bot</BreadcrumbItem>
    </Breadcrumb>
  );
}
