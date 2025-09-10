import React, { useState } from "react";
import InventoryLowStockTable from "./Table/InventoryLowStockTable";
import useSWR from "swr";
import SpinnerLoading from "./Loading/SpinnerLoading";

export default function DashboardLowStock() {
  const [maxLowStock, setMaxLowStock] = useState(10);

  const { data, isLoading } = useSWR<
    ApiSuccessResponse<DashboardItemsLowStock[]>
  >(`/dashboard/low-supplies?maxStock=${maxLowStock}`);

  if (isLoading) return <SpinnerLoading />;

  return (
    <InventoryLowStockTable
      inventories={data?.data as DashboardItemsLowStock[]}
      setMaxLowStock={setMaxLowStock}
      maxLowStock={maxLowStock}
    />
  );
}
