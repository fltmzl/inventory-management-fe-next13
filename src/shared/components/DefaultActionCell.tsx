import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
} from "@nextui-org/react";
import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";

type Props = {
  id: string;
  onOpenDeleteDialog: (id: string) => void;
};

export default function DefaultActionCell({ id, onOpenDeleteDialog }: Props) {
  return (
    <div className="relative flex justify-end items-center gap-2">
      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly size="sm" variant="light">
            <BsThreeDotsVertical size={20} className="text-default-300" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem
            classNames={{
              base: "bg-blue-400",
              wrapper: "bg-red-600",
            }}
            startContent={<MdOutlineEdit />}
            as={Link}
            href={`edit/${id}`}
            className="text-inherit"
          >
            Edit
          </DropdownItem>
          <DropdownItem
            startContent={<FaRegTrashAlt />}
            color="danger"
            // onPress={onOpen}
            onClick={() => onOpenDeleteDialog(id)}
          >
            Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
