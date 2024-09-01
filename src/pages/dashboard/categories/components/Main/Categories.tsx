"use client";

import useSWR from "swr";
import CategoriesTable from "../Table/CategoriesTable";

export default function Categories() {
  const { data, isLoading } = useSWR("/kategori");

  if (isLoading) return <p>Loading Kategori</p>;

  return <CategoriesTable categories={data.data} />;
}
