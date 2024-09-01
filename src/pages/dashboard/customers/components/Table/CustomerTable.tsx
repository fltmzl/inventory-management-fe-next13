"use client";

import React, { useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem, Chip, User, Pagination, Selection, ChipProps, SortDescriptor, Link } from "@nextui-org/react";
import { columns } from "./data";
import { MdOutlineEdit } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosAdd } from "react-icons/io";
import { IoChevronDownOutline } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import { BiColumns } from "react-icons/bi";
import { api } from "@/utils/axios";
import { toast } from "react-hot-toast";
import { useSWRConfig } from "swr";
import { useMediaQuery } from "@/hooks/custom/useMediaQuery";

const INITIAL_VISIBLE_COLUMNS = ["nama", "telepon", "email", "alamat", "actions"];

type CustomerTableProps = {
  customers: Customer[];
};

export default function CustomerTable({ customers }: CustomerTableProps) {
  const { mutate } = useSWRConfig();
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "nama",
    direction: "ascending",
  });

  const [page, setPage] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredCustomers = [...customers];

    if (hasSearchFilter) {
      filteredCustomers = filteredCustomers.filter((customer) => customer.nama.toLowerCase().includes(filterValue.toLowerCase()));
    }

    return filteredCustomers;
  }, [customers, filterValue, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: Customer, b: Customer) => {
      const first = a[sortDescriptor.column as keyof Customer];
      const second = b[sortDescriptor.column as keyof Customer];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const onDeleteItem = React.useCallback(
    async (customerId: string) => {
      try {
        const customer = await api.delete(`/pelanggan/${customerId}`);

        mutate("/pelanggan");

        toast.success("Data pelanggan berhasil dihapus");
      } catch (err) {
        console.log(err);
        toast.error("Gagal menghapus data");
      }
    },
    [mutate]
  );

  const renderCell = React.useCallback(
    (customer: Customer, columnKey: React.Key) => {
      const cellValue = customer[columnKey as keyof Customer];

      switch (columnKey) {
        case "nama":
          return (
            <div>
              <p className="font-medium">{customer.nama}</p>
              <p className="text-default-500 text-xs">{customer.email}</p>
            </div>
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
                    href={`/dashboard/customers/edit/${customer.id}`}
                    className="text-inherit"
                  >
                    Edit
                  </DropdownItem>
                  <DropdownItem startContent={<FaRegTrashAlt />} color="danger" onClick={() => onDeleteItem(customer.id)}>
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [onDeleteItem]
  );

  const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

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

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex flex-col lg:flex-row justify-between gap-3 items-center">
          <div className="flex justify-between items-center">
            <label className="flex items-center text-default-400 text-xs">
              Tampilkan
              <select className="bg-background ring-1 ring-gray-700 pl-1 pr-2 py-0.5 mx-2 text-default-400 text-small rounded-md" onChange={onRowsPerPageChange}>
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
                <Button isIconOnly={!isLargeScreen} endContent={isLargeScreen ? <IoChevronDownOutline className="text-small" /> : null} variant="flat">
                  <BiColumns />
                  <span className="hidden lg:block">Kolom</span>
                </Button>
              </DropdownTrigger>
              <DropdownMenu disallowEmptySelection aria-label="Table Columns" closeOnSelect={false} selectedKeys={visibleColumns} selectionMode="multiple" onSelectionChange={setVisibleColumns}>
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Button as={Link} href="/dashboard/customers/add" color="primary" className="font-semibold w-fit" startContent={<IoIosAdd size={20} />}>
              Pelanggan
            </Button>

            <Input
              isClearable
              radius="md"
              className="w-full sm:max-w-[44%]"
              classNames={{
                inputWrapper: "py-0 h-full",
              }}
              size="sm"
              placeholder="Cari berdasarkan nama"
              startContent={<FiSearch />}
              value={filterValue}
              onClear={() => onClear()}
              onValueChange={onSearchChange}
            />
          </div>
        </div>
      </div>
    );
  }, [filterValue, visibleColumns, onSearchChange, onRowsPerPageChange, isLargeScreen, onClear]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-8 px-8 flex justify-end items-center bg-background rounded-b-large">
        <span className="w-[30%] text-small text-default-400">Total data: {customers.length}</span>

        <div className="flex gap-2 items-center">
          <Pagination isCompact showControls showShadow color="primary" page={page} total={pages} onChange={setPage} />
        </div>
      </div>
    );
  }, [page, pages, customers.length]);

  return (
    <Table
      aria-label="customer table"
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
          <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"} allowsSorting={column.sortable}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"Nama pelanggan tidak ditemukan"} items={sortedItems}>
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
