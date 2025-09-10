import MainLayout from "@/sections/dashboard/components/Layout/MainLayout";
import TransactionsOut from "@/sections/dashboard/transactions-out/components/Main/TransactionsOut";
import React from "react";

export default function TransactionsOutPage() {
  return (
    <MainLayout title="Transaksi Barang Keluar">
      <TransactionsOut />
    </MainLayout>
  );
}
