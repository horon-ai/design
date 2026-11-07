import { Breadcrumb, BreadcrumbItem } from "@horon-ai/react";

export default function BreadcrumbTrail() {
  return (
    <div className="w-full max-w-72">
      <Breadcrumb surface="solid">
        <BreadcrumbItem href="#" tile="H">
          Horon HQ
        </BreadcrumbItem>
        <BreadcrumbItem href="#">Projects</BreadcrumbItem>
        <BreadcrumbItem href="#">Q4 hiring</BreadcrumbItem>
        <BreadcrumbItem href="#">Interview notes</BreadcrumbItem>
        <BreadcrumbItem current>Chief of staff</BreadcrumbItem>
      </Breadcrumb>
    </div>
  );
}
