import { Button, Modal, ModalClose, ModalContent, ModalFooter, ModalTrigger } from "@horon-ai/react";

const sizes = ["sm", "md", "lg"] as const;

export default function ModalSizes() {
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-3">
      {sizes.map((size) => (
        <Modal key={size}>
          <ModalTrigger render={<Button variant="solid" />}>Open {size}</ModalTrigger>
          <ModalContent
            size={size}
            title={`${size.toUpperCase()} window`}
            description="The window stops at its width step and the gutters cap it on a narrow screen."
            footer={
              <ModalFooter>
                <ModalClose render={<Button variant="solid" />}>Close</ModalClose>
              </ModalFooter>
            }
          >
            <p>Width follows the size step: sm 400px, md 560px, lg 720px.</p>
          </ModalContent>
        </Modal>
      ))}
    </div>
  );
}
