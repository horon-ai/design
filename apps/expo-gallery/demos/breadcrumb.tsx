import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Breadcrumb, BreadcrumbItem, HoronText } from "@horon-ai/expo";

import { Backdrop } from "../backdrop";

/** Bare, solid and glass trays, with a tile on the first crumb and a link in the trail. */
export default function BreadcrumbDemo() {
  const [reached, setReached] = useState("Horon");
  return (
    <View style={styles.stack}>
      <HoronText variant="label-sm" tone="text-secondary">
        Bare · crumbs with a tile and a link
      </HoronText>
      <Breadcrumb>
        <BreadcrumbItem href="/" tile="H" onPress={() => setReached("Home")}>
          Home
        </BreadcrumbItem>
        <BreadcrumbItem href="/projects" onPress={() => setReached("Projects")}>
          Projects
        </BreadcrumbItem>
        <BreadcrumbItem current>Horon</BreadcrumbItem>
      </Breadcrumb>
      <HoronText variant="label-sm" tone="text-secondary">
        Solid tray
      </HoronText>
      <Breadcrumb surface="solid">
        <BreadcrumbItem href="/" tile="H" onPress={() => setReached("Home")}>
          Home
        </BreadcrumbItem>
        <BreadcrumbItem current>Horon</BreadcrumbItem>
      </Breadcrumb>
      <Backdrop>
        <Breadcrumb surface="glass">
          <BreadcrumbItem href="/" onPress={() => setReached("Home")}>
            Home
          </BreadcrumbItem>
          <BreadcrumbItem href="/projects" onPress={() => setReached("Projects")}>
            Projects
          </BreadcrumbItem>
          <BreadcrumbItem current>Horon</BreadcrumbItem>
        </Breadcrumb>
      </Backdrop>
      <HoronText variant="label-sm" tone="text-secondary">
        An over-wide trail scrolls inside the tray
      </HoronText>
      <Breadcrumb surface="solid">
        {["Workspace", "Projects", "Design system", "Components", "Breadcrumb"].map((label, index, all) => (
          <BreadcrumbItem
            key={label}
            href={`/${label}`}
            current={index === all.length - 1}
            onPress={() => setReached(label)}
          >
            {label}
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
      <HoronText variant="caption" tone="text-secondary">
        last pressed {reached}
      </HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
});
