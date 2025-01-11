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
import { useRouter } from "next/router";
import { twMerge } from "tailwind-merge";

type Props = {
  id: string;
  canEdit?: boolean;
  canDelete?: boolean;
  onOpenDeleteDialog: (id: string) => void;
};

export default function DefaultActionCell({
  id,
  canEdit = true,
  canDelete = true,
  onOpenDeleteDialog,
}: Props) {
  const router = useRouter();
  const pathname = router.pathname;

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
            href={`${pathname}/edit/${id}`}
            className={twMerge("text-inherit", !canEdit && "hidden")}
          >
            Edit
          </DropdownItem>
          <DropdownItem
            startContent={<FaRegTrashAlt />}
            color="danger"
            // onPress={onOpen}
            onClick={() => onOpenDeleteDialog(id)}
            className={twMerge(!canDelete && "hidden")}
          >
            Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
