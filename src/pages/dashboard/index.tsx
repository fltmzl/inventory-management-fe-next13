import React from "react";
import MainLayout from "./components/Layout/MainLayout";
import DashboardCard from "./components/DashboardCard";
import { FaBoxArchive } from "react-icons/fa6";
import { VscRequestChanges } from "react-icons/vsc";
import { FaHouseUser } from "react-icons/fa6";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { api } from "@/utils/axios";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts";
import DashboardPieChart from "./components/DashboardPieChart";
import DashboardLowStock from "./components/DashboardLowStock";

export const getServerSideProps = (async () => {
  // const dashboardSummary =
  //   await api.get<ApiSuccessResponse<DashboardSummary>>("/dashboard/summary");

  const [dashboardSummary, dashboardBestSelling] = await Promise.all([
    api.get<ApiSuccessResponse<DashboardSummary>>("/dashboard/summary"),
    api.get<ApiSuccessResponse<DashboardBestSelling[]>>(
      "/dashboard/best-selling?limit=10",
    ),
  ]);

  return {
    props: {
      dashboardSummary: dashboardSummary.data.data,
      dashboardBestSelling: dashboardBestSelling.data.data,
    },
  };
}) satisfies GetServerSideProps<{ dashboardSummary: DashboardSummary }>;

export default function MainPage({
  dashboardSummary,
  dashboardBestSelling,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <MainLayout title="Dashboard">
      <div className="grid md:grid-cols-3 gap-5">
        <DashboardCard
          className="bg-gradient-to-tr from-blue-700 to-sky-400 text-white"
          icon={<FaBoxArchive />}
          title="Total Barang"
          value={dashboardSummary.totalBarang}
        />

        <DashboardCard
          className="bg-gradient-to-tr from-green-700 to-green-400 text-white"
          icon={<VscRequestChanges />}
          title="Total Permintaan Barang"
          value={dashboardSummary.totalPermintaanBarang}
        />

        <DashboardCard
          className="bg-gradient-to-tr from-violet-700 to-violet-400 text-white"
          icon={<FaHouseUser />}
          title="Total Pelanggan"
          value={dashboardSummary.totalPelanggan}
        />
      </div>

      <div className="mt-14 grid xl:grid-cols-2 gap-5">
        <div>
          <DashboardLowStock />
        </div>

        <div>
          <DashboardPieChart
            chartData={dashboardBestSelling.map((item) => ({
              id: item.id,
              value: item.total,
              label: item.nama,
            }))}
          />
        </div>
      </div>
    </MainLayout>
  );
}
