"use client";

import CustomerTable from "../Table/CustomerTable";
import useSWR from "swr";

export default function Customers() {
  const { data, isLoading } = useSWR("/pelanggan");

  if (isLoading) return <p>loading borrr.....</p>;

  return <CustomerTable customers={data.data} />;
}
