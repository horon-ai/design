import { spacing } from "@horon-ai/tokens";
import { useContext, useState, type ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { Button, type ButtonVariant } from "../../../components/button";
import { Checkbox } from "../../../components/checkbox";
import { Chip } from "../../../components/chip";
import { DateField } from "../../../components/date-field";
import { Field, FieldError, FieldLabel } from "../../../components/field";
import { Input } from "../../../components/input";
import { Radio, RadioGroup } from "../../../components/radio-group";
import { Slider } from "../../../components/slider";
import { Textarea } from "../../../components/textarea";
import { readAccessibility } from "../../runtime/accessibility";
import type { A2uiChildRef, NativeA2uiComponentProps } from "../../runtime/types";
import { ModalTriggerContext } from "./layout";
import { ContentToneContext, finite, text, type ContentTone } from "./shared";

/**
 * Resolved props of an input: the bound `value` with the setter the binder adds for it (absent when
 * the payload gave a literal), plus the results of its checks.
 */
type InputProps<V> = {
  label?: unknown;
  value?: unknown;
  setValue?: (value: V) => void;
  validationErrors?: unknown;
  accessibility?: unknown;
};

function errorsOf(props: { validationErrors?: unknown }): string[] {
  return Array.isArray(props.validationErrors)
    ? props.validationErrors.filter((error): error is string => typeof error === "string" && error.length > 0)
    : [];
}

/**
 * Label, control and validation messages in a Horon `Field`. Messages show once the user has
 * changed the value, so an empty form does not open in red.
 */
function A2uiField({
  label,
  errors,
  touched,
  children,
}: {
  label: string;
  errors: string[];
  touched: boolean;
  children: ReactNode;
}) {
  const invalid = touched && errors.length > 0;
  return (
    <Field invalid={invalid} accessibilityLabel={label || undefined}>
      {label ? <FieldLabel>{label}</FieldLabel> : null}
      {children}
      {invalid ? errors.map((error) => <FieldError key={error}>{error}</FieldError>) : null}
    </Field>
  );
}

const BUTTON: Record<string, { variant: ButtonVariant; tone: ContentTone }> = {
  default: { variant: "solid", tone: { variant: "label-lg", tone: "text-primary" } },
  primary: { variant: "primary", tone: { variant: "label-lg", tone: "interactive-on-primary" } },
  borderless: { variant: "link", tone: { variant: "label-sm", tone: "text-secondary" } },
};

type ButtonProps = {
  variant?: unknown;
  child?: A2uiChildRef;
  action?: () => void | Promise<void>;
  isValid?: boolean;
  accessibility?: unknown;
};

const DEFAULT_BUTTON = { variant: "solid", tone: { variant: "label-lg", tone: "text-primary" } } as const;

/** `Button`: a Horon button labelled by its child; a failing check disables it. */
export function A2uiButton({ props, buildChild }: NativeA2uiComponentProps<ButtonProps>) {
  const openModal = useContext(ModalTriggerContext);
  const paint = BUTTON[text(props.variant, "default")] ?? DEFAULT_BUTTON;
  const { action, child } = props;
  return (
    <ContentToneContext.Provider value={paint.tone}>
      <Button
        variant={paint.variant}
        disabled={props.isValid === false}
        accessibilityLabel={readAccessibility(props).label}
        accessibilityHint={readAccessibility(props).description}
        onPress={() => {
          openModal?.();
          void action?.();
        }}
      >
        {child ? buildChild(child) : null}
      </Button>
    </ContentToneContext.Provider>
  );
}

/** `TextField`: a Horon input, a textarea for `longText`, numeric or hidden for its variants. */
export function A2uiTextField({
  props,
}: NativeA2uiComponentProps<InputProps<string> & { placeholder?: unknown; variant?: unknown }>) {
  const [touched, setTouched] = useState(false);
  const label = text(props.label);
  const { setValue } = props;
  const onChange = (next: string) => {
    setTouched(true);
    setValue?.(next);
  };
  const common = {
    value: text(props.value),
    placeholder: text(props.placeholder) || undefined,
    readOnly: !setValue,
    accessibilityLabel: readAccessibility(props).label ?? (label || undefined),
    onChange,
  };
  return (
    <A2uiField label={label} errors={errorsOf(props)} touched={touched}>
      {props.variant === "longText" ? (
        <Textarea {...common} />
      ) : (
        <Input
          {...common}
          type={props.variant === "number" ? "number" : props.variant === "obscured" ? "password" : "text"}
        />
      )}
    </A2uiField>
  );
}

/** `CheckBox`: a Horon checkbox bound to a boolean. */
export function A2uiCheckBox({ props }: NativeA2uiComponentProps<InputProps<boolean>>) {
  const [touched, setTouched] = useState(false);
  const { setValue } = props;
  return (
    <A2uiField label="" errors={errorsOf(props)} touched={touched}>
      <Checkbox
        checked={props.value === true}
        readOnly={!setValue}
        label={text(props.label)}
        accessibilityLabel={readAccessibility(props).label}
        onCheckedChange={(checked) => {
          setTouched(true);
          setValue?.(checked);
        }}
      />
    </A2uiField>
  );
}

type Option = { label: string; value: string };

function optionsOf(value: unknown): Option[] {
  if (!Array.isArray(value)) return [];
  const options: Option[] = [];
  for (const item of value) {
    if (typeof item === "object" && item !== null && "value" in item && typeof item.value === "string") {
      options.push({ label: "label" in item ? text(item.label, item.value) : item.value, value: item.value });
    }
  }
  return options;
}

/**
 * `ChoicePicker`: chips, radio buttons (one choice) or checkboxes (several), with an optional filter
 * field. The bound value is always a list of option values.
 */
export function A2uiChoicePicker({
  props,
}: NativeA2uiComponentProps<
  InputProps<string[]> & { options?: unknown; variant?: unknown; displayStyle?: unknown; filterable?: unknown }
>) {
  const [touched, setTouched] = useState(false);
  const [filter, setFilter] = useState("");
  const options = optionsOf(props.options);
  const selected = Array.isArray(props.value)
    ? props.value.filter((item): item is string => typeof item === "string")
    : [];
  const single = props.variant !== "multipleSelection";
  const { setValue } = props;
  const choose = (value: string, on: boolean) => {
    setTouched(true);
    if (single) setValue?.(on ? [value] : []);
    else
      setValue?.(
        on ? [...selected.filter((item) => item !== value), value] : selected.filter((item) => item !== value),
      );
  };
  const query = filter.trim().toLowerCase();
  const visible = query ? options.filter((option) => option.label.toLowerCase().includes(query)) : options;
  const label = text(props.label);

  let control: ReactNode;
  if (props.displayStyle === "chips") {
    control = (
      <View style={styles.chips}>
        {visible.map((option) => (
          <Chip
            key={option.value}
            pressed={selected.includes(option.value)}
            onPressedChange={(on) => choose(option.value, on)}
          >
            {option.label}
          </Chip>
        ))}
      </View>
    );
  } else if (single) {
    control = (
      <RadioGroup
        value={selected[0]}
        readOnly={!setValue}
        accessibilityLabel={label || undefined}
        onValueChange={(value) => choose(value, true)}
      >
        {visible.map((option) => (
          <Radio key={option.value} value={option.value} label={option.label} />
        ))}
      </RadioGroup>
    );
  } else {
    control = (
      <View style={styles.stack}>
        {visible.map((option) => (
          <Checkbox
            key={option.value}
            label={option.label}
            checked={selected.includes(option.value)}
            readOnly={!setValue}
            onCheckedChange={(on) => choose(option.value, on)}
          />
        ))}
      </View>
    );
  }

  return (
    <A2uiField label={label} errors={errorsOf(props)} touched={touched}>
      <View style={styles.stack}>
        {props.filterable === true ? (
          <Input
            value={filter}
            onChange={setFilter}
            placeholder="Filter"
            accessibilityLabel={label ? `Filter ${label}` : "Filter"}
          />
        ) : null}
        {control}
      </View>
    </A2uiField>
  );
}

/** `Slider`: a Horon slider; `steps` divides the range into that many snapping intervals. */
export function A2uiSlider({
  props,
}: NativeA2uiComponentProps<InputProps<number> & { min?: unknown; max?: unknown; steps?: unknown }>) {
  const [touched, setTouched] = useState(false);
  const min = finite(props.min, 0);
  const max = finite(props.max, 100);
  const steps = typeof props.steps === "number" && props.steps >= 1 ? Math.floor(props.steps) : undefined;
  const label = text(props.label);
  const { setValue } = props;
  return (
    <A2uiField label={label} errors={errorsOf(props)} touched={touched}>
      <Slider
        value={finite(props.value, min)}
        min={min}
        max={max}
        step={steps ? (max - min) / steps : undefined}
        disabled={!setValue}
        accessibilityLabel={readAccessibility(props).label ?? (label || undefined)}
        onValueChange={(value) => {
          setTouched(true);
          setValue?.(value);
        }}
      />
    </A2uiField>
  );
}

const DATE = /^(\d{4})-(\d{2})-(\d{2})/;
const TIME = /(?:^|T)(\d{2}):(\d{2})/;

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/** The calendar day an ISO date or date-time string names, as a local date. */
function parseDay(value: string): Date | null {
  const match = DATE.exec(value);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDay(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * `DateTimeInput`: a Horon date field for the date and a 24-hour `HH:mm` field for the time. The
 * bound value is ISO 8601: `yyyy-MM-dd`, `HH:mm`, or `yyyy-MM-ddTHH:mm` when both are enabled.
 */
export function A2uiDateTimeInput({
  props,
}: NativeA2uiComponentProps<
  InputProps<string> & { enableDate?: unknown; enableTime?: unknown; min?: unknown; max?: unknown }
>) {
  const [touched, setTouched] = useState(false);
  const value = text(props.value);
  const enableTime = props.enableTime === true;
  const enableDate = props.enableDate === true || !enableTime;
  const day = parseDay(value);
  const timeMatch = TIME.exec(value);
  const time = timeMatch ? `${timeMatch[1]}:${timeMatch[2]}` : "";
  const [draftTime, setDraftTime] = useState(time);
  const minDay = parseDay(text(props.min));
  const maxDay = parseDay(text(props.max));
  const { setValue } = props;
  const label = text(props.label);

  const commit = (nextDay: Date | null, nextTime: string) => {
    setTouched(true);
    const datePart = enableDate && nextDay ? formatDay(nextDay) : "";
    if (enableDate && enableTime) setValue?.(datePart && nextTime ? `${datePart}T${nextTime}` : datePart);
    else setValue?.(enableDate ? datePart : nextTime);
  };

  return (
    <A2uiField label={label} errors={errorsOf(props)} touched={touched}>
      <View style={styles.row}>
        {enableDate ? (
          <DateField
            value={day}
            disabled={!setValue}
            isDateDisabled={(date) => Boolean((minDay && date < minDay) || (maxDay && date > maxDay))}
            onValueChange={(date) => commit(date, time)}
            style={styles.grow}
          />
        ) : null}
        {enableTime ? (
          <Input
            value={draftTime}
            placeholder="HH:mm"
            type="text"
            maxLength={5}
            readOnly={!setValue}
            accessibilityLabel={label ? `${label} time` : "Time"}
            onChange={(next) => {
              setDraftTime(next);
              if (/^([01]\d|2[0-3]):[0-5]\d$/.test(next)) commit(day, next);
            }}
            style={styles.time}
          />
        ) : null}
      </View>
    </A2uiField>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing["2"] },
  stack: { gap: spacing["2"] },
  row: { flexDirection: "row", gap: spacing["2"], alignItems: "center" },
  grow: { flex: 1 },
  time: { width: 96 },
});
