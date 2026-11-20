import { StyleSheet, View } from "react-native";
import { ChatBubble, HoronText } from "@horon-ai/expo";

export default function ChatBubbleDemo() {
  return (
    <View style={styles.stack}>
      <HoronText variant="label-sm" tone="text-secondary">
        Conversation · bot left, me right
      </HoronText>
      <View style={styles.stack}>
        <ChatBubble from="bot">What should I look up?</ChatBubble>
        <ChatBubble from="me">The Q3 usage report, please.</ChatBubble>
        <ChatBubble from="bot">I found three sources. Want me to summarise the second one?</ChatBubble>
      </View>
      <HoronText variant="label-sm" tone="text-secondary">
        Sizes · sm, md, lg
      </HoronText>
      <View style={styles.stack}>
        <ChatBubble size="sm">Small bubble</ChatBubble>
        <ChatBubble size="md" from="bot">
          Medium bubble with a second line of text, so the 12pt padding shows
        </ChatBubble>
        <ChatBubble size="lg">Large bubble</ChatBubble>
      </View>
      <HoronText variant="label-sm" tone="text-secondary">
        Long word wraps inside the 560pt cap
      </HoronText>
      <ChatBubble from="bot">
        {"Honorificabilitudinitatibus "}
        {"and a very long unbroken run of characters that has to wrap instead of leaving the bubble"}
      </ChatBubble>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12 },
});
