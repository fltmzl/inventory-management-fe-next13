"use client";

import InventoryTable from "../Table/InventoryTable";
import useSWR from "swr";

export default function Inventories() {
  const { data, isLoading } = useSWR("/barang");

  if (isLoading) return <p>loading borrr.....</p>;

  return <InventoryTable inventories={data.data} />;
}
