import MainLayout from "@/sections/dashboard/components/Layout/MainLayout";
import TransactionsIn from "@/sections/dashboard/transactions-in/components/Main/TransactionsIn";
import React from "react";

export default function TransactionsInPage() {
  return (
    <MainLayout title="Transaksi Barang Masuk">
      <TransactionsIn />
    </MainLayout>
  );
}
