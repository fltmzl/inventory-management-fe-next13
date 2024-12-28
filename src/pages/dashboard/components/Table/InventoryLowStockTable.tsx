import {
  Button,
  Link,
  Input,
  useDisclosure,
  Select,
  SelectItem,
} from "@nextui-org/react";
import React, { useState, useMemo, useCallback } from "react";
import { IoIosAdd } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import { api } from "@/utils/axios";
import { useSWRConfig } from "swr";
import toast from "react-hot-toast";
import useTable from "@/hooks/custom/useTable";
import DefaultCell from "@/shared/components/DefaultCell";
import DefaultActionCell from "@/shared/components/DefaultActionCell";
import { formatToRupiah } from "@/utils/formatToRupiah";
import ShowRows from "@/shared/components/ShowRows";
import FilterShowColumn from "@/shared/components/FilterShowColumn";
import FooterTable from "@/shared/components/FooterTable";
import TableData from "@/shared/components/TableData";
import { ISODateToLocal } from "@/utils/dateTime";
import DeleteModal from "../../inventories/components/Table/DeleteModal";
import { columns } from "@/tables/inventoryLowStock.table";

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
  inventories: DashboardItemsLowStock[];
  setMaxLowStock: React.Dispatch<React.SetStateAction<number>>;
  maxLowStock: number;
};

export default function InventoryLowStockTable({
  inventories,
  setMaxLowStock,
  maxLowStock,
}: CategoriesTableProps) {
  const { mutate } = useSWRConfig();
  const table = useTable({
    columns: columns,
    data: inventories,
    initialVisibleColumns: INITIAL_VISIBLE_COLUMNS,
    initialRowsPerPage: 50,
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
        const inventory = await api.delete(`/barang/${inventoryId}`);

        mutate("/barang");

        toast.success("Barang berhasil dihapus");
        onClose();
      } catch (err) {
        console.log(err);
        toast.error("Gagal menghapus barang");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mutate],
  );

  const renderCell = useCallback(
    (inventory: DashboardItemsLowStock, columnKey: React.Key) => {
      const cellValue = inventory[columnKey as keyof DashboardItemsLowStock];

      switch (columnKey) {
        case "nama":
          return <DefaultCell className="font-medium" value={inventory.nama} />;
        case "satuan":
          return <DefaultCell value={inventory.satuan} />;
        case "harga":
          return (
            <DefaultCell value={"Rp " + formatToRupiah(inventory.harga)} />
          );
        case "nomorLot":
          const nomorLots = inventory.nomorLot.join("\n ");
          return <DefaultCell value={nomorLots} />;
        case "pembelianTerakhir":
          return (
            <DefaultCell value={ISODateToLocal(inventory.pembelianTerakhir)} />
          );
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onDeleteItem],
  );

  const maxStockSelectItems = useMemo(() => {
    return [
      {
        id: 2,
        label: "2",
        defaultSelected: true,
      },
      {
        id: 5,
        label: "5",
        defaultSelected: false,
      },
      {
        id: 10,
        label: "10",
        defaultSelected: false,
      },
    ];
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex justify-between gap-5">
        <h1 className="text-2xl font-semibold mb-5">Stok Menipis</h1>

        <div className="flex justify-between items-center">
          <label className="flex items-center text-default-600 text-sm font-semibold">
            Maks Stok
            <select
              className="bg-background ring-1 ring-gray-400 pl-1 pr-2 py-0.5 mx-2 text-default-400 text-small rounded-md"
              onChange={(e) => {
                setMaxLowStock(Number(e.target.value));
              }}
              defaultValue={10}
              value={maxLowStock}
            >
              {maxStockSelectItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    );

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        emptyTableContentMessage="Barang tidak ditemukan"
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
