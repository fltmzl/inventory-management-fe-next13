import { Button, Link, Input, useDisclosure } from "@nextui-org/react";
import { useState, useMemo, useCallback } from "react";
import { columns } from "./data";
import { IoIosAdd } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import { api } from "@/utils/axios";
import { useSWRConfig } from "swr";
import toast from "react-hot-toast";
import useTable from "@/hooks/custom/useTable";
import DefaultCell from "@/shared/components/DefaultCell";
import DefaultActionCell from "@/shared/components/DefaultActionCell";
import ShowRows from "@/shared/components/ShowRows";
import FilterShowColumn from "@/shared/components/FilterShowColumn";
import FooterTable from "@/shared/components/FooterTable";
import DeleteModal from "@/pages/dashboard/inventories/components/Table/DeleteModal";
import TableData from "@/shared/components/TableData";

const INITIAL_VISIBLE_COLUMNS = ["kode", "nama", "actions"];

type CategoriesTableProps = {
  categories: Category[];
};

export default function CategoriesTable({ categories }: CategoriesTableProps) {
  const { mutate } = useSWRConfig();
  const table = useTable({
    columns: columns,
    data: categories,
    initialVisibleColumns: INITIAL_VISIBLE_COLUMNS,
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [itemToBeDeleted, setItemToBeDeleted] = useState("");

  const onOpenDeleteDialog = (id: string) => {
    setItemToBeDeleted(id);
    onOpen();
  };

  const onDeleteItem = useCallback(
    async (categoryId: string) => {
      try {
        const category = await api.delete(`/kategori/${categoryId}`);

        mutate("/kategori");

        toast.success("Kategori berhasil dihapus");
      } catch (err) {
        console.log(err);
        toast.error("Gagal menghapus kategori");
      }
    },
    [mutate],
  );

  const renderCell = useCallback(
    (category: Category, columnKey: React.Key) => {
      const cellValue = category[columnKey as keyof Category];

      switch (columnKey) {
        case "nama":
          return (
            <div>
              <p className="font-medium">{category.nama}</p>
            </div>
          );
        case "actions":
          return (
            <DefaultActionCell
              id={category.id}
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
              href="/dashboard/categories/add"
              color="primary"
              className="font-semibold w-fit"
              startContent={<IoIosAdd size={20} />}
            >
              Kategori
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
    return <FooterTable totalData={categories.length} table={table} />;
  }, [table, categories.length]);

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
