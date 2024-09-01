import React from "react";
import MainLayout from "../components/Layout/MainLayout";
import TransactionsOutReport from "./components/Main/TransactionsOutReport";

export default function TransactionsOutReportPage() {
  return (
    <MainLayout title="Laporan Transaksi Barang Keluar">
      <TransactionsOutReport />
    </MainLayout>
  );
}
