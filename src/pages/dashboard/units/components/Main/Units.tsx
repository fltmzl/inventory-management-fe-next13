"use client";

import useSWR from "swr";
import UnitsTable from "../Table/UnitsTable";

export default function Units() {
  const { data, isLoading } = useSWR("/satuan");

  if (isLoading) return <p>Loading Kategori</p>;

  return <UnitsTable units={data.data} />;
}
