import { Breadcrumb, BreadcrumbItem } from "../../src/components/breadcrumb";
import { Backdrop } from "./backdrop";

/** A three-crumb trail and a two-crumb trail, sharing the tray surface. */
function Examples({ surface }: { surface: "solid" | "glass" }) {
  return (
    <view className="flex flex-row flex-wrap items-start justify-center gap-4">
      <Breadcrumb surface={surface}>
        <BreadcrumbItem href="/" tile="H">
          Horon HQ
        </BreadcrumbItem>
        <BreadcrumbItem href="/hiring">Q4 hiring</BreadcrumbItem>
        <BreadcrumbItem current>Chief of staff</BreadcrumbItem>
      </Breadcrumb>
      <Breadcrumb surface={surface}>
        <BreadcrumbItem href="/" tile="H">
          Horon HQ
        </BreadcrumbItem>
        <BreadcrumbItem current>Q4 hiring</BreadcrumbItem>
      </Breadcrumb>
    </view>
  );
}

/** Solid and glass trays, with the current crumb on the last position. */
export default function BreadcrumbDemo() {
  return (
    <view className="flex w-full flex-col gap-6 p-4">
      <view className="flex flex-col gap-4">
        <text className="text-caption text-text-secondary">Solid</text>
        <Examples surface="solid" />
      </view>
      <Backdrop className="flex-col">
        <text className="text-caption text-text-secondary">Glass</text>
        <Examples surface="glass" />
      </Backdrop>
    </view>
  );
}
