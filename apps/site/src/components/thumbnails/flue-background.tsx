import { HoronGlyph, HoronIcon, HoronWordmark, LiquidGlass } from "@horon-ai/react";

export default function FlueBackgroundThumbnail() {
  return (
    <div className="relative isolate h-[184px] w-[330px] overflow-hidden rounded-xl bg-[linear-gradient(196deg,var(--color-sky-100)_0%,var(--color-sky-200)_28%,var(--color-sky-400)_68%,var(--color-sky-600)_100%)] dark:bg-[linear-gradient(196deg,var(--color-neutral-950)_0%,var(--color-sky-800)_64%,var(--color-sky-600)_100%)]">
      <span
        aria-hidden
        className="absolute bottom-[-52px] left-[-30px] h-[170px] w-[250px] rounded-full bg-sky-200/80 blur-2xl dark:bg-sky-600/30"
      />
      <span
        aria-hidden
        className="absolute bottom-[-70px] left-[74px] h-[240px] w-[130px] rounded-full bg-sky-400/60 blur-2xl dark:bg-sky-500/35"
      />
      <span
        aria-hidden
        className="absolute bottom-[-30px] left-[150px] h-[150px] w-[70px] rounded-full bg-sky-500/25 blur-2xl dark:bg-sky-400/25"
      />

      <div className="relative m-3 flex h-[160px] w-[126px] flex-col gap-0.5 overflow-clip rounded-lg bg-glass-thick p-2">
        <LiquidGlass />
        <div className="relative flex items-center gap-1.5 px-1.5 py-1 text-text-primary">
          <HoronIcon size={13} />
          <HoronWordmark title="" aria-hidden height={7.5} />
        </div>
        <div className="relative mt-1 flex items-center gap-1.5 rounded-md bg-overlay-ink-6 px-1.5 py-1 text-label-sm text-text-primary">
          <HoronGlyph name="chat-circle" size={13} />
          Chats
        </div>
        <div className="relative flex items-center gap-1.5 px-1.5 py-1 text-label-sm text-text-secondary">
          <HoronGlyph name="bot" size={13} />
          Bots
        </div>
        <div className="relative flex items-center gap-1.5 px-1.5 py-1 text-label-sm text-text-secondary">
          <HoronGlyph name="plug" size={13} />
          Plugins
        </div>
      </div>
    </div>
  );
}
