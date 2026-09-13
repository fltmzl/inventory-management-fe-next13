import { useMediaQuery } from "@/hooks/custom/useMediaQuery";
import { PieChart, PieValueType, pieArcLabelClasses } from "@mui/x-charts";
import { MakeOptional } from "@mui/x-charts/internals";
import React from "react";

type Props = {
  chartData: MakeOptional<PieValueType, "id">[];
};

export default function DashboardPieChart({ chartData }: Props) {
  const isMobile = useMediaQuery("(max-width: 767px)");

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
              arcLabelMinAngle: 15,
              innerRadius: 40,
              outerRadius: 130,
              paddingAngle: 3,
              cornerRadius: 5,
              startAngle: 0,
              endAngle: 360,
              highlightScope: { fade: "global", highlight: "item" },
              cx: isMobile ? "50%" : "30%",
            },
          ]}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fontWeight: "bold",
              fill: "#fff",
            },
          }}
          slotProps={{
            legend: {
              direction: isMobile ? "row" : "column",
              position: {
                vertical: isMobile ? "bottom" : "middle",
                horizontal: isMobile ? "middle" : "right",
              },
              labelStyle: {
                fontSize: 12,
              },
            },
          }}
          height={isMobile ? 420 : 320}
        />
      </div>
    </>
  );
}
