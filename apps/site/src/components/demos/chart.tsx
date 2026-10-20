import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  RechartsPrimitive,
  type ChartConfig,
} from "@horon-ai/react/components/chart";

const data = [
  { month: "1월", visits: 320 },
  { month: "2월", visits: 410 },
  { month: "3월", visits: 365 },
  { month: "4월", visits: 520 },
  { month: "5월", visits: 480 },
];

const config = {
  visits: { label: "방문", color: "var(--chart-1)" },
} satisfies ChartConfig;

export default function ChartDemo() {
  return (
    <ChartContainer config={config} className="h-[220px] w-full max-w-[420px]">
      <RechartsPrimitive.BarChart accessibilityLayer data={data}>
        <RechartsPrimitive.CartesianGrid vertical={false} />
        <RechartsPrimitive.XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <RechartsPrimitive.Bar dataKey="visits" fill="var(--color-visits)" radius={4} />
      </RechartsPrimitive.BarChart>
    </ChartContainer>
  );
}
