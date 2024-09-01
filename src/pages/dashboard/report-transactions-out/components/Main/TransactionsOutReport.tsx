"use client";

import { useState } from "react";
import useSWR from "swr";
import TransactionsOutTable from "../Table/TransactionsOutTable";
import InputDateRange from "../Table/InputDateRange";
import { subDays } from "date-fns";

export default function TransactionsOutReport() {
  const [dateRange, setDateRange] = useState({
    from: +subDays(new Date(), 30),
    to: +new Date(),
  });

  const { data, isLoading } = useSWR(`/transaksi-barang-keluar/report?from=${dateRange.from}&to=${dateRange.to}`);

  if (isLoading) return <p>Loading borr</p>;

  return (
    <>
      <InputDateRange dateRange={dateRange} setDateRange={setDateRange} transactions={data?.data} />
      <TransactionsOutTable transactions={data?.data} />
    </>
  );
}
