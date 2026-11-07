import { Button, Modal, ModalClose, ModalContent, ModalFooter, ModalTrigger } from "@horon-ai/react";

export default function ModalLongBody() {
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
            <ModalClose render={<Button />}>Accept</ModalClose>
          </ModalFooter>
        }
      >
        <div className="flex flex-col gap-3 text-text-secondary">
          {Array.from({ length: 14 }, (_, index) => (
            <p key={index}>
              {index + 1}. Bots read only the sources you connect. Drafts stay in your workspace until you approve them,
              and every action a bot takes is written to the activity log you can export at any time.
            </p>
          ))}
        </div>
      </ModalContent>
    </Modal>
  );
}
