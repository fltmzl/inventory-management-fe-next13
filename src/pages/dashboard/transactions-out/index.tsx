import React from "react";
import MainLayout from "../components/Layout/MainLayout";
import TransactionsOut from "./components/Main/TransactionsOut";

export default function TransactionsOutPage() {
  return (
    <MainLayout title="Transaksi Barang Keluar">
      <TransactionsOut />
    </MainLayout>
  );
}
