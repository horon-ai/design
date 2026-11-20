import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { HoronText, Slider } from "@horon-ai/expo";

/** The default row, a fractional step, the vertical axis, the edge alignment and the disabled row. */
export default function SliderDemo() {
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(40);
  const [zoom, setZoom] = useState(30);

  return (
    <View style={styles.stack}>
      <View style={styles.block}>
        <HoronText variant="label-sm" tone="text-secondary">
          Voice speed {speed.toFixed(1)}x
        </HoronText>
        <Slider
          aria-label="Voice speed"
          min={0.5}
          max={2}
          step={0.1}
          value={speed}
          onValueChange={setSpeed}
          onValueCommitted={setSpeed}
        />
      </View>
      <View style={styles.block}>
        <HoronText variant="label-sm" tone="text-secondary">
          Volume {volume}
        </HoronText>
        <Slider aria-label="Volume" defaultValue={40} step={5} onValueChange={setVolume} />
      </View>
      <View style={styles.row}>
        <View style={styles.block}>
          <HoronText variant="label-sm" tone="text-secondary">
            Vertical {zoom}
          </HoronText>
          <Slider
            aria-label="Zoom"
            orientation="vertical"
            value={zoom}
            onValueChange={setZoom}
            format={{ maximumFractionDigits: 0 }}
            locale="en-US"
          />
        </View>
        <View style={styles.block}>
          <HoronText variant="label-sm" tone="text-secondary">
            Edge alignment
          </HoronText>
          <Slider aria-label="Edge aligned" defaultValue={25} thumbAlignment="edge" />
        </View>
      </View>
      <View style={styles.block}>
        <HoronText variant="label-sm" tone="text-secondary">
          Disabled
        </HoronText>
        <Slider aria-label="Disabled" defaultValue={70} disabled />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 20 },
  block: { gap: 8 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 24, alignItems: "flex-end" },
});
