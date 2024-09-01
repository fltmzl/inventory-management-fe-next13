import React from "react";
import MainLayout from "../components/Layout/MainLayout";
import TransactionsIn from "./components/Main/TransactionsIn";

export default function TransactionsInPage() {
  return (
    <MainLayout title="Transaksi Barang Masuk">
      <TransactionsIn />
    </MainLayout>
  );
}
