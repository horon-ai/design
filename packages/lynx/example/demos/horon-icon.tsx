import { HoronGlyph, HoronIcon, iconNames } from "../../src/components/horon-icon";

const sizes = [16, 20, 24];
const tones = ["text-primary", "text-secondary", "text-brand"] as const;

/**
 * The falcon mark at three sizes, one glyph in three tints, and the whole registry.
 */
export default function HoronIconDemo() {
  return (
    <view className="flex w-full flex-col gap-8 p-4">
      <view className="flex flex-row items-center gap-5">
        <HoronIcon size={16} />
        <HoronIcon size={24} />
        <HoronIcon size={32} />
      </view>

      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">16 / 20 / 24</text>
        <view className="flex flex-row flex-wrap items-center gap-6">
          {tones.map((tone) => (
            <view key={tone} className="flex flex-row items-center gap-3">
              {sizes.map((size) => (
                <HoronGlyph key={size} name="sparkles" size={size} color={tone} />
              ))}
            </view>
          ))}
        </view>
      </view>

      <view className="flex flex-row flex-wrap gap-2">
        {iconNames.map((name) => (
          <view
            key={name}
            className="motion-colors flex flex-col items-center gap-2 rounded-lg px-2 py-3"
            style={{ width: "7.5rem" }}
          >
            <HoronGlyph name={name} size={24} />
            <text className="max-w-full text-caption text-text-secondary">{name}</text>
          </view>
        ))}
      </view>
    </view>
  );
}
