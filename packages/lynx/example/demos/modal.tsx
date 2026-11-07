import { Button } from "../../src/components/button";
import { Input } from "../../src/components/input";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalFooter,
  ModalTrigger,
  type ModalSurface,
} from "../../src/components/modal";
import { Backdrop } from "./backdrop";

/** The form modal: a name field and a short body, closed by its footer actions. */
function EditBot({ surface }: { surface: ModalSurface }) {
  const buttonVariant = surface === "glass" ? "glass" : "solid";
  return (
    <Modal>
      <ModalTrigger render={<Button variant={buttonVariant} />}>Edit bot</ModalTrigger>
      <ModalContent
        surface={surface}
        title="Edit Inbox Manager"
        description="Changes apply from the next run."
        footer={
          <ModalFooter>
            <ModalClose render={<Button variant={buttonVariant} />}>Cancel</ModalClose>
            <ModalClose render={<Button variant="primary" />}>Save changes</ModalClose>
          </ModalFooter>
        }
      >
        <view className="flex w-full flex-col gap-4">
          <text className="text-label-md text-text-primary">Name</text>
          <Input surface={surface} className="w-full" defaultValue="Inbox Manager" />
          <text className="text-body-sm text-text-secondary">Plain language works best.</text>
        </view>
      </ModalContent>
    </Modal>
  );
}

/** A wide modal whose body is taller than the viewport, so the body scrolls and the footer stays put. */
function Terms() {
  return (
    <Modal>
      <ModalTrigger render={<Button variant="solid" />}>Long content</ModalTrigger>
      <ModalContent
        size="lg"
        title="Workspace data policy"
        description="The body scrolls; the header and the actions stay put."
        footer={
          <ModalFooter>
            <ModalClose render={<Button variant="solid" />}>Decline</ModalClose>
            <ModalClose render={<Button variant="primary" />}>Accept</ModalClose>
          </ModalFooter>
        }
      >
        <view className="flex w-full flex-col gap-3">
          {Array.from({ length: 14 }, (_, index) => (
            <text key={index} className="text-body-md text-text-secondary">
              {`${index + 1}. Bots read only the sources you connect. Drafts stay in your workspace until you approve them, and every action a bot takes is written to the activity log you can export at any time.`}
            </text>
          ))}
        </view>
      </ModalContent>
    </Modal>
  );
}

/** Solid on the page, glass on the sky; the long body proves the scrolling middle. */
export default function ModalDemo() {
  return (
    <view className="flex w-full flex-col gap-6 p-4">
      <view className="flex flex-col items-center gap-4">
        <text className="text-caption text-text-secondary">Solid</text>
        <view className="flex flex-row flex-wrap items-center justify-center gap-3">
          <EditBot surface="solid" />
          <Terms />
        </view>
      </view>
      <Backdrop className="flex-col">
        <text className="text-caption text-text-secondary">Glass</text>
        <EditBot surface="glass" />
      </Backdrop>
    </view>
  );
}
