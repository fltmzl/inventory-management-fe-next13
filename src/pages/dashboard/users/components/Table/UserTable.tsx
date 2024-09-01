"use client";

import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
  Link,
} from "@nextui-org/react";
import { MdOutlineEdit } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosAdd } from "react-icons/io";
import { columns } from "./data";
import { IoChevronDownOutline } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import { api } from "@/utils/axios";
import { toast } from "react-hot-toast";
import { useSWRConfig } from "swr";
import { useMediaQuery } from "@/hooks/custom/useMediaQuery";
import { BiColumns } from "react-icons/bi";

const statusColorMap: Record<string, ChipProps["color"]> = {
  ADMIN: "success",
  OWNER: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
  "namaLengkap",
  "username",
  "email",
  "role",
  "actions",
];

type UserTableProps = {
  users: User[];
};

export default function UserTable({ users }: UserTableProps) {
  const { mutate } = useSWRConfig();
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "namaLengkap",
    direction: "ascending",
  });

  const [page, setPage] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.namaLengkap.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredUsers;
  }, [users, filterValue, statusFilter, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: User, b: User) => {
      const first = a[sortDescriptor.column as keyof User];
      const second = b[sortDescriptor.column as keyof User];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((user: User, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof User];

    switch (columnKey) {
      case "namaLengkap":
        return (
          <User
            avatarProps={{ radius: "lg", src: user.foto }}
            description={user.email}
            name={cellValue}
          >
            {user.email}
          </User>
        );
      case "role":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[user.role]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "actions":
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
                  href={`/dashboard/users/edit/${user.id}`}
                  className="text-inherit"
                >
                  Edit
                </DropdownItem>
                <DropdownItem
                  startContent={<FaRegTrashAlt />}
                  color="danger"
                  onClick={() => onDeleteItem(user.id)}
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const onDeleteItem = async (userId: string) => {
    try {
      const user = await api.delete(`/pegawai/${userId}`);

      mutate("/pegawai");

      toast.success("Data karyawan berhasil dihapus");
    } catch (err) {
      console.log(err);
      toast.error("Gagal menghapus data");
    }
  };

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex flex-col lg:flex-row justify-between gap-3 items-center">
          <div className="flex justify-between items-center">
            {/* <span className="text-default-400 text-small">Total {users.length} users</span> */}
            <label className="flex items-center text-default-400 text-xs">
              Tampilkan
              <select
                className="bg-background ring-1 ring-gray-700 pl-1 pr-2 py-0.5 mx-2 text-default-400 text-small rounded-md"
                onChange={onRowsPerPageChange}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
              </select>
              data
            </label>
          </div>

          <div className="flex-1 flex justify-end gap-3">
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
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Button
              as={Link}
              href="/dashboard/users/add"
              color="primary"
              className="font-semibold w-fit"
              startContent={<IoIosAdd size={20} />}
            >
              Karyawan
            </Button>
            {/* <Link href="/dashboard/users/add">Test</Link> */}

            <Input
              isClearable
              radius="md"
              className="w-full sm:max-w-[44%]"
              classNames={{
                inputWrapper: "py-0 h-full",
              }}
              size="sm"
              placeholder="Search by name..."
              startContent={<FiSearch />}
              value={filterValue}
              onClear={() => onClear()}
              onValueChange={onSearchChange}
            />
          </div>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    isLargeScreen,
    onClear,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-8 px-8 flex justify-end items-center bg-background rounded-b-large">
        <span className="w-[30%] text-small text-default-400">
          Total data: {users.length}
        </span>

        <div className="flex gap-2 items-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={pages}
            onChange={setPage}
          />
        </div>
      </div>
    );
  }, [page, pages, users.length, setPage]);

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      className="gap-0"
      classNames={{
        wrapper: "max-h-[382px] bg-background rounded-b-none shadow-none",
      }}
      selectedKeys={selectedKeys}
      selectionMode="none"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No users found"} items={sortedItems}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => {
              return <TableCell>{renderCell(item, columnKey)}</TableCell>;
            }}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
