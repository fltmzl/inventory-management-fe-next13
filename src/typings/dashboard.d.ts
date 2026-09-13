type DashboardSummary = {
  totalBarang: number;
  totalPermintaanBarang: number;
  totalPelanggan: number;
  totalAssetValuation: number;
  totalPendingRequests: number;
  totalFulfilledRequests: number;
};

type DashboardTransactionTrend = {
  tanggal: string;
  masuk: number;
  keluar: number;
};

type DashboardRecentActivity = {
  id: string;
  tipe: "MASUK" | "KELUAR";
  keterangan: string;
  tanggal: string;
  hargaTotal: number;
};

type DashboardCategoryDistribution = {
  kategori: string;
  totalStok: number;
};

type DashboardBestSelling = {
  id: string;
  nama: string;
  total: number;
};

type DashboardItemsLowStock = {
  id: string;
  nama: string;
  stok: number;
  harga: number;
  pembelianTerakhir: string;
  createdAt: string;
  updatedAt: string;
  kategori: string;
  satuan: string;
  nomorLot: {
    nomorLot_id: string;
    barang_id: string;
    totalBarang: number;
  }[];
};
