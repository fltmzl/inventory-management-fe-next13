import { useMediaQuery } from "@/hooks/custom/useMediaQuery";
import { HeaderColumn, Table } from "@/hooks/custom/useTable";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import React from "react";
import { BiColumns } from "react-icons/bi";
import { IoChevronDownOutline } from "react-icons/io5";

type Props<TData> = {
  table: Table<TData>;
  columns: HeaderColumn[];
};

export default function FilterShowColumn<TData>({
  table,
  columns,
}: Props<TData>) {
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  return (
    <Dropdown>
      <DropdownTrigger className="hidden sm:flex">
        <Button
          isIconOnly={!isLargeScreen}
          endContent={
            isLargeScreen ? (
              <IoChevronDownOutline className="text-small" />
            ) : null
          }
          variant="flat"
        >
          <BiColumns />
          <span className="hidden lg:block">Kolom</span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection
        aria-label="Table Columns"
        closeOnSelect={false}
        selectedKeys={table.visibleColumns}
        selectionMode="multiple"
        onSelectionChange={table.setVisibleColumns}
      >
        {columns.map((column) => (
          <DropdownItem key={column.uid} className="capitalize">
            {column.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
