import { Button } from "../../src/components/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from "../../src/components/dialog";
import { Backdrop } from "./backdrop";

/** One dialog per surface; the trigger is the Button react's `render` prop turned into a trigger. */
function Example({ surface }: { surface: "solid" | "glass" }) {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant={surface === "glass" ? "glass" : "solid"} />}>Delete bot</DialogTrigger>
      <DialogContent
        surface={surface}
        title="Delete Inbox Manager?"
        description="Its routines and memory are removed. Messages it already sent stay in your inbox."
      >
        <DialogFooter>
          <DialogClose render={<Button variant={surface === "glass" ? "glass" : "solid"} />}>Cancel</DialogClose>
          <DialogClose render={<Button variant="danger" />}>Delete bot</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Solid on the page, glass on the sky: the two surfaces the site demo shows. */
export default function DialogDemo() {
  return (
    <view className="flex w-full flex-col gap-6 p-4">
      <view className="flex flex-col items-center gap-4">
        <text className="text-caption text-text-secondary">Solid</text>
        <Example surface="solid" />
      </view>
      <Backdrop className="flex-col">
        <text className="text-caption text-text-secondary">Glass</text>
        <Example surface="glass" />
      </Backdrop>
    </view>
  );
}
