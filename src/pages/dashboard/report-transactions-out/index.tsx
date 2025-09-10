import MainLayout from "@/sections/dashboard/components/Layout/MainLayout";
import TransactionsOutReport from "@/sections/dashboard/report-transactions-out/components/Main/TransactionsOutReport";
import React from "react";

export default function TransactionsOutReportPage() {
  return (
    <MainLayout title="Laporan Transaksi Barang Keluar">
      <TransactionsOutReport />
    </MainLayout>
  );
}
