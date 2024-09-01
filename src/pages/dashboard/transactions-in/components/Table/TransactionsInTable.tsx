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
import { ISODateToLocal } from "@/utils/dateTime";
import { formatToRupiah } from "@/utils/formatToRupiah";
import DefaultActionCell from "@/shared/components/DefaultActionCell";
import DefaultCell from "@/shared/components/DefaultCell";
import ShowRows from "@/shared/components/ShowRows";
import FilterShowColumn from "@/shared/components/FilterShowColumn";
import FooterTable from "@/shared/components/FooterTable";
import TableData from "@/shared/components/TableData";
import DeleteModal from "@/pages/dashboard/inventories/components/Table/DeleteModal";

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "nomorLot",
  "barang",
  "hargaTotal",
  "tanggal",
  "actions",
];

type TransactionsTableProps = {
  transactions: TransactionIn[];
};

export default function TransactionsInTable({
  transactions,
}: TransactionsTableProps) {
  const { mutate } = useSWRConfig();
  const table = useTable({
    columns: columns,
    data: transactions,
    initialVisibleColumns: INITIAL_VISIBLE_COLUMNS,
    columnToSearch: "nomorLot",
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
        const transaction = await api.delete(
          `/transaksi-barang-masuk/${inventoryId}`,
        );

        mutate("/transaksi-barang-masuk");

        toast.success("transaksi barang masuk berhasil dihapus");
      } catch (err) {
        console.log(err);
        toast.error("Gagal menghapus transaksi");
      } finally {
        onClose();
      }
    },
    [mutate],
  );

  type cellValueType = string | number | object;

  const renderCell = useCallback(
    (transaction: TransactionIn, columnKey: React.Key) => {
      const cellValue = transaction[columnKey as keyof TransactionIn];

      switch (columnKey) {
        case "actions":
          return (
            <DefaultActionCell
              id={transaction.id}
              onOpenDeleteDialog={onOpenDeleteDialog}
            />
          );
        case "barang":
          return (
            <div>
              {transaction.barang.map((barangItem) => (
                <p
                  key={barangItem.id}
                >{`${barangItem.nama}   ( ${barangItem.jumlah} ${barangItem.satuan} x Rp${formatToRupiah(Number(barangItem.hargaSatuan))} )`}</p>
              ))}
            </div>
          );
        case "hargaTotal":
          return (
            <DefaultCell
              value={`Rp${formatToRupiah(Number(transaction.hargaTotal))}`}
            />
          );
        case "tanggal":
          return <DefaultCell value={ISODateToLocal(transaction.tanggal)} />;
        case "nomorLot":
          <DefaultCell value={transaction.nomorLot?.kode} />;
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
              href="/dashboard/transactions-in/add"
              color="primary"
              className="font-semibold w-fit"
              startContent={<IoIosAdd size={20} />}
            >
              Transaksi Masuk
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
    return <FooterTable totalData={transactions.length} table={table} />;
  }, [table, transactions.length]);

  return (
    <>
      <TableData
        table={table}
        topContent={topContent}
        bottomContent={bottomContent}
        renderCell={renderCell}
        emptyTableContentMessage="Transaksi barang masuk tidak ditemukan "
      />

      <DeleteModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Hapus Data Transaksi"
        desc="Apakah Anda yakin ingin menghapus data transaksi ini? Data akan dihapus secara permanen"
        itemIdToBeDeleted={itemToBeDeleted}
        onDelete={onDeleteItem}
      />
    </>
  );
}
