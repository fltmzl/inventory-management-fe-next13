import { api } from "@/utils/axios";
import {
  StockMovement,
  StockMovementSummary,
  StockMovementQueryParams,
  StockMovementReportResponse,
} from "@/types/stock-movement";

export const stockMovementService = {
  // Ambil list mutasi dengan pagination & filter
  async getAll(params?: StockMovementQueryParams) {
    const res = await api.get<{
      data: StockMovement[];
      meta?: { total: number; page: number; limit: number };
    }>("/stock-movement", { params });
    return res.data;
  },

  // Ambil summary KPI
  async getSummary(from?: number, to?: number) {
    const res = await api.get<{
      data: StockMovementSummary;
    }>("/stock-movement/summary", {
      params: { from, to },
    });
    return res.data;
  },

  // Ambil data report untuk export Excel / PDF
  async getReport(params?: {
    from?: number;
    to?: number;
    tipe?: string;
    barangId?: string;
  }) {
    const res = await api.get<StockMovementReportResponse>(
      "/stock-movement/report",
      { params },
    );
    return res.data;
  },

  // Ambil mutasi per barang
  async getByBarangId(barangId: string, from?: number, to?: number) {
    const res = await api.get<{
      data: StockMovement[];
    }>(`/stock-movement/barang/${barangId}`, {
      params: { from, to },
    });
    return res.data;
  },
};
