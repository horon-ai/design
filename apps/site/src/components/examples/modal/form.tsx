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
  Textarea,
} from "@horon-ai/react";

export default function ModalForm() {
  return (
    <Modal>
      <ModalTrigger render={<Button variant="solid" />}>Edit bot</ModalTrigger>
      <ModalContent
        title="Edit Inbox Manager"
        description="Changes apply from the next run."
        footer={
          <ModalFooter>
            <ModalClose render={<Button variant="solid" />}>Cancel</ModalClose>
            <ModalClose render={<Button />}>Save changes</ModalClose>
          </ModalFooter>
        }
      >
        <div className="flex flex-col gap-4">
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input className="w-full" defaultValue="Inbox Manager" />
          </Field>
          <Field>
            <FieldLabel>Instructions</FieldLabel>
            <Textarea
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
