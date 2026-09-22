type MovementType = "INITIAL" | "IN" | "OUT" | "ADJUSTMENT";

type StockMovement = {
  id: string;
  barang_id: string;
  tipe: MovementType;
  jumlah: number;
  stokSebelum: number;
  stokSesudah: number;
  referensiId: string | null;
  keterangan: string | null;
  tanggal: string;
  createdAt?: string;
  barang: {
    id: string;
    nama: string;
    satuan?: {
      nama: string;
    };
    kategori?: {
      nama: string;
    };
  };
  nomorLot?: {
    id: string;
    kode: string;
  } | null;
};

type StockMovementSummary = {
  totalMovements: number;
  totalIn: number;
  totalOut: number;
  totalAdjustment: number;
  totalInitial: number;
};
