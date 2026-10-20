import { Kbd, KbdGroup } from "@horon/web";

export default function KbdDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Kbd>Esc</Kbd>
      <Kbd>Shift</Kbd>
      <Kbd>Enter</Kbd>
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>S</Kbd>
      </KbdGroup>
    </div>
  );
}
