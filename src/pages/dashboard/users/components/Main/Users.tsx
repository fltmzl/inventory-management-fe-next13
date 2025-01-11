import SpinnerLoadingTable from "@/shared/components/SpinnerLoadingTable";
import UserTable from "../Table/UserTable";
import useSWR from "swr";

export default function Users() {
  const { data, isLoading } = useSWR("/pegawai");

  if (isLoading) return <SpinnerLoadingTable />;

  return <UserTable users={data.data} />;
}
