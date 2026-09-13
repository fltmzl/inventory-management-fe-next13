import { Progress } from "@nextui-org/react";
import React from "react";

type Props = {
  categoryDistribution: DashboardCategoryDistribution[];
};

export default function DashboardCategoryDistribution({
  categoryDistribution,
}: Props) {
  if (!categoryDistribution || categoryDistribution.length === 0) {
    return (
      <div className="bg-background p-8 rounded-2xl flex items-center justify-center h-[200px]">
        <p className="text-gray-400">Tidak ada data distribusi kategori</p>
      </div>
    );
  }

  // Find max stock to scale progress bars
  const maxStok = Math.max(
    ...categoryDistribution.map((c) => c.totalStok),
    1,
  );

  // Harmonized color scheme list to make progress bars colorful and premium
  const progressColors = [
    "primary",
    "success",
    "warning",
    "danger",
    "secondary",
  ] as const;

  return (
    <>
      <h1 className="text-2xl font-semibold mb-5">Porsi Stok per Kategori</h1>
      <div className="bg-background p-6 rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryDistribution.map((cat, idx) => {
            const percentage = Math.round((cat.totalStok / maxStok) * 100);
            const color = progressColors[idx % progressColors.length];

            return (
              <div
                key={cat.kategori}
                className="bg-default-50/50 p-4 rounded-xl border border-default-100 hover:border-default-200 transition-all"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-sm">{cat.kategori}</p>
                  <p className="text-sm font-bold text-default-600">
                    {cat.totalStok} Kg/Pcs
                  </p>
                </div>
                <Progress
                  value={cat.totalStok}
                  maxValue={maxStok}
                  color={color}
                  size="sm"
                  aria-label={`Sstok untuk ${cat.kategori}`}
                  classNames={{
                    indicator: "bg-gradient-to-r",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
