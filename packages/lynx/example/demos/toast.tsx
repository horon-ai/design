import { Button } from "../../src/components/button";
import { Toaster, useToast, type ToastManager } from "../../src/components/toast";
import { Backdrop } from "./backdrop";

const copy = { title: "Saved", description: "The routine runs every morning at 8." };

type Surface = "solid" | "glass";

/** A button that raises the shared copy on the surface it sits on. */
function CopyButton({ surface, label, toast }: { surface: Surface; label: string; toast: ToastManager }) {
  return (
    <Button variant={surface === "glass" ? "glass" : "solid"} onClick={() => toast.add(copy)}>
      {label}
    </Button>
  );
}

/** The three rungs, then the three severities. */
function Examples({ surface }: { surface: Surface }) {
  const toast = useToast();
  return (
    <view className="flex w-full flex-col items-center gap-4">
      <view className="flex flex-row flex-wrap items-center justify-center gap-2">
        <CopyButton surface={surface} label="Small toast" toast={toast} />
        <CopyButton surface={surface} label="Default toast" toast={toast} />
        <CopyButton surface={surface} label="Large toast" toast={toast} />
      </view>
      <view className="flex flex-row flex-wrap gap-2">
        <CopyButton surface={surface} label="Neutral" toast={toast} />
        <Button
          variant={surface === "glass" ? "glass" : "solid"}
          onClick={() =>
            toast.add({ type: "success", title: "Sent to the team", description: "Q3 board deck v5 is in #board." })
          }
        >
          Success
        </Button>
        <Button
          variant={surface === "glass" ? "glass" : "solid"}
          onClick={() =>
            toast.add({
              type: "danger",
              title: "Couldn't reach Gmail",
              description: "Reconnect to keep Inbox Manager running.",
            })
          }
        >
          Danger
        </Button>
      </view>
    </view>
  );
}

/**
 * Solid on the page, glass on the sky. The queue is module state, so one `Toaster`
 * paints it once: the surface and size belong to that viewport, not to each button.
 */
export default function ToastDemo() {
  return (
    <view className="flex w-full flex-col gap-6 p-4">
      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Solid</text>
        <Toaster size="md" surface="solid">
          <Examples surface="solid" />
        </Toaster>
      </view>
      <view className="flex flex-col gap-3">
        <text className="text-caption text-text-secondary">Glass</text>
        <Backdrop className="flex-col">
          <Toaster size="md" surface="glass">
            <Examples surface="glass" />
          </Toaster>
        </Backdrop>
      </view>
    </view>
  );
}
