import useTable from "@/hooks/custom/useTable";
import DeleteModal from "@/sections/dashboard/inventories/components/Table/DeleteModal";
import DefaultActionCell from "@/shared/components/DefaultActionCell";
import DefaultCell from "@/shared/components/DefaultCell";
import FilterShowColumn from "@/shared/components/FilterShowColumn";
import FooterTable from "@/shared/components/FooterTable";
import ShowRows from "@/shared/components/ShowRows";
import TableData from "@/shared/components/TableData";
import { columns } from "@/tables/itemRequest.table";
import { api } from "@/utils/axios";
import { ISODateToLocal } from "@/utils/dateTime";
import { Button, Chip, Input, Link, useDisclosure } from "@nextui-org/react";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FiSearch } from "react-icons/fi";
import { IoIosAdd } from "react-icons/io";
import { useSWRConfig } from "swr";

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "barang",
  "pelanggan",
  "pegawai",
  "permintaanTerpenuhi",
  "tanggal",
  "actions",
];

type TransactionsTableProps = {
  itemRequests: ItemRequest[];
};

export default function ItemRequestsTable({
  itemRequests,
}: TransactionsTableProps) {
  const { mutate } = useSWRConfig();
  const table = useTable({
    columns: columns,
    data: itemRequests,
    initialVisibleColumns: INITIAL_VISIBLE_COLUMNS,
  });
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [itemToBeDeleted, setItemToBeDeleted] = useState("");

  const onOpenDeleteDialog = (id: string) => {
    setItemToBeDeleted(id);
    onOpen();
  };

  const onDeleteItem = useCallback(
    async (inventoryId: string) => {
      try {
        const inventory = await api.delete(`/permintaan-barang/${inventoryId}`);

        mutate("/permintaan-barang");

        toast.success("Permintaan Barang dihapus");
        onClose();
      } catch (err) {
        console.log(err);
        toast.error("Gagal menghapus permintaan barang");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mutate],
  );

  type cellValueType = string | number | object | boolean;

  const renderCell = useCallback(
    (itemRequest: ItemRequest, columnKey: React.Key) => {
      const cellValue: cellValueType =
        itemRequest[columnKey as keyof ItemRequest];

      switch (columnKey) {
        case "barang":
          return (
            <div>
              {itemRequest.barang.map((barangItem) => (
                <p
                  key={barangItem.id}
                >{`${barangItem.nama} / ${barangItem.jumlah} ${barangItem.satuan}`}</p>
              ))}
            </div>
          );
        case "tanggal":
          return <p>{ISODateToLocal(itemRequest.tanggal)}</p>;
        case "createdAt":
          return <p>{ISODateToLocal(itemRequest.createdAt)}</p>;
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
        case "actions":
          return (
            <DefaultActionCell
              id={itemRequest.id}
              canEdit={true}
              onOpenDeleteDialog={onOpenDeleteDialog}
            />
          );
        default:
          return <DefaultCell value={cellValue as string} />;
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onDeleteItem],
  );

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex flex-col lg:flex-row justify-between gap-3 items-center">
          <ShowRows table={table} />

          <div className="flex-1 flex justify-end gap-3">
            <FilterShowColumn table={table} columns={columns} />

            <Button
              as={Link}
              href="/dashboard/item-requests/add"
              color="primary"
              className="font-semibold w-fit"
              startContent={<IoIosAdd size={20} />}
            >
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
              value={table.filterValue}
              onClear={() => table.onClear()}
              onValueChange={table.onSearchChange}
            />
          </div>
        </div>
      </div>
    );
  }, [table]);

  const bottomContent = useMemo(() => {
    return <FooterTable totalData={itemRequests.length} table={table} />;
  }, [table, itemRequests.length]);

  return (
    <>
      <TableData
        table={table}
        topContent={topContent}
        bottomContent={bottomContent}
        renderCell={renderCell}
        emptyTableContentMessage="Permintaan Barang tidak ditemukan"
      />

      <DeleteModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Hapus Data Permintaan Barang"
        desc="Apakah Anda yakin ingin menghapus data ini? Data akan dihapus secara permanen"
        itemIdToBeDeleted={itemToBeDeleted}
        onDelete={onDeleteItem}
      />
    </>
  );
}
