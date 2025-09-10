import MainLayout from "@/sections/dashboard/components/Layout/MainLayout";
import TransactionsInReport from "@/sections/dashboard/report-transactions-in/components/Main/TransactionsInReport";
import React from "react";

export default function TransactionsInReportPage() {
  return (
    <MainLayout title="Laporan Transaksi Barang Masuk">
      <TransactionsInReport />
    </MainLayout>
  );
}
