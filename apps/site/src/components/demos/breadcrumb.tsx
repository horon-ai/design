import { Breadcrumb, BreadcrumbItem } from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

export default function BreadcrumbDemo() {
  return (
    <div className="flex flex-col items-start gap-6">
      <Breadcrumb>
        <BreadcrumbItem href="#" tile="H">
          Horon HQ
        </BreadcrumbItem>
        <BreadcrumbItem href="#">Q4 hiring</BreadcrumbItem>
        <BreadcrumbItem current>Chief of staff</BreadcrumbItem>
      </Breadcrumb>
      <Backdrop>
        <Breadcrumb surface="glass">
          <BreadcrumbItem href="#" tile="H">
            Horon HQ
          </BreadcrumbItem>
          <BreadcrumbItem current>Q4 hiring</BreadcrumbItem>
        </Breadcrumb>
      </Backdrop>
    </div>
  );
}
