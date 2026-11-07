import { Button, Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from "@horon-ai/react";
import { Trash } from "@phosphor-icons/react";

export default function DialogLeading() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="solid" />}>Delete bot</DialogTrigger>
      <DialogContent
        title="Delete Inbox Manager?"
        description="Its routines and memory are removed. Messages it already sent stay in your inbox."
        leading={
          <span className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-interactive-danger text-text-inverse">
            <Trash className="size-4.5" />
          </span>
        }
      >
        <DialogFooter>
          <DialogClose render={<Button variant="solid" />}>Cancel</DialogClose>
          <DialogClose render={<Button variant="danger" />}>Delete bot</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
