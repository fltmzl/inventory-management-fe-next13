import { PieChart, PieValueType, pieArcLabelClasses } from "@mui/x-charts";
import { MakeOptional } from "@mui/x-charts/internals";
import React from "react";

type Props = {
  chartData: MakeOptional<PieValueType, "id">[];
};

export default function DashboardPieChart({ chartData }: Props) {
  return (
    <>
      <h1 className="text-2xl font-semibold mb-5">
        Barang Terlaris / Paling Banyak Terjual
      </h1>
      <div className="bg-background px-10 py-8 rounded-2xl">
        <PieChart
          series={[
            {
              data: chartData,
              arcLabel: (item) => `${item.value}`,
              arcLabelMinAngle: 35,
              innerRadius: 32,
              outerRadius: 110,
              paddingAngle: 3,
              cornerRadius: 5,
              startAngle: 0,
              endAngle: 360,
              highlightScope: { fade: "global", highlight: "item" },
              cx: "35%",
            },
          ]}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fontWeight: "bold",
            },
          }}
          height={300}
        />
      </div>
    </>
  );
}
