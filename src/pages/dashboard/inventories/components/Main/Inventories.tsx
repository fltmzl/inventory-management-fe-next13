import SpinnerLoadingTable from "@/shared/components/SpinnerLoadingTable";
import useSWR from "swr";
import InventoryTable from "../Table/InventoryTable";

export default function Inventories() {
  const { data, isLoading } = useSWR("/barang");

  if (isLoading) return <SpinnerLoadingTable />;

  return <InventoryTable inventories={data.data} />;
}
