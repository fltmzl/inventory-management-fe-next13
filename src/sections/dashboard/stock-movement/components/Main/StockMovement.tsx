import React, { useState } from "react";
import useSWR from "swr";
import { startOfMonth, endOfMonth } from "date-fns";
import SpinnerLoadingTable from "@/shared/components/SpinnerLoadingTable";
import StockMovementSummaryCards from "../Cards/StockMovementSummaryCards";
import StockMovementFilter from "../Filter/StockMovementFilter";
import StockMovementTable from "../Table/StockMovementTable";

export default function StockMovement() {
  const [dateRange, setDateRange] = useState({
    from: +startOfMonth(new Date()),
    to: +endOfMonth(new Date()),
  });

  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedBarangId, setSelectedBarangId] = useState<string>("");

  // Query String construction
  const queryParams = new URLSearchParams();
  if (dateRange.from) queryParams.set("from", dateRange.from.toString());
  if (dateRange.to) queryParams.set("to", dateRange.to.toString());
  if (selectedType && selectedType !== "ALL") queryParams.set("tipe", selectedType);
  if (selectedBarangId) queryParams.set("barangId", selectedBarangId);

  const { data: movementsData, isLoading: isMovementsLoading } = useSWR<{
    data: StockMovement[];
    meta?: { total: number; page: number; limit: number };
  }>(`/stock-movement?${queryParams.toString()}`);

  const summaryParams = new URLSearchParams();
  if (dateRange.from) summaryParams.set("from", dateRange.from.toString());
  if (dateRange.to) summaryParams.set("to", dateRange.to.toString());

  const { data: summaryData, isLoading: isSummaryLoading } = useSWR<{
    data: StockMovementSummary;
  }>(`/stock-movement/summary?${summaryParams.toString()}`);

  return (
    <div className="space-y-6">
      {/* Summary Statistic Cards */}
      <StockMovementSummaryCards
        summary={summaryData?.data}
        isLoading={isSummaryLoading}
      />

      {/* Date & Item Filters */}
      <StockMovementFilter
        dateRange={dateRange}
        setDateRange={setDateRange}
        selectedBarangId={selectedBarangId}
        setSelectedBarangId={setSelectedBarangId}
      />

      {/* Table Content */}
      {isMovementsLoading ? (
        <SpinnerLoadingTable />
      ) : (
        <StockMovementTable
          movements={movementsData?.data || []}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />
      )}
    </div>
  );
}
