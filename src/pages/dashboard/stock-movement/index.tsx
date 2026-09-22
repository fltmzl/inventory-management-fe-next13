import React, { useEffect } from "react";
import MainLayout from "@/sections/dashboard/components/Layout/MainLayout";
import StockMovement from "@/sections/dashboard/stock-movement/components/Main/StockMovement";
import useSWR from "swr";
import { useRouter } from "next/router";
import SpinnerLoadingTable from "@/shared/components/SpinnerLoadingTable";

export default function StockMovementPage() {
  const { data: user, isLoading } = useSWR<User>("/auth/profile");
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user && user.role !== "OWNER") {
      router.replace("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading) return <SpinnerLoadingTable />;

  if (user?.role !== "OWNER") {
    return null;
  }

  return (
    <MainLayout title="Riwayat Mutasi Stok (Stock Ledger)">
      <StockMovement />
    </MainLayout>
  );
}
