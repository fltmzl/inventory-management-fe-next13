"use client";

import useSWR from "swr";
import ItemRequestsTable from "../Table/ItemRequestsTable";

export default function ItemRequests() {
  const { data, isLoading } = useSWR("/permintaan-barang");

  if (isLoading) return <p>loading borr</p>;

  return <ItemRequestsTable itemRequests={data.data} />;
}
