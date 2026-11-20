import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ApprovalCard, HoronText, type ApprovalState } from "@horon-ai/expo";

import { Backdrop } from "../backdrop";

export default function ApprovalCardDemo() {
  const [state, setState] = useState<ApprovalState>("pending");
  return (
    <View style={styles.stack}>
      <HoronText variant="label-sm" tone="text-secondary">
        Pending · approve or defer, the card settles once
      </HoronText>
      <ApprovalCard
        state={state}
        title="Send the Q3 board deck to the team?"
        attachment="Q3-board-deck.pdf"
        onApprove={() => setState("approved")}
        onLater={() => setState("declined")}
      />
      <HoronText variant="label-sm" tone="text-secondary">
        Settled states
      </HoronText>
      <ApprovalCard state="approved" title="Sent the Q3 board deck to the team" />
      <ApprovalCard state="declined" title="Kept the Q3 deck private" laterLabel="Decline" approveLabel="Approve" />
      <HoronText variant="label-sm" tone="text-secondary">
        Custom status line, no attachment
      </HoronText>
      <ApprovalCard
        state="pending"
        status="Waiting on you"
        title="Archive 42 stale sources?"
        onApprove={() => setState("approved")}
        onLater={() => setState("declined")}
      />
      <Backdrop>
        <ApprovalCard
          surface="glass"
          state="pending"
          title="Share the workspace with the design team?"
          attachment="design-team"
          onApprove={() => setState("approved")}
          onLater={() => setState("declined")}
        />
      </Backdrop>
      <HoronText variant="label-sm" tone="text-secondary">
        state: {state}
      </HoronText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12 },
});
