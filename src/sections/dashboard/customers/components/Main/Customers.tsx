import SpinnerLoadingTable from "@/shared/components/SpinnerLoadingTable";
import CustomerTable from "../Table/CustomerTable";
import useSWR from "swr";

export default function Customers() {
  const { data, isLoading } = useSWR("/pelanggan");

  if (isLoading) return <SpinnerLoadingTable />;

  return <CustomerTable customers={data.data} />;
}
