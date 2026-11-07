import { Avatar, type AvatarSize } from "../../src/components/avatar";

const sizes: AvatarSize[] = ["sm", "md", "lg", "xl"];

/** The image row points at the site's mascot so the gallery shows a real picture; a URL that fails to load
 * keeps the initials, which is the component's own fallback. */
const MASCOT = "https://design.horon.ai/mascots/horon-mascot-face.webp";

/**
 * Initials, bot, bot with the live dot, and images, each in the four diameters.
 */
export default function AvatarDemo() {
  return (
    <view className="flex flex-col gap-4 p-4">
      <view className="flex flex-row items-center gap-3">
        {sizes.map((size) => (
          <Avatar key={size} size={size}>
            MY
          </Avatar>
        ))}
      </view>
      <view className="flex flex-row items-center gap-3">
        {sizes.map((size) => (
          <Avatar key={size} type="bot" size={size} />
        ))}
      </view>
      <view className="flex flex-row items-center gap-3">
        {sizes.map((size) => (
          <Avatar key={size} type="bot" size={size} live />
        ))}
      </view>
      <view className="flex flex-row items-center gap-3">
        {sizes.map((size) => (
          <Avatar key={size} type="image" size={size} src={MASCOT} alt="Horon">
            H
          </Avatar>
        ))}
      </view>
      <view className="flex flex-row items-center gap-3">
        {sizes.map((size) => (
          <Avatar key={size} size={size} tone="sky">
            MY
          </Avatar>
        ))}
      </view>
    </view>
  );
}
