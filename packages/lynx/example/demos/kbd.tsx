import { Kbd } from "../../src/components/kbd";

/** Shortcut chips from `keys`, then the three rungs and two chips composed by hand. */
export default function KbdDemo() {
  return (
    <view className="flex w-full flex-col items-center gap-6 p-4">
      <view className="flex flex-row flex-wrap items-center justify-center gap-2">
        <Kbd keys="Mod" />
        <Kbd>K</Kbd>
        <Kbd keys="Escape" />
        <Kbd keys="Mod+Enter" />
      </view>
      <view className="flex flex-row flex-wrap items-center justify-center gap-2">
        <Kbd size="sm">K</Kbd>
        <Kbd size="md">K</Kbd>
        <Kbd size="lg">K</Kbd>
      </view>
      <view className="flex flex-row flex-wrap items-center justify-center gap-1">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </view>
    </view>
  );
}
