import useSWR from "swr";
import ItemRequestsTable from "../Table/ItemRequestsTable";
import SpinnerLoadingTable from "@/shared/components/SpinnerLoadingTable";

export default function ItemRequests() {
  const { data, isLoading } = useSWR("/permintaan-barang");

  if (isLoading) return <SpinnerLoadingTable />;

  return <ItemRequestsTable itemRequests={data.data} />;
}
