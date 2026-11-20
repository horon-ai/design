import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Field, FieldDescription, FieldError, FieldLabel, HoronText, Input, Textarea } from "@horon-ai/expo";

export default function FieldDemo() {
  const [email, setEmail] = useState("not-an-address");
  const invalid = email.length > 0 && !email.includes("@");
  return (
    <View style={styles.stack}>
      <HoronText variant="label-md">Label, control and help text</HoronText>
      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input type="email" placeholder="you@example.com" />
        <FieldDescription>We only use it to sign you in.</FieldDescription>
      </Field>

      <HoronText variant="label-md">Validation through the field's invalid state</HoronText>
      <Field invalid={invalid}>
        <FieldLabel>Email</FieldLabel>
        <Input type="email" value={email} onChange={setEmail} />
        <FieldDescription>We only use it to sign you in.</FieldDescription>
        <FieldError>Enter a valid address.</FieldError>
      </Field>
      <HoronText variant="caption" tone="text-secondary">
        {invalid ? "The field and its control paint danger red." : "A valid address keeps the field plain."}
      </HoronText>

      <HoronText variant="label-md">Sizes · 6 / 8 / 10pt gaps</HoronText>
      <Field size="sm">
        <FieldLabel>Small</FieldLabel>
        <Input size="sm" placeholder="label-sm and caption" />
        <FieldDescription>Gap 6.</FieldDescription>
      </Field>
      <Field size="md">
        <FieldLabel>Medium</FieldLabel>
        <Input placeholder="label-md and caption" />
        <FieldDescription>Gap 8, the default.</FieldDescription>
      </Field>
      <Field size="lg">
        <FieldLabel>Large</FieldLabel>
        <Input size="lg" placeholder="label-lg and body-sm" />
        <FieldDescription>Gap 10.</FieldDescription>
      </Field>

      <HoronText variant="label-md">A Match escape and a disabled field</HoronText>
      <Field>
        <FieldLabel>Notes</FieldLabel>
        <Textarea placeholder="Never shown while the field is valid." />
        <FieldError match>Shown through Match, even while the field is valid.</FieldError>
      </Field>
      <Field disabled>
        <FieldLabel>Locked</FieldLabel>
        <Input disabled defaultValue="Read only" />
        <FieldDescription>The label dims with the field.</FieldDescription>
      </Field>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 20, alignItems: "stretch" },
});
