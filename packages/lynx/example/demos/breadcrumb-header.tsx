import { BreadcrumbHeader } from "../../src/components/breadcrumb-header";

import { Backdrop } from "./backdrop";

/** A three-crumb and a two-crumb pill, each with the search and more buttons. */
function Examples({ surface }: { surface: "solid" | "glass" }) {
  return (
    <view className="flex w-full flex-col items-center gap-3">
      <BreadcrumbHeader
        surface={surface}
        className="w-full max-w-[720px]"
        onSearch={() => undefined}
        onMore={() => undefined}
        crumbs={[
          { label: "Horon HQ", tile: "H", href: "/" },
          { label: "Q4 hiring", href: "/hiring" },
          { label: "Chief of staff" },
        ]}
      />
      <BreadcrumbHeader
        surface={surface}
        className="w-full max-w-[390px]"
        onSearch={() => undefined}
        onMore={() => undefined}
        crumbs={[{ label: "Horon HQ", tile: "H", href: "/" }, { label: "Settings" }]}
      />
    </view>
  );
}

/** Solid and glass pills over the page and over the backdrop. */
export default function BreadcrumbHeaderDemo() {
  return (
    <view className="flex w-full flex-col gap-6 p-4">
      <view className="flex w-full flex-col gap-4">
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
