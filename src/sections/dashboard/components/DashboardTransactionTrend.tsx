import { BarChart } from "@mui/x-charts";
import React from "react";

type Props = {
  trendData: DashboardTransactionTrend[];
};

const formatAxisDate = (dateStr: string) => {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length < 3) return dateStr;
  const month = parts[1];
  const day = parts[2];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agt",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  return `${day} ${monthNames[parseInt(month) - 1]}`;
};

export default function DashboardTransactionTrend({ trendData }: Props) {
  // If no data, render empty state
  if (!trendData || trendData.length === 0) {
    return (
      <div className="bg-background p-8 rounded-2xl flex items-center justify-center h-[360px]">
        <p className="text-gray-400">Tidak ada data tren transaksi</p>
      </div>
    );
  }

  // To prevent chart from looking too crowded, we can sample the last 15 days, or keep all 30
  // Let's keep the last 15 days for a clean, non-overlapping x-axis
  const displayData = trendData.slice(-15);

  const xLabels = displayData.map((item) => formatAxisDate(item.tanggal));
  const masukSeries = displayData.map((item) => item.masuk);
  const keluarSeries = displayData.map((item) => item.keluar);

  return (
    <>
      <h1 className="text-2xl font-semibold mb-5">
        Tren Transaksi Gudang (15 Hari Terakhir)
      </h1>
      <div className="bg-background px-6 py-8 rounded-2xl">
        <BarChart
          xAxis={[
            {
              scaleType: "band",
              data: xLabels,
            },
          ]}
          series={[
            {
              data: masukSeries,
              label: "Barang Masuk",
              color: "#3b82f6", // Blue-500
            },
            {
              data: keluarSeries,
              label: "Barang Keluar",
              color: "#10b981", // Emerald-500
            },
          ]}
          height={300}
          slotProps={{
            legend: {
              direction: "row",
              position: { vertical: "top", horizontal: "middle" },
              padding: 0,
            },
          }}
        />
      </div>
    </>
  );
}
