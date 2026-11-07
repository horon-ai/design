import { HoronWordmark } from "../../src/components/horon-wordmark";

/**
 * The default 11.5px mark next to a 23px one, both in the primary text tint the site demo uses.
 */
export default function HoronWordmarkDemo() {
  return (
    <view className="flex flex-row items-end gap-6 p-4">
      <HoronWordmark />
      <HoronWordmark height={23} />
      <HoronWordmark height={23} color="text-secondary" />
    </view>
  );
}
