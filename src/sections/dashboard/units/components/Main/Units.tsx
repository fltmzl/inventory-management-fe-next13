import useSWR from "swr";
import UnitsTable from "../Table/UnitsTable";
import SpinnerLoadingTable from "@/shared/components/SpinnerLoadingTable";

export default function Units() {
  const { data, isLoading } = useSWR("/satuan");

  if (isLoading) return <SpinnerLoadingTable />;

  return <UnitsTable units={data.data} />;
}
