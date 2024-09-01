import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import React from "react";

type DeleteModalProps = {
  isOpen: boolean;
  onOpenChange: () => void;
  onDelete: (id: string) => void;
  title: string;
  desc: string;
  itemIdToBeDeleted: string;
};

export default function DeleteModal({
  isOpen,
  onOpenChange,
  onDelete,
  title = "Modal Title",
  desc = "Deskripsi",
  itemIdToBeDeleted,
}: DeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>
              <p>{desc}</p>
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="light" onPress={onClose}>
                Batal
              </Button>
              <Button
                color="danger"
                variant="solid"
                className="font-bold"
                onPress={() => onDelete(itemIdToBeDeleted)}
              >
                Hapus
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
