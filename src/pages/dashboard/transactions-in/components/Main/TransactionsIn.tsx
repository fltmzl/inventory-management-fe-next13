"use client";

import useSWR from "swr";
import TransactionsInTable from "../Table/TransactionsInTable";

export default function TransactionsIn() {
  const { data, isLoading } = useSWR("/transaksi-barang-masuk");

  if (isLoading) return <p>loading borr</p>;

  return <TransactionsInTable transactions={data.data} />;
}
