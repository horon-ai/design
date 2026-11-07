import { Button, Modal, ModalClose, ModalContent, ModalFooter, ModalTrigger } from "@horon-ai/react";

import { Backdrop } from "../../demo-backdrop";

export default function ModalSurfaces() {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Modal>
        <ModalTrigger render={<Button variant="solid" />}>Edit bot</ModalTrigger>
        <ModalContent
          surface="solid"
          title="Edit Inbox Manager"
          description="Changes apply from the next run."
          footer={
            <ModalFooter>
              <ModalClose render={<Button variant="solid" />}>Cancel</ModalClose>
              <ModalClose render={<Button />}>Save changes</ModalClose>
            </ModalFooter>
          }
        >
          <p>The opaque page fill with a soft drop shadow.</p>
        </ModalContent>
      </Modal>

      <Backdrop className="flex-col">
        <Modal>
          <ModalTrigger render={<Button variant="glass" />}>Edit bot</ModalTrigger>
          <ModalContent
            surface="glass"
            title="Edit Inbox Manager"
            description="Changes apply from the next run."
            footer={
              <ModalFooter>
                <ModalClose render={<Button variant="glass" />}>Cancel</ModalClose>
                <ModalClose render={<Button />}>Save changes</ModalClose>
              </ModalFooter>
            }
          >
            <p>The veil material, for a window over content.</p>
          </ModalContent>
        </Modal>
      </Backdrop>
    </div>
  );
}
