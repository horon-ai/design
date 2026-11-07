import { IconButton } from "../../src/components/icon-button";
import { Icon } from "../../src/icons";
import { Backdrop } from "./backdrop";

/** Three footprints of one treatment, then the three glyphs a toolbar carries. */
function Examples({ variant }: { variant: "solid" | "glass" }) {
  return (
    <view className="flex w-full flex-col items-center gap-3">
      <view className="flex flex-row flex-wrap items-center justify-center gap-3">
        <IconButton size="sm" variant={variant} icon={<Icon name="Plus" />} label="Add small" />
        <IconButton variant={variant} icon={<Icon name="Plus" />} label="Add" />
        <IconButton size="lg" variant={variant} icon={<Icon name="Plus" />} label="Add large" />
      </view>
      <view className="flex flex-row flex-wrap items-center justify-center gap-3">
        <IconButton icon={<Icon name="Plus" />} label="Add" variant="primary" />
        <IconButton icon={<Icon name="DotsThree" />} label="More" />
        <IconButton icon={<Icon name="MagnifyingGlass" />} label="Search" variant={variant} />
        <IconButton icon={<Icon name="MagnifyingGlass" />} label="Search quiet" variant="quiet" />
        <IconButton icon={<Icon name="Plus" />} label="Disabled" disabled />
      </view>
    </view>
  );
}

/**
 * The IconButton gallery: the solid and glass treatments over three footprints,
 * the primary and quiet variants, and a disabled disc. Glass sits on the sky so
 * its material is visible.
 */
export default function IconButtonDemo() {
  return (
    <view className="flex w-full flex-col gap-6 p-4">
      <view className="flex flex-col gap-4">
        <text className="text-caption text-text-secondary">Solid</text>
        <Examples variant="solid" />
      </view>
      <view className="flex flex-col gap-4">
        <text className="text-caption text-text-secondary">Glass</text>
        <Backdrop>
          <Examples variant="glass" />
        </Backdrop>
      </view>
    </view>
  );
}
