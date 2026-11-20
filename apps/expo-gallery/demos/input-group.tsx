import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Globe } from "phosphor-react-native";
import { HoronText, InputGroup, InputGroupSegment, Select } from "@horon-ai/expo";

import { Backdrop } from "../backdrop";

const CURRENCIES = [
  { value: "usd", label: "USD" },
  { value: "krw", label: "KRW" },
  { value: "eur", label: "EUR" },
];

export default function InputGroupDemo() {
  const [amount, setAmount] = useState("");
  return (
    <View style={styles.stack}>
      <HoronText variant="label-md">Fixed-text prefix and suffix</HoronText>
      <InputGroup
        accessibilityLabel="Website"
        prefix={<InputGroupSegment>https://</InputGroupSegment>}
        suffix={<InputGroupSegment>.ai</InputGroupSegment>}
        placeholder="horon"
      />

      <HoronText variant="label-md">Select segments, three sizes</HoronText>
      <InputGroup
        accessibilityLabel="Amount in USD"
        size="sm"
        prefix={<Select aria-label="Currency" variant="segment" items={CURRENCIES} defaultValue="usd" />}
        placeholder="0.00"
        value={amount}
        onChange={setAmount}
        suffix={<InputGroupSegment>USD</InputGroupSegment>}
      />
      <InputGroup
        accessibilityLabel="Amount in USD"
        size="md"
        prefix={<Select aria-label="Currency" variant="segment" items={CURRENCIES} defaultValue="krw" />}
        placeholder="0.00"
      />
      <InputGroup
        accessibilityLabel="Amount in USD"
        size="lg"
        prefix={<Select aria-label="Currency" variant="segment" items={CURRENCIES} defaultValue="eur" />}
        placeholder="0.00"
        suffix={<InputGroupSegment>EUR</InputGroupSegment>}
      />

      <HoronText variant="label-md">States and surfaces</HoronText>
      <InputGroup accessibilityLabel="Invalid group" invalid prefix={<InputGroupSegment>https://</InputGroupSegment>} />
      <InputGroup
        accessibilityLabel="Disabled group"
        disabled
        defaultValue="horon"
        prefix={<InputGroupSegment>https://</InputGroupSegment>}
      />
      <InputGroup
        accessibilityLabel="Group with an icon"
        prefix={
          <InputGroupSegment>
            <Globe size={16} />
          </InputGroupSegment>
        }
        placeholder="globe prefix"
      />
      <Backdrop>
        <InputGroup
          accessibilityLabel="Glass group"
          surface="glass"
          prefix={<InputGroupSegment>https://</InputGroupSegment>}
          placeholder="glass"
        />
      </Backdrop>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12 },
});
