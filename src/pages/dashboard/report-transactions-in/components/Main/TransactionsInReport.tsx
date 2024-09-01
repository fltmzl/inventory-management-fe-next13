"use client";

import { useState } from "react";
import useSWR from "swr";
import TransactionsInTable from "../Table/TransactionsInTable";
import InputDateRange from "../Table/InputDateRange";
import { subDays } from "date-fns";

export default function TransactionsInReport() {
  const [dateRange, setDateRange] = useState({
    from: +subDays(new Date(), 30),
    to: +new Date(),
  });

  const { data, isLoading } = useSWR(`/transaksi-barang-masuk/report?from=${dateRange.from}&to=${dateRange.to}`);

  if (isLoading) return <p>Loading borr</p>;

  return (
    <>
      <InputDateRange dateRange={dateRange} setDateRange={setDateRange} transactions={data?.data} />
      <TransactionsInTable transactions={data?.data} />
    </>
  );
}
