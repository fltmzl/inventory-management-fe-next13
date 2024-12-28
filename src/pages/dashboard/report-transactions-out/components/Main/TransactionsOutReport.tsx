import { useState } from "react";
import useSWR from "swr";
import InputDateRange from "../Table/InputDateRange";
import { subDays } from "date-fns";
import ReportTransactionsOutTable from "../Table/ReportTransactionsOutTable";
import SpinnerLoadingTable from "@/shared/components/SpinnerLoadingTable";

export default function TransactionsOutReport() {
  const [dateRange, setDateRange] = useState({
    from: +subDays(new Date(), 30),
    to: +new Date(),
  });

  const { data, isLoading } = useSWR(
    `/transaksi-barang-keluar/report?from=${dateRange.from}&to=${dateRange.to}`,
  );

  if (isLoading) return <SpinnerLoadingTable />;

  return (
    <>
      <InputDateRange
        dateRange={dateRange}
        setDateRange={setDateRange}
        transactions={data?.data}
      />
      <ReportTransactionsOutTable transactions={data?.data} />
    </>
  );
}
