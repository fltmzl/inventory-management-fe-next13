import { Button, Link, Input, useDisclosure } from "@nextui-org/react";
import { useState, useMemo, useCallback } from "react";
import { columns } from "./data";
import { IoIosAdd } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import { api } from "@/utils/axios";
import { useSWRConfig } from "swr";
import toast from "react-hot-toast";
import { useMediaQuery } from "@/hooks/custom/useMediaQuery";
import useTable from "@/hooks/custom/useTable";
import DeleteModal from "./DeleteModal";
import DefaultCell from "@/shared/components/DefaultCell";
import DefaultActionCell from "@/shared/components/DefaultActionCell";
import { formatToRupiah } from "@/utils/formatToRupiah";
import ShowRows from "@/shared/components/ShowRows";
import FilterShowColumn from "@/shared/components/FilterShowColumn";
import FooterTable from "@/shared/components/FooterTable";
import TableData from "@/shared/components/TableData";

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "nama",
  "stok",
  "harga",
  "kategori",
  "satuan",
  "actions",
];

type CategoriesTableProps = {
  inventories: Inventory[];
};

export default function InventoriesTable({
  inventories,
}: CategoriesTableProps) {
  const { mutate } = useSWRConfig();
  const table = useTable({
    columns: columns,
    data: inventories,
    initialVisibleColumns: INITIAL_VISIBLE_COLUMNS,
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [itemToBeDeleted, setItemToBeDeleted] = useState("");

  const onOpenDeleteDialog = (id: string) => {
    setItemToBeDeleted(id);
    onOpen();
  };

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
    [mutate],
  );

  const renderCell = useCallback(
    (inventory: Inventory, columnKey: React.Key) => {
      const cellValue = inventory[columnKey as keyof Inventory];

      switch (columnKey) {
        case "nama":
          return <DefaultCell className="font-medium" value={inventory.nama} />;
        case "kategori":
          return <DefaultCell value={inventory.kategori.nama} />;
        case "satuan":
          return <DefaultCell value={inventory.satuan.nama} />;
        case "harga":
          return (
            <DefaultCell value={"Rp " + formatToRupiah(inventory.harga)} />
          );
        case "nomorLot":
          const nomorLots = inventory.nomorLot.join(", ");
          return <DefaultCell value={nomorLots} />;
        case "actions":
          return (
            <DefaultActionCell
              id={inventory.id}
              onOpenDeleteDialog={onOpenDeleteDialog}
            />
          );
        default:
          return <DefaultCell value={cellValue as string} />;
      }
    },
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
              href="/dashboard/inventories/add"
              color="primary"
              className="font-semibold w-fit"
              startContent={<IoIosAdd size={20} />}
            >
              Barang
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
    return <FooterTable totalData={inventories.length} table={table} />;
  }, [table, inventories.length]);

  return (
    <>
      <TableData
        table={table}
        topContent={topContent}
        bottomContent={bottomContent}
        renderCell={renderCell}
        emptyTableContentMessage="Barang tidak ditemukan "
      />

      <DeleteModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Hapus Data Barang"
        desc="Apakah Anda yakin ingin menghapus data barang ini? Data akan dihapus secara permanen"
        itemIdToBeDeleted={itemToBeDeleted}
        onDelete={onDeleteItem}
      />
    </>
  );
}
