import { useEffect, useState } from "@lynx-js/react";

import { StreamingText, ThinkingIndicator, ToolStep, WorkLog } from "../../src/components/agent-activity";
import { Button } from "../../src/components/button";

const answer =
  "Drafted replies for 2 of 6 emails. Working on the Larkspur invoice thread next, then the two hiring follow-ups. I'll ask before sending anything to investors.";

/** Splits the answer into word-sized chunks that land at uneven intervals, like a model stream. */
const chunks = answer.match(/\S+\s*/g) ?? [];

/**
 * Plays the answer once from mount, as if a model were writing it; the Replay button bumps `run`
 * to remount it, the same key trick the site demo uses.
 */
function LiveAnswer({ run, onDone }: { run: number; onDone: () => void }) {
  const [received, setReceived] = useState(1);

  useEffect(() => {
    let index = 1;
    let timer = setTimeout(function next() {
      index += 1 + Math.floor(Math.random() * 3);
      setReceived(Math.min(index, chunks.length));
      if (index < chunks.length) timer = setTimeout(next, 80 + Math.random() * 320);
      else onDone();
    }, 120);
    return () => clearTimeout(timer);
    // `run` remounts the answer through its key, so the effect only depends on `onDone`.
  }, [onDone]);

  return <StreamingText key={run} text={chunks.slice(0, received).join("")} streaming={received < chunks.length} />;
}

/** The site demo: a thinking pill, a live answer, tool steps and a work log. */
export default function AgentActivityDemo() {
  const [run, setRun] = useState(0);
  const [done, setDone] = useState(false);

  return (
    <view className="flex w-full flex-col p-4">
      <view className="flex w-full max-w-[340px] flex-col items-start gap-4">
        <ThinkingIndicator />
        <LiveAnswer run={run} onDone={() => setDone(true)} />
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
      </view>
    </view>
  );
}
