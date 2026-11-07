import { Button, Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from "@horon-ai/react";

export default function DialogActions() {
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-3">
      <Dialog>
        <DialogTrigger render={<Button variant="solid" />}>Rename bot</DialogTrigger>
        <DialogContent title="Rename bot?" description="The new name shows up everywhere the bot is mentioned.">
          <DialogFooter>
            <DialogClose render={<Button variant="solid" />}>Cancel</DialogClose>
            <DialogClose render={<Button />}>Save</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger render={<Button variant="solid" />}>Archive bot</DialogTrigger>
        <DialogContent
          title="Archive Inbox Manager?"
          description="It stops answering and disappears from the bot list. You can restore it for 30 days."
          closeLabel={null}
        >
          <DialogFooter>
            <DialogClose render={<Button variant="solid" />}>Cancel</DialogClose>
            <DialogClose render={<Button />}>Archive</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
