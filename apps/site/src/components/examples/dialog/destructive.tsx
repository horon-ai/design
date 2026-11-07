import { Button, Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from "@horon-ai/react";

export default function DialogDestructive() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="danger" />}>Delete bot</DialogTrigger>
      <DialogContent
        title="Delete Inbox Manager?"
        description="Its routines and memory are removed. Messages it already sent stay in your inbox."
      >
        <DialogFooter>
          <DialogClose render={<Button variant="solid" />}>Cancel</DialogClose>
          <DialogClose render={<Button variant="danger" />}>Delete bot</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
