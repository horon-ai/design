import { EmptyState } from "../../src/components/empty-state";

/** A 140px square illustration slot drawn with a plain sky fill, so the gallery needs no remote asset. */
function Mascot() {
  return <view className="flex size-[140px] items-center justify-center rounded-full bg-sky-100" />;
}

/**
 * Three empty states: a full one, one without an illustration slot override and
 * one without an action, which is how the component is dropped into a smaller area.
 */
export default function EmptyStateDemo() {
  return (
    <view className="flex flex-row flex-wrap items-start justify-center gap-6 p-4">
      <EmptyState
        illustration={<Mascot />}
        title="Meet your first bot"
        description="Give it a role and a task. It keeps working after you close the laptop."
        action={
          <view className="rounded-md bg-interactive-primary px-4 py-2" accessibility-element accessibility-traits="button">
            <text className="text-label-lg text-text-inverse">Create a bot</text>
          </view>
        }
      />
      <EmptyState
        illustration={<Mascot />}
        title="Nothing matches"
        description="Try another name or clear the filter."
        action={
          <view className="rounded-md bg-interactive-primary px-4 py-2" accessibility-element accessibility-traits="button">
            <text className="text-label-lg text-text-inverse">Clear filter</text>
          </view>
        }
      />
      <EmptyState title="Nothing here yet" description="Bots you create will show up in this list." />
    </view>
  );
}
