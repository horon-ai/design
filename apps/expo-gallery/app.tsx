import { useEffect, useState } from "react";
import { Linking, Pressable, ScrollView, StyleSheet, Switch, View } from "react-native";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { HoronProvider, HoronText, useHoronTheme, useInsets } from "@horon-ai/expo";

import pretendard from "./assets/fonts/PretendardVariable.ttf";
import geistMono from "./assets/fonts/GeistMono-Variable.ttf";
import { registry } from "./registry.g";

/** One labelled switch in the gallery header. */
function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (next: boolean) => void }) {
  return (
    <View style={styles.toggle}>
      <HoronText variant="label-sm" tone="text-secondary">
        {label}
      </HoronText>
      <Switch value={value} onValueChange={onChange} accessibilityLabel={label} />
    </View>
  );
}

/** What the gallery shows: the open demo, the palette and the glass mode. */
type GalleryState = { open: string | null; dark: boolean; frost: boolean; haptics: boolean };

/**
 * Reads a gallery deep link,
 * `exp://<host>/--/<slug>?scheme=dark&glass=frost&haptics=off`, so a
 * screenshot run can open any demo in either palette, glass mode and haptics
 * setting without tapping.
 */
function parseLink(url: string): Partial<GalleryState> {
  const marker = url.indexOf("/--/");
  if (marker === -1) return {};
  const [path = "", query = ""] = url.slice(marker + 4).split("?");
  const params = new Map(
    query.split("&").map((pair) => {
      const [key = "", value = ""] = pair.split("=");
      return [key, value];
    }),
  );
  return {
    ...(path ? { open: decodeURIComponent(path) } : {}),
    ...(params.has("scheme") ? { dark: params.get("scheme") === "dark" } : {}),
    ...(params.has("glass") ? { frost: params.get("glass") === "frost" } : {}),
    ...(params.has("haptics") ? { haptics: params.get("haptics") !== "off" } : {}),
  };
}

/** The slug list, or the open demo with a back row. */
function Gallery({ state, update }: { state: GalleryState; update: (next: Partial<GalleryState>) => void }) {
  const theme = useHoronTheme();
  const insets = useInsets();
  const { open, dark, frost, haptics } = state;
  const entry = registry.find((item) => item.slug === open);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <StatusBar style={dark ? "light" : "dark"} />
      <View style={[styles.header, { borderColor: theme.color("border-default") }]}>
        {entry ? (
          <Pressable role="button" accessibilityLabel="Back to the list" onPress={() => update({ open: null })} hitSlop={12}>
            <HoronText variant="label-lg" tone="text-brand">
              ‹ {entry.slug}
            </HoronText>
          </Pressable>
        ) : (
          <HoronText variant="title-sm">Horon · {registry.length}</HoronText>
        )}
        <View style={styles.toggles}>
          <Toggle label="Dark" value={dark} onChange={(next) => update({ dark: next })} />
          <Toggle label="Frost" value={frost} onChange={(next) => update({ frost: next })} />
          <Toggle label="Haptics" value={haptics} onChange={(next) => update({ haptics: next })} />
        </View>
      </View>
      <ScrollView contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 24 }]}>
        {entry ? (
          <entry.Demo />
        ) : (
          registry.map((item) => (
            <Pressable
              key={item.slug}
              role="button"
              onPress={() => update({ open: item.slug })}
              style={({ pressed }) => [
                styles.row,
                { borderColor: theme.color("border-default") },
                pressed && { backgroundColor: theme.color("bg-subtle") },
              ]}
            >
              <HoronText variant="label-lg">{item.slug}</HoronText>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

export default function App() {
  const [loaded] = useFonts({ "Pretendard Variable": pretendard, "Geist Mono Variable": geistMono });
  const [state, setState] = useState<GalleryState>({ open: null, dark: false, frost: false, haptics: true });
  const update = (next: Partial<GalleryState>) => setState((current) => ({ ...current, ...next }));

  useEffect(() => {
    Linking.getInitialURL()
      .then((url) => {
        if (url) setState((current) => ({ ...current, ...parseLink(url) }));
        return url;
      })
      .catch(() => undefined);
    const subscription = Linking.addEventListener("url", ({ url }) =>
      setState((current) => ({ ...current, ...parseLink(url) })),
    );
    return () => subscription.remove();
  }, []);

  if (!loaded) return null;
  return (
    <SafeAreaProvider>
      <HoronProvider
        scheme={state.dark ? "dark" : "light"}
        glass={state.frost ? "frost" : "auto"}
        haptics={state.haptics}
      >
        <Gallery state={state} update={update} />
      </HoronProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    rowGap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  toggles: { flexDirection: "row", gap: 10 },
  toggle: { flexDirection: "row", alignItems: "center", gap: 6 },
  body: { padding: 16, gap: 16 },
  row: { paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth },
});
