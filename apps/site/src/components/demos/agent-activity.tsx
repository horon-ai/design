import { Button, StreamingText, ThinkingIndicator, ToolStep, WorkLog } from "@horon-ai/react";
import { useCallback, useEffect, useState } from "react";

const answer =
  "Drafted replies for 2 of 6 emails. Working on the Larkspur invoice thread next, then the two hiring follow-ups. I'll ask before sending anything to investors.";

/** Splits the answer into word-sized chunks that land at uneven intervals, like a model stream. */
const chunks = answer.match(/\S+\s*/g) ?? [];

/** Plays the answer once from mount, as if a model were writing it; remount it to play again. */
function LiveAnswer({ onDone }: { onDone: () => void }) {
  const [received, setReceived] = useState(0);
  useEffect(() => {
    let index = 0;
    let timer = 0;
    const next = () => {
      index += 1 + Math.floor(Math.random() * 3);
      setReceived(Math.min(index, chunks.length));
      if (index < chunks.length) timer = window.setTimeout(next, 80 + Math.random() * 320);
      else onDone();
    };
    timer = window.setTimeout(next, 600);
    return () => window.clearTimeout(timer);
  }, [onDone]);
  return <StreamingText text={chunks.slice(0, received).join("")} streaming={received < chunks.length} />;
}

export default function AgentActivityDemo() {
  const [run, setRun] = useState(0);
  const [done, setDone] = useState(false);
  const finish = useCallback(() => setDone(true), []);
  return (
    <div className="flex w-full max-w-85 flex-col items-start gap-4">
      <ThinkingIndicator />
      <LiveAnswer key={run} onDone={finish} />
      <Button
        variant="solid"
        size="sm"
        disabled={!done}
        onClick={() => {
          setDone(false);
          setRun((value) => value + 1);
        }}
      >
        Replay
      </Button>
      <ToolStep state="running" title="Searching Gmail" detail="41 emails from last night" />
      <ToolStep state="failed" title="Couldn't open the calendar" detail="Calendar needs to be reconnected" />
      <WorkLog
        summary="Worked for 42s · 3 steps"
        steps={[
          { id: "read", title: "Read 41 new emails", detail: "Inbox · since 6 PM" },
          { id: "sort", title: "Sorted 6 that need you", detail: "Flagged in Inbox" },
          { id: "draft", title: "Drafting replies", detail: "2 of 6 done", running: true },
        ]}
      />
    </div>
  );
}
