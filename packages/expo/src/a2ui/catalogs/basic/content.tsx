import { sanitizeMediaUrl } from "@a2ui/web_core";
import { radius, spacing } from "@horon-ai/tokens";
import {
  ArrowClockwise,
  ArrowLeft,
  ArrowRight,
  Bell,
  BellSlash,
  CalendarBlank,
  CalendarCheck,
  Camera,
  Check,
  CreditCard,
  DeviceMobile,
  DotsThree,
  DotsThreeVertical,
  DownloadSimple,
  Envelope,
  Eye,
  EyeSlash,
  FastForward,
  Folder,
  Gear,
  Heart,
  House,
  Image as ImageGlyph,
  Info,
  List as ListGlyph,
  Lock,
  LockOpen,
  MagnifyingGlass,
  MapPin,
  MusicNotes,
  Paperclip,
  PaperPlaneRight,
  Pause,
  PencilSimple,
  Phone,
  Play,
  Plus,
  Printer,
  Question,
  Rewind,
  ShareNetwork,
  ShoppingCart,
  SkipBack,
  SkipForward,
  SpeakerHigh,
  SpeakerLow,
  SpeakerNone,
  SpeakerSlash,
  Star,
  StarHalf,
  Stop,
  Trash,
  UploadSimple,
  User,
  UserCircle,
  Warning,
  WarningCircle,
  X,
  type IconProps,
  type IconWeight,
} from "phosphor-react-native";
import { createElement, useContext, useState, type ComponentType } from "react";
import { Image, Linking, StyleSheet, View, type ImageResizeMode, type ImageStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

import { RichText } from "../../../components/rich-text";
import { DEFAULT_ICON_WEIGHT } from "../../../lib/icon";
import { HoronPressable } from "../../../lib/press";
import { HoronText } from "../../../lib/text";
import { useHoronTheme } from "../../../provider";
import { readAccessibility } from "../../runtime/accessibility";
import { MarkdownComponentContext } from "../../runtime/markdown";
import type { NativeA2uiComponentProps } from "../../runtime/types";
import { ContentToneContext, text } from "./shared";

type Props = NativeA2uiComponentProps;

/** `Text`: Markdown body copy, or a caption. Inside a control it takes the control's label token. */
export function A2uiText({ props }: Props) {
  const content = text(props.text);
  const tone = useContext(ContentToneContext);
  const Markdown = useContext(MarkdownComponentContext);
  const { label } = readAccessibility(props);

  if (tone) {
    return (
      <HoronText variant={tone.variant} tone={tone.tone} accessibilityLabel={label}>
        {content}
      </HoronText>
    );
  }
  if (props.variant === "caption") {
    return (
      <HoronText variant="caption" tone="text-secondary" accessibilityLabel={label}>
        {content}
      </HoronText>
    );
  }
  if (Markdown) return createElement(Markdown, { markdown: content });
  return (
    <RichText format="basic" size="md">
      {content}
    </RichText>
  );
}

const IMAGE_SIZE: Record<string, ImageStyle> = {
  icon: { width: 24, height: 24 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  smallFeature: { width: 96, height: 96, borderRadius: radius.md },
  mediumFeature: { width: "100%", aspectRatio: 16 / 9, borderRadius: radius.lg },
  largeFeature: { width: "100%", aspectRatio: 4 / 3, borderRadius: radius.lg },
  header: { width: "100%", aspectRatio: 21 / 9 },
};

const FIT: Record<string, ImageResizeMode> = {
  contain: "contain",
  cover: "cover",
  fill: "stretch",
  none: "center",
  scaleDown: "contain",
};

/** An `https:` or `http:` URL `sanitizeMediaUrl` accepts, else `undefined`. */
function mediaUri(value: unknown): string | undefined {
  const raw = text(value);
  if (!raw) return undefined;
  const safe = sanitizeMediaUrl(raw);
  return safe && /^https?:/i.test(safe) ? safe : undefined;
}

/** `Image`: a remote image sized by its `variant`; unsafe schemes draw nothing. */
export function A2uiImage({ props }: Props) {
  const uri = mediaUri(props.url);
  const theme = useHoronTheme();
  if (!uri) return null;
  const variant = typeof props.variant === "string" ? props.variant : "mediumFeature";
  const description = text(props.description) || readAccessibility(props).label;
  return (
    <Image
      source={{ uri }}
      resizeMode={FIT[text(props.fit, "fill")] ?? "stretch"}
      accessible={Boolean(description)}
      accessibilityLabel={description}
      accessibilityRole={description ? "image" : undefined}
      style={[IMAGE_SIZE[variant] ?? IMAGE_SIZE.mediumFeature, { backgroundColor: theme.color("bg-subtle") }]}
    />
  );
}

type Glyph = ComponentType<IconProps>;
const ICONS: Record<string, { glyph: Glyph; weight?: IconWeight }> = {
  accountCircle: { glyph: UserCircle },
  add: { glyph: Plus },
  arrowBack: { glyph: ArrowLeft },
  arrowForward: { glyph: ArrowRight },
  attachFile: { glyph: Paperclip },
  calendarToday: { glyph: CalendarBlank },
  call: { glyph: Phone },
  camera: { glyph: Camera },
  check: { glyph: Check },
  close: { glyph: X },
  delete: { glyph: Trash },
  download: { glyph: DownloadSimple },
  edit: { glyph: PencilSimple },
  event: { glyph: CalendarCheck },
  error: { glyph: WarningCircle },
  fastForward: { glyph: FastForward },
  favorite: { glyph: Heart, weight: "fill" },
  favoriteOff: { glyph: Heart },
  folder: { glyph: Folder },
  help: { glyph: Question },
  home: { glyph: House },
  info: { glyph: Info },
  locationOn: { glyph: MapPin },
  lock: { glyph: Lock },
  lockOpen: { glyph: LockOpen },
  mail: { glyph: Envelope },
  menu: { glyph: ListGlyph },
  moreVert: { glyph: DotsThreeVertical },
  moreHoriz: { glyph: DotsThree },
  notificationsOff: { glyph: BellSlash },
  notifications: { glyph: Bell },
  pause: { glyph: Pause },
  payment: { glyph: CreditCard },
  person: { glyph: User },
  phone: { glyph: DeviceMobile },
  photo: { glyph: ImageGlyph },
  play: { glyph: Play },
  print: { glyph: Printer },
  refresh: { glyph: ArrowClockwise },
  rewind: { glyph: Rewind },
  search: { glyph: MagnifyingGlass },
  send: { glyph: PaperPlaneRight },
  settings: { glyph: Gear },
  share: { glyph: ShareNetwork },
  shoppingCart: { glyph: ShoppingCart },
  skipNext: { glyph: SkipForward },
  skipPrevious: { glyph: SkipBack },
  star: { glyph: Star, weight: "fill" },
  starHalf: { glyph: StarHalf, weight: "fill" },
  starOff: { glyph: Star },
  stop: { glyph: Stop },
  upload: { glyph: UploadSimple },
  visibility: { glyph: Eye },
  visibilityOff: { glyph: EyeSlash },
  volumeDown: { glyph: SpeakerLow },
  volumeMute: { glyph: SpeakerNone },
  volumeOff: { glyph: SpeakerSlash },
  volumeUp: { glyph: SpeakerHigh },
  warning: { glyph: Warning },
};

const ICON_SIZE = 24;

/** `Icon`: one of the catalog's named icons as a Phosphor glyph, or a custom `svgPath` on a 24 grid. */
export function A2uiIcon({ props }: Props) {
  const theme = useHoronTheme();
  const tone = useContext(ContentToneContext);
  const color = theme.color(tone?.tone ?? "text-primary");
  const { label } = readAccessibility(props);
  const a11y = label
    ? { accessible: true, accessibilityLabel: label, accessibilityRole: "image" as const }
    : { accessibilityElementsHidden: true, importantForAccessibility: "no-hide-descendants" as const };

  const name = props.name;
  if (typeof name === "string") {
    const entry = ICONS[name];
    if (!entry) return null;
    const Glyph = entry.glyph;
    return (
      <View {...a11y}>
        <Glyph size={ICON_SIZE} color={color} weight={entry.weight ?? DEFAULT_ICON_WEIGHT} />
      </View>
    );
  }
  if (name && typeof name === "object" && "svgPath" in name && typeof name.svgPath === "string") {
    return (
      <View {...a11y}>
        <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24">
          <Path d={name.svgPath} fill={color} />
        </Svg>
      </View>
    );
  }
  return null;
}

/**
 * A media row that hands the URL to the system player: React Native has no built-in video or audio
 * element, and this package takes no player dependency, so playback opens outside the app.
 */
function MediaLink({
  uri,
  title,
  poster,
  glyph: Glyph,
}: {
  uri: string;
  title: string;
  poster?: string;
  glyph: Glyph;
}) {
  const theme = useHoronTheme();
  const [failed, setFailed] = useState(false);
  return (
    <HoronPressable
      role="button"
      accessibilityLabel={title}
      onPress={() => void Linking.openURL(uri)}
      pressScale
      style={[styles.media, { backgroundColor: theme.color("bg-subtle"), borderColor: theme.color("border-default") }]}
    >
      {poster && !failed ? (
        <Image source={{ uri: poster }} resizeMode="cover" style={styles.poster} onError={() => setFailed(true)} />
      ) : null}
      <View style={styles.mediaRow}>
        <View style={[styles.playBadge, { backgroundColor: theme.color("interactive-primary") }]}>
          <Glyph size={18} color={theme.color("interactive-on-primary")} weight="fill" />
        </View>
        <HoronText variant="label-md" numberOfLines={2} style={styles.mediaTitle}>
          {title}
        </HoronText>
      </View>
    </HoronPressable>
  );
}

/** `Video`: the poster with a play row; pressing opens the video in the system player. */
export function A2uiVideo({ props }: Props) {
  const uri = mediaUri(props.url);
  if (!uri) return null;
  const title = readAccessibility(props).label ?? "Play video";
  return <MediaLink uri={uri} title={title} poster={mediaUri(props.posterUrl)} glyph={Play} />;
}

/** `AudioPlayer`: a play row with the description; pressing opens the audio in the system player. */
export function A2uiAudioPlayer({ props }: Props) {
  const uri = mediaUri(props.url);
  if (!uri) return null;
  const title = text(props.description) || readAccessibility(props).label || "Play audio";
  return <MediaLink uri={uri} title={title} glyph={MusicNotes} />;
}

/** `Divider`: a hairline in the default border colour, across or down its parent. */
export function A2uiDivider({ props }: Props) {
  const theme = useHoronTheme();
  const vertical = props.axis === "vertical";
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[vertical ? styles.vertical : styles.horizontal, { backgroundColor: theme.color("border-default") }]}
    />
  );
}

const styles = StyleSheet.create({
  media: {
    width: "100%",
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  poster: { width: "100%", aspectRatio: 16 / 9 },
  mediaRow: { flexDirection: "row", alignItems: "center", gap: spacing["3"], padding: spacing["3"] },
  playBadge: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  mediaTitle: { flex: 1 },
  horizontal: { height: StyleSheet.hairlineWidth, alignSelf: "stretch" },
  vertical: { width: StyleSheet.hairlineWidth, alignSelf: "stretch" },
});
