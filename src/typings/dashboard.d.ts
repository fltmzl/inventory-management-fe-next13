type DashboardSummary = {
  totalBarang: number;
  totalPermintaanBarang: number;
  totalPelanggan: number;
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
