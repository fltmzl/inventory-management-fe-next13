import { Input } from "@nextui-org/react";
import { useMemo, useCallback } from "react";
import { FiSearch } from "react-icons/fi";
import { api } from "@/utils/axios";
import { useSWRConfig } from "swr";
import toast from "react-hot-toast";
import { useMediaQuery } from "@/hooks/custom/useMediaQuery";
import useTable from "@/hooks/custom/useTable";
import { ISODateToLocal } from "@/utils/dateTime";
import { formatToRupiah } from "@/utils/formatToRupiah";
import DefaultCell from "@/shared/components/DefaultCell";
import ShowRows from "@/shared/components/ShowRows";
import FilterShowColumn from "@/shared/components/FilterShowColumn";
import FooterTable from "@/shared/components/FooterTable";
import TableData from "@/shared/components/TableData";
import { columns } from "@/tables/reportTransactionIn.table";

const INITIAL_VISIBLE_COLUMNS = [
  "id",
  "barang",
  "hargaTotal",
  "pelanggan",
  "tanggal",
];

type TransactionsTableProps = {
  transactions: TransactionIn[];
};

export default function ReportTransactionsInTable({
  transactions,
}: TransactionsTableProps) {
  const { mutate } = useSWRConfig();
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const table = useTable({
    columns: columns,
    data: transactions,
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
    [mutate],
  );

  const renderCell = useCallback(
    (transaction: TransactionIn, columnKey: React.Key) => {
      const cellValue = transaction[columnKey as keyof TransactionIn];

      switch (columnKey) {
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
          return <p>{`Rp${formatToRupiah(Number(transaction.hargaTotal))}`}</p>;
        case "tanggal":
          return <p>{ISODateToLocal(transaction.tanggal)}</p>;
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
        <div className="flex flex-col md:flex-row justify-between gap-3 items-center">
          <ShowRows table={table} />

          <div className="flex-1 flex justify-end gap-3">
            <FilterShowColumn table={table} columns={columns} />

            <Input
              isClearable
              radius="md"
              className="w-full sm:max-w-[44%]"
              classNames={{
                inputWrapper: "py-0 h-full",
              }}
              size="sm"
              placeholder="Cari berdasarkan ID Transaksi"
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
    <TableData
      table={table}
      topContent={topContent}
      bottomContent={bottomContent}
      renderCell={renderCell}
      emptyTableContentMessage="Transaksi barang masuk tidak ditemukan, Silahkan Pilih Periode Laporan yang sesuai"
    />
  );
}
