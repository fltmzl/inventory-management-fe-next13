export type MovementType = "INITIAL" | "IN" | "OUT" | "ADJUSTMENT";

export interface StockMovement {
  id: string;
  barang_id: string;
  nomorLot_id: string | null;
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
    satuan?: { nama: string };
    kategori?: { nama: string };
  };
  nomorLot?: {
    id: string;
    kode: string;
  } | null;
}

export interface StockMovementSummary {
  totalMovements: number;
  totalIn: number;
  totalOut: number;
  totalAdjustment: number;
  totalInitial: number;
  netChange?: number;
}

export interface StockMovementQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  tipe?: MovementType | string;
  barangId?: string;
  from?: number | string;
  to?: number | string;
}

export interface StockMovementReportResponse {
  data: StockMovement[];
  summary?: StockMovementSummary;
  meta?: {
    totalItems?: number;
  };
}
