import { Breadcrumb, BreadcrumbItem } from "@horon-ai/react";

export default function BreadcrumbDemo() {
  return (
    <Breadcrumb>
      <BreadcrumbItem href="#" tile="H">
        Horon HQ
      </BreadcrumbItem>
      <BreadcrumbItem href="#">Q4 hiring</BreadcrumbItem>
      <BreadcrumbItem current>Chief of staff</BreadcrumbItem>
    </Breadcrumb>
  );
}
