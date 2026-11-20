import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { BreadcrumbHeader, HoronText } from "@horon-ai/expo";

import { Backdrop } from "../backdrop";

/** The 52pt crumb pill, with and without the two icon buttons, on both surfaces. */
export default function BreadcrumbHeaderDemo() {
  const [last, setLast] = useState("none");
  return (
    <View style={styles.stack}>
      <HoronText variant="label-sm" tone="text-secondary">
        Solid · crumbs only
      </HoronText>
      <BreadcrumbHeader crumbs={[{ label: "Workspace" }, { label: "Sources" }]} />
      <HoronText variant="label-sm" tone="text-secondary">
        Solid · with the search and more buttons
      </HoronText>
      <BreadcrumbHeader
        crumbs={[{ label: "H", tile: "H", href: "/" }, { label: "Projects", href: "/projects" }, { label: "Horon" }]}
        onSearch={() => setLast("search")}
        onMore={() => setLast("more")}
      />
      <BreadcrumbHeader
        searchLabel="Find sources"
        moreLabel="Source actions"
        crumbs={[{ label: "Docs" }, { label: "Design system", href: "/docs/design" }, { label: "Breadcrumb" }]}
        onSearch={() => setLast("search")}
        onMore={() => setLast("more")}
      />
      <Backdrop>
        <BreadcrumbHeader
          surface="glass"
          crumbs={[{ label: "H", tile: "H", href: "/" }, { label: "Projects" }, { label: "Horon" }]}
          onSearch={() => setLast("search")}
          onMore={() => setLast("more")}
        />
      </Backdrop>
      <HoronText variant="label-sm" tone="text-secondary">
        An over-wide trail scrolls; only the last crumb truncates
      </HoronText>
      <BreadcrumbHeader
        crumbs={[
          { label: "Workspace" },
          { label: "Projects" },
          { label: "Design system" },
          { label: "Components" },
          { label: "Breadcrumb header with a long current page name" },
        ]}
        onSearch={() => setLast("search")}
      />
      <HoronText variant="caption" tone="text-secondary">
        last pressed {last}
      </HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 16 },
});
