import {
  Button,
  Field,
  FieldDescription,
  FieldLabel,
  Input,
  Modal,
  ModalClose,
  ModalContent,
  ModalFooter,
  ModalTrigger,
  type ModalSurface,
  Textarea,
} from "@horon-ai/react";

import { Backdrop } from "../demo-backdrop";

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
        <div className="flex flex-col gap-4">
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input surface={surface} className="w-full" defaultValue="Inbox Manager" />
          </Field>
          <Field>
            <FieldLabel>Instructions</FieldLabel>
            <Textarea
              surface={surface}
              className="w-full"
              rows={5}
              defaultValue="Sort new mail every morning. Draft replies for anything that needs me, and ask before sending to investors."
            />
            <FieldDescription>Plain language works best.</FieldDescription>
          </Field>
        </div>
      </ModalContent>
    </Modal>
  );
}

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
        <div className="flex flex-col gap-3 text-text-secondary">
          {Array.from({ length: 14 }, (_, i) => (
            <p key={i}>
              {i + 1}. Bots read only the sources you connect. Drafts stay in your workspace until you approve them, and
              every action a bot takes is written to the activity log you can export at any time.
            </p>
          ))}
        </div>
      </ModalContent>
    </Modal>
  );
}

export default function ModalDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col items-center gap-4">
        <p className="text-caption text-text-secondary">Solid</p>
        <div className="flex flex-wrap justify-center gap-3">
          <EditBot surface="solid" />
          <Terms />
        </div>
      </div>
      <Backdrop className="flex-col">
        <p className="text-caption text-text-secondary">Glass</p>
        <EditBot surface="glass" />
      </Backdrop>
    </div>
  );
}
