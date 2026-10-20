import { GlassSurface, LiquidGlass } from "@horon-ai/react";

export default function GlassDemo() {
  return (
    <div className="relative min-h-[240px] w-full overflow-hidden rounded-lg p-6">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#fdf7ea_0%,#e7c9a0_35%,#7f8fb0_70%,#2b2f36_100%)]" />
      <div className="relative flex flex-col gap-4">
        <GlassSurface className="w-full max-w-sm">
          <p className="text-sm font-semibold">유리 패널</p>
          <p className="mt-1 text-xs">배경이 비쳐 보이는 반투명 표면입니다.</p>
        </GlassSurface>
        <LiquidGlass className="flex h-11 w-full max-w-sm items-center gap-3 rounded-full px-4 text-sm">
          <span className="font-semibold">HORON</span>
          <span className="text-muted-foreground">제품</span>
          <span className="text-muted-foreground">문서</span>
        </LiquidGlass>
      </div>
    </div>
  );
}
