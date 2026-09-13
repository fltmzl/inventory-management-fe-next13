import DashboardCard from "@/sections/dashboard/components/DashboardCard";
import DashboardLowStock from "@/sections/dashboard/components/DashboardLowStock";
import DashboardPieChart from "@/sections/dashboard/components/DashboardPieChart";
import DashboardTransactionTrend from "@/sections/dashboard/components/DashboardTransactionTrend";
import DashboardRecentActivities from "@/sections/dashboard/components/DashboardRecentActivities";
import DashboardCategoryDistribution from "@/sections/dashboard/components/DashboardCategoryDistribution";
import MainLayout from "@/sections/dashboard/components/Layout/MainLayout";
import { api } from "@/utils/axios";
import { formatToRupiah } from "@/utils/formatToRupiah";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import {
  FaBoxArchive,
  FaCoins,
  FaClipboardList,
  FaClock,
} from "react-icons/fa6";

export const getServerSideProps = (async () => {
  try {
    const [
      dashboardSummary,
      dashboardBestSelling,
      dashboardTransactionTrend,
      dashboardRecentActivities,
      dashboardCategoryDistribution,
    ] = await Promise.all([
      api.get<ApiSuccessResponse<DashboardSummary>>("/dashboard/summary"),
      api.get<ApiSuccessResponse<DashboardBestSelling[]>>(
        "/dashboard/best-selling?limit=10",
      ),
      api.get<ApiSuccessResponse<DashboardTransactionTrend[]>>(
        "/dashboard/transaction-trend",
      ),
      api.get<ApiSuccessResponse<DashboardRecentActivity[]>>(
        "/dashboard/recent-activities",
      ),
      api.get<ApiSuccessResponse<DashboardCategoryDistribution[]>>(
        "/dashboard/category-distribution",
      ),
    ]);

    return {
      props: {
        dashboardSummary: dashboardSummary.data.data,
        dashboardBestSelling: dashboardBestSelling.data.data,
        dashboardTransactionTrend: dashboardTransactionTrend.data.data,
        dashboardRecentActivities: dashboardRecentActivities.data.data,
        dashboardCategoryDistribution: dashboardCategoryDistribution.data.data,
      },
    };
  } catch (error) {
    console.error("Dashboard server-side fetch error, using fallbacks:", error);

    // Fallback fetches one by one to load what's available
    let dashboardSummary = {
      totalBarang: 0,
      totalPermintaanBarang: 0,
      totalPelanggan: 0,
      totalAssetValuation: 0,
      totalPendingRequests: 0,
      totalFulfilledRequests: 0,
    };
    let dashboardBestSelling: DashboardBestSelling[] = [];
    let dashboardTransactionTrend: DashboardTransactionTrend[] = [];
    let dashboardRecentActivities: DashboardRecentActivity[] = [];
    let dashboardCategoryDistribution: DashboardCategoryDistribution[] = [];

    try {
      const res =
        await api.get<ApiSuccessResponse<DashboardSummary>>(
          "/dashboard/summary",
        );
      dashboardSummary = res.data.data;
    } catch (_) {}

    try {
      const res = await api.get<ApiSuccessResponse<DashboardBestSelling[]>>(
        "/dashboard/best-selling?limit=10",
      );
      dashboardBestSelling = res.data.data;
    } catch (_) {}

    try {
      const res = await api.get<
        ApiSuccessResponse<DashboardTransactionTrend[]>
      >("/dashboard/transaction-trend");
      dashboardTransactionTrend = res.data.data;
    } catch (_) {}

    try {
      const res = await api.get<ApiSuccessResponse<DashboardRecentActivity[]>>(
        "/dashboard/recent-activities",
      );
      dashboardRecentActivities = res.data.data;
    } catch (_) {}

    try {
      const res = await api.get<
        ApiSuccessResponse<DashboardCategoryDistribution[]>
      >("/dashboard/category-distribution");
      dashboardCategoryDistribution = res.data.data;
    } catch (_) {}

    return {
      props: {
        dashboardSummary,
        dashboardBestSelling,
        dashboardTransactionTrend,
        dashboardRecentActivities,
        dashboardCategoryDistribution,
      },
    };
  }
}) satisfies GetServerSideProps;

export default function MainPage({
  dashboardSummary,
  dashboardBestSelling,
  dashboardTransactionTrend,
  dashboardRecentActivities,
  dashboardCategoryDistribution,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <MainLayout title="Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <DashboardCard
          className="bg-gradient-to-tr from-blue-700 to-sky-400 text-white"
          icon={<FaBoxArchive />}
          title="Total Barang"
          value={dashboardSummary.totalBarang}
        />

        <DashboardCard
          className="bg-gradient-to-tr from-green-700 to-green-400 text-white"
          icon={<FaClipboardList />}
          title="Total Permintaan Barang"
          value={dashboardSummary.totalPermintaanBarang}
        />

        <DashboardCard
          className="bg-gradient-to-tr from-violet-700 to-violet-400 text-white"
          icon={<FaClock />}
          title="Permintaan Pending"
          value={dashboardSummary.totalPendingRequests || 0}
        />

        <DashboardCard
          className="bg-gradient-to-tr from-amber-700 to-yellow-500 text-white"
          icon={<FaCoins />}
          title="Total Nilai Aset (Rp)"
          value={`${formatToRupiah(dashboardSummary.totalAssetValuation || 0)}`}
        />
      </div>

      <div className="mt-14 flex flex-col-reverse 2xl:flex-row gap-5">
        <div className="basis-1/2">
          <DashboardLowStock />
        </div>

        <div className="basis-1/2">
          <DashboardPieChart
            chartData={dashboardBestSelling.map((item) => ({
              id: item.id,
              value: item.total,
              label: item.nama,
            }))}
          />
        </div>
      </div>

      <div className="mt-14 flex flex-col xl:flex-row gap-5">
        <div className="basis-2/3">
          <DashboardTransactionTrend trendData={dashboardTransactionTrend} />
        </div>
        <div className="basis-1/3">
          <DashboardRecentActivities activities={dashboardRecentActivities} />
        </div>
      </div>

      {/* <div className="mt-14">
        <DashboardCategoryDistribution
          categoryDistribution={dashboardCategoryDistribution}
        />
      </div> */}
    </MainLayout>
  );
}
