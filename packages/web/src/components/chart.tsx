"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "cn";

const THEMES = { light: "", dark: ".dark" } as const;

const isTheme = (value: string): value is keyof typeof THEMES => value in THEMES;

/**
 * A style block of CSS custom properties. React's `CSSProperties` has no index
 * signature for `--*` keys, so custom-property blocks get their own type before
 * they reach a `style` prop.
 */
type CssVars = Record<`--${string}`, string | number | undefined>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** `fill` off a tooltip payload item, whose recharts type is `any`. */
function getPayloadFill(payload: unknown): string | undefined {
  if (!isRecord(payload) || !("fill" in payload)) {
    return undefined;
  }
  const fill: unknown = payload.fill;
  return typeof fill === "string" ? fill : undefined;
}

type ChartColorConfig =
  { color?: string; theme?: never } | { color?: never; theme: Record<keyof typeof THEMES, string> };

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  } & ChartColorConfig
>;

type ChartContextValue = { config: ChartConfig };

const ChartContext = React.createContext<ChartContextValue | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (context === null) {
    throw new Error("useChart must be used within a <ChartContainer />.");
  }

  return context;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ReactNode;
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`;
  const contextValue = React.useMemo(() => ({ config }), [config]);

  return (
    <ChartContext.Provider value={contextValue}>
      <div
        data-chart={chartId}
        data-slot="chart"
        className={cn(
          "flex aspect-video w-full justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid-line]:stroke-border [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-reference-line_]:stroke-border [&_.recharts-tooltip-cursor]:fill-muted/50",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(([, itemConfig]) => itemConfig.theme ?? itemConfig.color);

  if (colorConfig.length === 0) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const themeColor = isTheme(theme) ? itemConfig.theme?.[theme] : undefined;
    const color = themeColor ?? itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join("\n")}
}`,
          )
          .join("\n"),
      }}
    />
  );
}

function ChartTooltip({ content, ...props }: React.ComponentProps<typeof RechartsPrimitive.Tooltip>) {
  return (
    <RechartsPrimitive.Tooltip data-slot="chart-tooltip" content={content ?? <ChartTooltipContent />} {...props} />
  );
}

type ChartTooltipContentProps = Partial<RechartsPrimitive.TooltipContentProps> &
  React.ComponentProps<"div"> & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: "line" | "dot" | "dashed";
    nameKey?: string;
    labelKey?: string;
    color?: string;
  };

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: ChartTooltipContentProps) {
  const { config } = useChart();

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null;
    }

    const item = payload[0];
    const key = String(labelKey ?? item?.dataKey ?? item?.name ?? "value");
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value = !labelKey && typeof label === "string" ? (config[label]?.label ?? label) : itemConfig?.label;

    if (labelFormatter) {
      return (
        <div data-slot="chart-tooltip-label-formatted" className={cn("font-medium", labelClassName)}>
          {labelFormatter(value, payload)}
        </div>
      );
    }

    if (!value) {
      return null;
    }

    return (
      <div data-slot="chart-tooltip-label-value" className={cn("font-medium", labelClassName)}>
        {value}
      </div>
    );
  }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

  if (!active || !payload?.length) {
    return null;
  }

  const items = payload;
  const nestLabel = items.length === 1 && indicator !== "dot";

  return (
    <div
      data-slot="chart-tooltip-content"
      className={cn(
        "glass-strong grid min-w-32 items-start gap-1.5 rounded-md px-2.5 py-1.5 text-xs shadow-md",
        className,
      )}
    >
      {nestLabel ? null : tooltipLabel}
      <div data-slot="chart-tooltip-items" className="grid gap-1.5">
        {items.map((item, index) => {
          const key = String(nameKey ?? item.name ?? item.dataKey ?? "value");
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          const payloadFill = getPayloadFill(item.payload);
          const indicatorColor = color ?? payloadFill ?? item.color;

          return (
            <div
              data-slot="chart-tooltip-item"
              key={key}
              className={cn(
                "flex w-full flex-wrap items-stretch gap-2 [&>svg]:size-2.5 [&>svg]:text-muted-foreground",
                indicator === "dot" && "items-center",
              )}
            >
              {formatter && item.value !== undefined && item.name !== undefined ? (
                formatter(item.value, item.name, item, index, items)
              ) : (
                <>
                  {itemConfig?.icon ? (
                    <itemConfig.icon />
                  ) : (
                    !hideIndicator && (
                      <div
                        data-slot="chart-tooltip-indicator"
                        className={cn(
                          "shrink-0 rounded-xs border-(--color-border) bg-(--color-bg)",
                          indicator === "dot" && "size-2.5",
                          indicator === "line" && "w-1",
                          indicator === "dashed" && "w-0 border-[1.5px] border-dashed bg-transparent",
                          nestLabel && indicator === "dashed" && "my-0.5",
                        )}
                        style={
                          {
                            "--color-bg": indicatorColor,
                            "--color-border": indicatorColor,
                          } as CssVars
                        }
                      />
                    )
                  )}
                  <div
                    data-slot="chart-tooltip-item-content"
                    className={cn("flex flex-1 justify-between leading-none", nestLabel ? "items-end" : "items-center")}
                  >
                    <div data-slot="chart-tooltip-item-label" className="grid gap-1.5">
                      {nestLabel ? tooltipLabel : null}
                      <span data-slot="chart-tooltip-item-name" className="text-muted-foreground">
                        {itemConfig?.label ?? item.name}
                      </span>
                    </div>
                    {item.value !== undefined ? (
                      <span data-slot="chart-tooltip-item-value" className="font-medium text-foreground tabular-nums">
                        {item.value.toLocaleString()}
                      </span>
                    ) : null}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChartLegend({ className, content, ...props }: RechartsPrimitive.LegendProps & { className?: string }) {
  return (
    <RechartsPrimitive.Legend
      data-slot="chart-legend"
      content={content ?? <ChartLegendContent className={className} />}
      {...props}
    />
  );
}

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: React.ComponentProps<"div"> & {
  payload?: ReadonlyArray<RechartsPrimitive.LegendPayload>;
  verticalAlign?: "top" | "bottom" | "middle";
  hideIcon?: boolean;
  nameKey?: string;
}) {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      data-slot="chart-legend-content"
      className={cn("flex items-center justify-center gap-4", verticalAlign === "top" ? "pb-3" : "pt-3", className)}
    >
      {payload.map((item) => {
        const key = String(nameKey ?? item.dataKey ?? "value");
        const itemConfig = getPayloadConfigFromPayload(config, item, key);

        return (
          <div
            data-slot="chart-legend-item"
            key={key}
            className="flex items-center gap-1.5 [&>svg]:size-3 [&>svg]:text-muted-foreground"
          >
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                data-slot="chart-legend-indicator"
                className="size-2 shrink-0 rounded-xs"
                style={{ backgroundColor: item.color }}
              />
            )}
            {itemConfig?.label}
          </div>
        );
      })}
    </div>
  );
}

function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
  if (!isRecord(payload)) {
    return undefined;
  }

  const nested = isRecord(payload.payload) ? payload.payload : undefined;

  let configLabelKey = key;

  if (typeof payload[key] === "string") {
    configLabelKey = payload[key];
  } else if (nested !== undefined && typeof nested[key] === "string") {
    configLabelKey = nested[key];
  }

  return configLabelKey in config ? config[configLabelKey] : config[key];
}

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent };

// Re-exported so consumers can compose charts without depending on recharts
// directly.
export { RechartsPrimitive };
