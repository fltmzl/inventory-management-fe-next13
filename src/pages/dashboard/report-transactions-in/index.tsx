import React from "react";
import MainLayout from "../components/Layout/MainLayout";
import TransactionsInReport from "./components/Main/TransactionsInReport";

export default function TransactionsInReportPage() {
  return (
    <MainLayout title="Laporan Transaksi Barang Masuk">
      <TransactionsInReport />
    </MainLayout>
  );
}
