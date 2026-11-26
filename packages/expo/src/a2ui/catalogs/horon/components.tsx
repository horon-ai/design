import { PlugsConnected } from "phosphor-react-native";
import { useState } from "react";

import { Badge, type BadgeSize, type BadgeTone } from "../../../components/badge";
import { Banner } from "../../../components/banner";
import { Button } from "../../../components/button";
import { Chip } from "../../../components/chip";
import { EmptyState } from "../../../components/empty-state";
import { IntegrationRow, type IntegrationStatus } from "../../../components/integration-row";
import { Progress } from "../../../components/progress";
import { useHoronTheme } from "../../../provider";
import { readAccessibility } from "../../runtime/accessibility";
import type { NativeA2uiComponentProps } from "../../runtime/types";
import { finite, text } from "../basic/shared";

/** A resolved `Action`: calling it dispatches the event to the agent. */
type Action = () => void | Promise<void>;

type Common = { accessibility?: unknown };

const SIZE: Record<string, BadgeSize> = { sm: "sm", md: "md", lg: "lg" };
const BADGE_TONE: Record<string, BadgeTone> = {
  neutral: "neutral",
  brand: "brand",
  danger: "danger",
  solid: "solid",
  surface: "surface",
};
const STATUS: Record<string, IntegrationStatus> = {
  connected: "connected",
  reconnect: "reconnect",
  "not-connected": "not-connected",
};

type BadgeProps = Common & { label?: unknown; tone?: unknown; size?: unknown; dot?: unknown };

/** `Badge`: a Horon badge. */
export function HoronBadge({ props }: NativeA2uiComponentProps<BadgeProps>) {
  return (
    <Badge
      tone={BADGE_TONE[text(props.tone)] ?? "neutral"}
      size={SIZE[text(props.size)] ?? "md"}
      dot={props.dot === true}
    >
      {text(props.label)}
    </Badge>
  );
}

type BannerProps = Common & {
  message?: unknown;
  tone?: unknown;
  surface?: unknown;
  actionLabel?: unknown;
  action?: Action;
};

/** `Banner`: a Horon banner, with a link button when it has an action label and an action. */
export function HoronBanner({ props }: NativeA2uiComponentProps<BannerProps>) {
  const { action } = props;
  const actionLabel = text(props.actionLabel);
  return (
    <Banner
      tone={props.tone === "danger" ? "danger" : "info"}
      surface={props.surface === "glass" ? "glass" : "solid"}
      action={
        action && actionLabel ? (
          <Button variant="link" onPress={() => void action()}>
            {actionLabel}
          </Button>
        ) : undefined
      }
    >
      {text(props.message)}
    </Banner>
  );
}

type ChipProps = Common & {
  label?: unknown;
  pressed?: unknown;
  setPressed?: (pressed: boolean) => void;
  disabled?: unknown;
  size?: unknown;
  action?: Action;
};

/**
 * `Chip`: a Horon toggle chip. A bound `pressed` writes the data model; an unbound one keeps its own
 * state from the payload's value. Every press also dispatches the action.
 */
export function HoronChip({ props }: NativeA2uiComponentProps<ChipProps>) {
  const { setPressed, action } = props;
  const [local, setLocal] = useState(props.pressed === true);
  return (
    <Chip
      pressed={setPressed ? props.pressed === true : local}
      disabled={props.disabled === true}
      size={SIZE[text(props.size)] ?? "md"}
      onPressedChange={(next) => {
        if (setPressed) setPressed(next);
        else setLocal(next);
        void action?.();
      }}
    >
      {text(props.label)}
    </Chip>
  );
}

type EmptyStateProps = Common & { title?: unknown; description?: unknown; actionLabel?: unknown; action?: Action };

/** `EmptyState`: a Horon empty state, with a glass button when it has an action label and an action. */
export function HoronEmptyState({ props }: NativeA2uiComponentProps<EmptyStateProps>) {
  const { action } = props;
  const actionLabel = text(props.actionLabel);
  return (
    <EmptyState
      title={text(props.title)}
      description={text(props.description) || undefined}
      action={
        action && actionLabel ? (
          <Button variant="glass" size="sm" onPress={() => void action()}>
            {actionLabel}
          </Button>
        ) : undefined
      }
    />
  );
}

type IntegrationRowProps = Common & {
  name?: unknown;
  detail?: unknown;
  status?: unknown;
  connectedLabel?: unknown;
  reconnectLabel?: unknown;
  connectLabel?: unknown;
  action?: Action;
};

/** `IntegrationRow`: a Horon integration row; its connect or reconnect button dispatches the action. */
export function HoronIntegrationRow({ props }: NativeA2uiComponentProps<IntegrationRowProps>) {
  const { color } = useHoronTheme();
  const { action } = props;
  return (
    <IntegrationRow
      icon={<PlugsConnected size={18} color={color("text-on-ink")} />}
      name={text(props.name)}
      detail={text(props.detail) || undefined}
      status={STATUS[text(props.status)] ?? "not-connected"}
      connectedLabel={text(props.connectedLabel) || undefined}
      reconnectLabel={text(props.reconnectLabel) || undefined}
      connectLabel={text(props.connectLabel) || undefined}
      onAction={action ? () => void action() : undefined}
    />
  );
}

type ProgressProps = Common & { value?: unknown; min?: unknown; max?: unknown };

/** `Progress`: a Horon progress bar; no value draws the indeterminate bar. */
export function HoronProgress({ props }: NativeA2uiComponentProps<ProgressProps>) {
  return (
    <Progress
      value={typeof props.value === "number" ? props.value : null}
      min={finite(props.min, 0)}
      max={finite(props.max, 100)}
      accessibilityLabel={readAccessibility(props).label}
    />
  );
}
