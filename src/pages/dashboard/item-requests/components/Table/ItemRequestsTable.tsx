import { Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem, Link, Input, Chip } from "@nextui-org/react";
import { useState, useMemo, useCallback } from "react";
import { columns } from "./data";
import { MdOutlineEdit } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosAdd } from "react-icons/io";
import { IoChevronDownOutline } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import { BiColumns } from "react-icons/bi";
import { api } from "@/utils/axios";
import { useSWRConfig } from "swr";
import toast from "react-hot-toast";
import { useMediaQuery } from "@/hooks/custom/useMediaQuery";
import useTable from "@/hooks/custom/useTable";
import { ISODateToLocal } from "@/utils/dateTime";

const INITIAL_VISIBLE_COLUMNS = ["id", "barang", "pelanggan", "pegawai", "permintaanTerpenuhi", "tanggal", "actions"];

type TransactionsTableProps = {
  itemRequests: ItemRequests[];
};

export default function ItemRequestsTable({ itemRequests }: TransactionsTableProps) {
  const { mutate } = useSWRConfig();
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const { headerColumns, page, setPage, pages, selectedKeys, setSelectedKeys, sortDescriptor, setSortDescriptor, sortedItems, onClear, onRowsPerPageChange, filterValue, onSearchChange, visibleColumns, setVisibleColumns } = useTable({
    columns: columns,
    data: itemRequests,
    initialVisibleColumns: INITIAL_VISIBLE_COLUMNS,
    columnToSearch: "id",
  });

  const onDeleteItem = useCallback(
    async (inventoryId: string) => {
      try {
        const inventory = await api.delete(`/barang/${inventoryId}`);

        mutate("/barang");

        toast.success("Barang berhasil dihapus");
      } catch (err) {
        console.log(err);
        toast.error("Gagal menghapus barang");
      }
    },
    [mutate]
  );

  type cellValueType = string | number | object | boolean;

  const renderCell = useCallback(
    (itemRequest: ItemRequests, columnKey: React.Key) => {
      const cellValue: cellValueType = itemRequest[columnKey as keyof ItemRequests];

      switch (columnKey) {
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
                    href={`/dashboard/item-requests/edit/${itemRequest.id}`}
                    className="text-inherit"
                  >
                    Edit
                  </DropdownItem>
                  <DropdownItem startContent={<FaRegTrashAlt />} color="danger" onClick={() => onDeleteItem(itemRequest.id)}>
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        case "barang":
          return (
            <div>
              {itemRequest.barang.map((barangItem) => (
                <p key={barangItem.id}>{`${barangItem.nama} / ${barangItem.jumlah} ${barangItem.satuan}`}</p>
              ))}
            </div>
          );
        case "tanggal":
          return <p>{ISODateToLocal(itemRequest.tanggal)}</p>;
        case "pegawai":
          return <p>{itemRequest.pegawai.namaLengkap}</p>;
        case "pelanggan":
          return <p>{itemRequest.pelanggan.nama}</p>;
        case "permintaanTerpenuhi":
          return (
            <div>
              {itemRequest.permintaanTerpenuhi ? (
                <Chip variant="flat" color="success">
                  Terpenuhi
                </Chip>
              ) : (
                <Chip variant="flat" color="warning">
                  Belum Terpenuhi
                </Chip>
              )}
            </div>
          );
        default:
          if (typeof cellValue === "object") {
            return cellValue.nama;
          }
          return cellValue;
        // return `Kosong ${typ/eof cellValue}`;
      }
    },
    [onDeleteItem]
  );

  const topContent = useMemo(() => {
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

            <Button as={Link} href="/dashboard/item-requests/add" color="primary" className="font-semibold w-fit" startContent={<IoIosAdd size={20} />}>
              Permintaan Barang
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
  }, [filterValue, visibleColumns, onSearchChange, onRowsPerPageChange, isLargeScreen, onClear, setVisibleColumns]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-8 px-8 flex justify-end items-center bg-background rounded-b-large">
        <span className="w-[30%] text-small text-default-400">Total data: {itemRequests.length}</span>

        <div className="flex gap-2 items-center">
          <Pagination isCompact showControls showShadow color="primary" page={page} total={pages} onChange={setPage} />
        </div>
      </div>
    );
  }, [page, pages, itemRequests.length, setPage]);

  return (
    <Table
      aria-label="item requests table"
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
      <TableBody emptyContent={"Permintaan barang tidak ditemukan"} items={sortedItems}>
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
