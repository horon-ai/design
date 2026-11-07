import { Button, Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from "@horon-ai/react";

import { Backdrop } from "../../demo-backdrop";

export default function DialogSurfaces() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Dialog>
        <DialogTrigger render={<Button variant="solid" />}>Delete bot</DialogTrigger>
        <DialogContent
          surface="solid"
          title="Delete Inbox Manager?"
          description="Its routines and memory are removed. Messages it already sent stay in your inbox."
        >
          <DialogFooter>
            <DialogClose render={<Button variant="solid" />}>Cancel</DialogClose>
            <DialogClose render={<Button variant="danger" />}>Delete bot</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Backdrop className="flex-col">
        <Dialog>
          <DialogTrigger render={<Button variant="glass" />}>Delete bot</DialogTrigger>
          <DialogContent
            surface="glass"
            title="Delete Inbox Manager?"
            description="Its routines and memory are removed. Messages it already sent stay in your inbox."
          >
            <DialogFooter>
              <DialogClose render={<Button variant="glass" />}>Cancel</DialogClose>
              <DialogClose render={<Button variant="danger" />}>Delete bot</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Backdrop>
    </div>
  );
}
