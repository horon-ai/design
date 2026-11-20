import { StyleSheet, View } from "react-native";
import { Avatar, HoronText } from "@horon-ai/expo";

/**
 * Four pixels of sky-500, inline so the image variant shows a filled circle even
 * where the gallery has no network.
 */
const PHOTO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAAEUlEQVR42mMonLkNjhiI4wAA1AIcAfT98ecAAAAASUVORK5CYII=";

export default function AvatarDemo() {
  return (
    <View style={styles.stack}>
      <HoronText variant="label-sm" tone="text-secondary">
        Initials · sm, md, lg, xl
      </HoronText>
      <View style={styles.row}>
        <Avatar size="sm">HM</Avatar>
        <Avatar size="md">HM</Avatar>
        <Avatar size="lg">HM</Avatar>
        <Avatar size="xl">HM</Avatar>
      </View>
      <HoronText variant="label-sm" tone="text-secondary">
        Bot · sm, md, lg, xl
      </HoronText>
      <View style={styles.row}>
        <Avatar type="bot" size="sm" />
        <Avatar type="bot" size="md" />
        <Avatar type="bot" size="lg" />
        <Avatar type="bot" size="xl" />
      </View>
      <HoronText variant="label-sm" tone="text-secondary">
        Image · with initials behind the load, then the live dot
      </HoronText>
      <View style={styles.row}>
        <Avatar type="image" size="lg" src={PHOTO} alt="Min-yeol" />
        <Avatar type="image" size="lg" src={PHOTO} alt="" live />
        <Avatar type="image" size="xl" src={PHOTO} alt="">
          HM
        </Avatar>
      </View>
      <HoronText variant="label-sm" tone="text-secondary">
        Live dot and the sky account tone
      </HoronText>
      <View style={styles.row}>
        <Avatar live>HM</Avatar>
        <Avatar tone="sky" live>
          HM
        </Avatar>
        <Avatar type="bot" live />
        <Avatar size="lg" live liveRingClassName="border-bg-subtle">
          HM
        </Avatar>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 12, alignItems: "center" },
});
