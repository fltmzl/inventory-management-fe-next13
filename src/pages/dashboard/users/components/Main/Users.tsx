"use client";

import UserTable from "../Table/UserTable";
import useSWR from "swr";

export default function Users() {
  const { data, isLoading } = useSWR("/pegawai");

  if (isLoading) return <p>loading borrr.....</p>;

  return <UserTable users={data.data} />;
}
