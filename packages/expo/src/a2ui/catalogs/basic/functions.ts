/**
 * The v1.0 basic catalog functions for React Native.
 *
 * `@a2ui/web_core` ships these only behind `@a2ui/web_core/catalogs/basic/v1`, whose module also
 * defines the Lit web components (`class extends HTMLElement`), which throws on Hermes. This module
 * ports the same behaviour (`src/common/basic_functions.js` of `@a2ui/web_core@0.16.1`,
 * Apache-2.0) over the DOM-free root entry, with one change: `openUrl` goes through React Native's
 * `Linking` instead of `window.open`.
 */
import {
  A2uiExpressionError,
  ExpressionParser,
  MAX_REGEX_VALUE_CODE_POINTS,
  analyzeRegex,
  computed,
  createFunctionImplementation,
  getValue,
  isSignal,
  type DataContext,
  type FunctionApi,
  type FunctionImplementation,
} from "@a2ui/web_core";
import { Linking } from "react-native";

type Args = Record<string, unknown>;
type Validation = { valid: boolean; message?: string; code?: string; severity?: string };

const DEFAULT_LOCALE = "en-US";

function resolveLocale(locale: string | undefined): string {
  if (!locale) return DEFAULT_LOCALE;
  try {
    return Intl.NumberFormat.supportedLocalesOf(locale).length > 0 ? locale : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

function coerceToString(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return value.toString();
  if (typeof value === "object" && value !== null) {
    try {
      return JSON.stringify(value) ?? "";
    } catch {
      return "";
    }
  }
  return "";
}

/** `DynamicBoolean` coercion: a `ValidationResult` reads as its `valid` member. */
function truthy(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return "valid" in value && typeof value.valid === "boolean" ? value.valid : false;
  }
  if (typeof value === "string") return value.toLowerCase() === "true";
  if (typeof value === "number") return value !== 0 && !Number.isNaN(value);
  return false;
}

function invalid(message: string): Validation {
  return { valid: false, message };
}

const regexCache = new Map<string, RegExp>();
const MAX_REGEX_CACHE = 256;

function compileRegex(pattern: string): RegExp {
  const cached = regexCache.get(pattern);
  if (cached) return cached;
  const analysis = analyzeRegex(pattern);
  if (!analysis.ok) {
    throw new A2uiExpressionError(`Invalid or unsafe regex pattern (${analysis.reason}): ${pattern}`, "regex");
  }
  let compiled: RegExp;
  try {
    compiled = new RegExp(pattern, "u");
  } catch (error) {
    throw new A2uiExpressionError(`Invalid regex pattern (UNSUPPORTED_SYNTAX): ${pattern}`, "regex", error);
  }
  if (regexCache.size >= MAX_REGEX_CACHE) {
    const oldest = regexCache.keys().next().value;
    if (oldest !== undefined) regexCache.delete(oldest);
  }
  regexCache.set(pattern, compiled);
  return compiled;
}

function validateLengthOrRange(measured: number, min: unknown, max: unknown, noun: "length" | "value"): Validation {
  const lower = typeof min === "number" && !Number.isNaN(min) ? min : undefined;
  const upper = typeof max === "number" && !Number.isNaN(max) ? max : undefined;
  const label = noun === "length" ? "length" : "value";
  if (lower !== undefined && measured < lower) return invalid(`Minimum ${label} is ${lower}.`);
  if (upper !== undefined && measured > upper) return invalid(`Maximum ${label} is ${upper}.`);
  return { valid: true };
}

const EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/** Rewrites a parsed template part to the v1.0 `@path` / `@call` spelling the resolver reads. */
function adaptPart(part: unknown): unknown {
  if (Array.isArray(part)) return part.map(adaptPart);
  if (typeof part !== "object" || part === null) return part;
  const read = (key: string): unknown => (key in part ? Reflect.get(part, key) : undefined);
  const path = read("path");
  if (typeof path === "string" && read("componentId") === undefined && read("@path") === undefined) {
    return { "@path": path };
  }
  const atCall = read("@call");
  const call = typeof atCall === "string" ? atCall : read("call");
  const copy = (source: object): Args => {
    const adapted: Args = {};
    for (const key of Object.keys(source)) {
      Object.defineProperty(adapted, key, {
        value: adaptPart(Reflect.get(source, key)),
        enumerable: true,
        writable: true,
      });
    }
    return adapted;
  };
  if (typeof call === "string") {
    const rawArgs = read("args");
    const args = rawArgs && typeof rawArgs === "object" && !Array.isArray(rawArgs) ? copy(rawArgs) : {};
    const catalogId = read("catalogId");
    return catalogId == null ? { "@call": call, args } : { "@call": call, args, catalogId };
  }
  return copy(part);
}

function formatString(template: unknown, context: DataContext) {
  const parts = new ExpressionParser().parse(coerceToString(template));
  if (parts.length === 0) return "";
  const resolved = parts.map((part) =>
    typeof part === "object" && part !== null && !Array.isArray(part)
      ? context.resolveSignal(context.atLeastV10 ? adaptPart(part) : part)
      : part,
  );
  return computed(() => resolved.map((part) => coerceToString(isSignal(part) ? getValue(part) : part)).join(""));
}

const numberFormats = new Map<string, Intl.NumberFormat>();

function numberFormat(locale: string, options: Intl.NumberFormatOptions): Intl.NumberFormat {
  const key = `${locale}:${JSON.stringify(options)}`;
  let format = numberFormats.get(key);
  if (!format) {
    format = new Intl.NumberFormat(locale, options);
    numberFormats.set(key, format);
  }
  return format;
}

function formatCurrency(value: number, currencyInput: unknown, decimals: unknown, grouping: unknown, locale: string) {
  if (Number.isNaN(value)) return "";
  const currency = String(currencyInput).toUpperCase();
  const digits = typeof decimals === "number" ? decimals : 2;
  const useGrouping = typeof grouping === "boolean" ? grouping : undefined;
  const base = { minimumFractionDigits: digits, maximumFractionDigits: digits, useGrouping };
  try {
    return numberFormat(locale, { ...base, style: "currency", currency }).format(value);
  } catch {
    // A malformed code: lay it out where the locale puts a currency, as the reference engine does.
    return numberFormat(locale, { ...base, style: "currency", currency: "USD", currencyDisplay: "code" })
      .formatToParts(value)
      .map((part) => (part.type === "currency" ? currency : part.value))
      .join("");
  }
}

const DATE_TOKENS = /yyyy|yy|MMMM|MMM|MM|M|EEEE|E|dd|d|HH|H|hh|h|mm|ss|a/g;
const WRITTEN_FIELDS = /^([+-]?\d{4,6})-(\d{2})-(\d{2})(?:[T ](\d{2})(?::(\d{2})(?::(\d{2}))?)?)?/;

/** Parses an ISO 8601 timestamp into the wall-clock fields it was written with (UTC accessors). */
function parseTimestamp(value: string): { shifted: Date; instant: Date } | null {
  const hasOffset = /(?:Z|[+-]\d{2}:?\d{2})$/.test(value);
  const instant = new Date(hasOffset ? value : `${value}Z`);
  if (Number.isNaN(instant.getTime())) return null;
  const offset = /([+-])(\d{2}):?(\d{2})$/.exec(value);
  const offsetMinutes = offset ? (offset[1] === "-" ? -1 : 1) * (Number(offset[2]) * 60 + Number(offset[3])) : 0;
  const shifted = new Date(instant.getTime() + offsetMinutes * 60_000);
  const written = WRITTEN_FIELDS.exec(value);
  if (!written) return null;
  const field = (group: number) => (written[group] === undefined ? undefined : Number(written[group]));
  const roundTrips =
    field(1) === shifted.getUTCFullYear() &&
    field(2) === shifted.getUTCMonth() + 1 &&
    field(3) === shifted.getUTCDate() &&
    (field(4) ?? shifted.getUTCHours()) === shifted.getUTCHours() &&
    (field(5) ?? shifted.getUTCMinutes()) === shifted.getUTCMinutes() &&
    (field(6) ?? shifted.getUTCSeconds()) === shifted.getUTCSeconds();
  return roundTrips ? { shifted, instant } : null;
}

type DateNames = { monthsLong: string[]; monthsShort: string[]; weekdaysLong: string[]; weekdaysShort: string[] };

function dateNames(locale: string): DateNames {
  const render = (options: Intl.DateTimeFormatOptions, dates: Date[]) => {
    const format = new Intl.DateTimeFormat(locale, { ...options, timeZone: "UTC" });
    return dates.map((date) => format.format(date));
  };
  const months = Array.from({ length: 12 }, (_, i) => new Date(Date.UTC(2021, i, 15)));
  const weekdays = Array.from({ length: 7 }, (_, i) => new Date(Date.UTC(2021, 2, 1 + i)));
  return {
    monthsLong: render({ month: "long" }, months),
    monthsShort: render({ month: "short" }, months),
    weekdaysLong: render({ weekday: "long" }, weekdays),
    weekdaysShort: render({ weekday: "short" }, weekdays),
  };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function formatDate(value: unknown, pattern: unknown, names: () => DateNames) {
  if (!value) return "";
  const parsed = parseTimestamp(coerceToString(value));
  if (!parsed) return "";
  const format = typeof pattern === "string" && pattern ? pattern : "yyyy-MM-dd";
  if (format === "ISO") return parsed.instant.toISOString();
  const { shifted } = parsed;
  const table = names();
  const weekday = (shifted.getUTCDay() + 6) % 7;
  const hours = shifted.getUTCHours();
  return format.replace(DATE_TOKENS, (token) => {
    switch (token) {
      case "yyyy":
        return String(shifted.getUTCFullYear());
      case "yy":
        return String(shifted.getUTCFullYear()).slice(-2);
      case "MMMM":
        return table.monthsLong[shifted.getUTCMonth()] ?? "";
      case "MMM":
        return table.monthsShort[shifted.getUTCMonth()] ?? "";
      case "MM":
        return pad(shifted.getUTCMonth() + 1);
      case "M":
        return String(shifted.getUTCMonth() + 1);
      case "EEEE":
        return table.weekdaysLong[weekday] ?? "";
      case "E":
        return table.weekdaysShort[weekday] ?? "";
      case "dd":
        return pad(shifted.getUTCDate());
      case "d":
        return String(shifted.getUTCDate());
      case "HH":
        return pad(hours);
      case "H":
        return String(hours);
      case "hh":
        return pad(hours % 12 || 12);
      case "h":
        return String(hours % 12 || 12);
      case "mm":
        return pad(shifted.getUTCMinutes());
      case "ss":
        return pad(shifted.getUTCSeconds());
      default:
        return hours < 12 ? "AM" : "PM";
    }
  });
}

const OPENABLE = /^(https?|mailto|tel):/i;

/**
 * Opens an `http(s)`, `mailto` or `tel` URL through `Linking`; any other scheme is an expression
 * error, so `javascript:`, `file:` and app deep links never open from an agent payload.
 */
function openUrl(url: unknown): void {
  if (typeof url !== "string" || url.length === 0) return;
  if (!OPENABLE.test(url.trim())) {
    throw new A2uiExpressionError(`Unsupported URL scheme: ${url}`, "openUrl");
  }
  void Linking.openURL(url.trim());
}

/** Options of {@link createBasicCatalogFunctions}. */
export type BasicFunctionOptions = {
  /** BCP 47 locale of the formatting functions. @default "en-US" */
  locale?: string;
};

type Executor = (args: Args, context: DataContext) => unknown;

/**
 * Implements the functions a catalog document declares, by name. A declared function without an
 * executor here stays declared only, and calling it fails as an unimplemented function.
 */
export function createBasicCatalogFunctions(
  apis: ReadonlyMap<string, FunctionApi>,
  { locale }: BasicFunctionOptions = {},
): FunctionImplementation[] {
  const resolved = resolveLocale(locale);
  let names: DateNames | undefined;
  const lazyNames = () => (names ??= dateNames(resolved));
  const plural = new Intl.PluralRules(resolved);

  const executors: Record<string, Executor> = {
    required: ({ value }) =>
      value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0)
        ? invalid("This field is required.")
        : { valid: true },
    regex: ({ value, pattern }) => {
      const compiled = compileRegex(coerceToString(pattern));
      const text = coerceToString(value);
      if (Array.from(text).length > MAX_REGEX_VALUE_CODE_POINTS) {
        return invalid("Value exceeds the maximum length for pattern matching.");
      }
      return compiled.test(text) ? { valid: true } : invalid("Value does not match required pattern.");
    },
    length: ({ value, min, max }) =>
      validateLengthOrRange(typeof value === "string" || Array.isArray(value) ? value.length : 0, min, max, "length"),
    numeric: ({ value, min, max }) => {
      const number = Number(value);
      if (Number.isNaN(number)) return invalid("Value must be a valid number.");
      return validateLengthOrRange(number, min, max, "value");
    },
    email: ({ value }) =>
      typeof value === "string" && EMAIL.test(value)
        ? { valid: true }
        : {
            valid: false,
            code: "INVALID_EMAIL",
            severity: "error",
            message: "Please enter a valid email address (e.g. user@example.com).",
          },
    formatString: ({ value }, context) => formatString(value, context),
    formatNumber: ({ value, decimals, grouping }) => {
      const number = Number(value);
      if (Number.isNaN(number)) return "";
      const digits = typeof decimals === "number" ? decimals : undefined;
      return numberFormat(resolved, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
        useGrouping: typeof grouping === "boolean" ? grouping : undefined,
      }).format(number);
    },
    formatCurrency: ({ value, currency, decimals, grouping }) =>
      formatCurrency(Number(value), currency, decimals, grouping, resolved),
    formatDate: ({ value, format }) => formatDate(value, format, lazyNames),
    pluralize: (args) => {
      const count = Number(args.value);
      const category =
        count === 0 && args.zero !== undefined
          ? "zero"
          : count === 1 && args.one !== undefined
            ? "one"
            : count === 2 && args.two !== undefined
              ? "two"
              : plural.select(count);
      return coerceToString(args[category] ?? args.other);
    },
    openUrl: ({ url }) => openUrl(url),
    and: ({ values }) => {
      if (!Array.isArray(values) || values.length < 2)
        throw new A2uiExpressionError("and requires at least 2 values", "and");
      return values.every(truthy);
    },
    or: ({ values }) => {
      if (!Array.isArray(values) || values.length < 2)
        throw new A2uiExpressionError("or requires at least 2 values", "or");
      return values.some(truthy);
    },
    not: ({ value }) => !truthy(value),
  };

  const implementations: FunctionImplementation[] = [];
  for (const [name, api] of apis) {
    const execute = executors[name];
    if (execute)
      implementations.push(createFunctionImplementation(api, (args: Args, context) => execute(args, context)));
  }
  return implementations;
}
