import useSWR from "swr";
import TransactionsInTable from "../Table/TransactionsInTable";
import SpinnerLoadingTable from "@/shared/components/SpinnerLoadingTable";

export default function TransactionsIn() {
  const { data, isLoading } = useSWR("/transaksi-barang-masuk");

  if (isLoading) return <SpinnerLoadingTable />;

  return <TransactionsInTable transactions={data.data} />;
}
