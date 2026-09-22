import React from "react";
import { Card, CardBody } from "@nextui-org/react";
import {
  TbArrowDownLeft,
  TbArrowUpRight,
  TbArrowsDiff,
  TbAdjustments,
  TbDatabase,
} from "react-icons/tb";

type Props = {
  summary?: StockMovementSummary;
  isLoading?: boolean;
};

export default function StockMovementSummaryCards({ summary, isLoading }: Props) {
  const cards = [
    {
      title: "Total Mutasi",
      value: summary?.totalMovements ?? 0,
      icon: <TbArrowsDiff className="text-2xl text-primary" />,
      bgColor: "bg-primary-50",
      textColor: "text-primary-600",
    },
    {
      title: "Total Masuk (IN)",
      value: `+${summary?.totalIn ?? 0}`,
      icon: <TbArrowDownLeft className="text-2xl text-success" />,
      bgColor: "bg-success-50",
      textColor: "text-success-600",
    },
    {
      title: "Total Keluar (OUT)",
      value: `-${summary?.totalOut ?? 0}`,
      icon: <TbArrowUpRight className="text-2xl text-danger" />,
      bgColor: "bg-danger-50",
      textColor: "text-danger-600",
    },
    {
      title: "Penyesuaian (ADJUSTMENT)",
      value: summary?.totalAdjustment ?? 0,
      icon: <TbAdjustments className="text-2xl text-warning" />,
      bgColor: "bg-warning-50",
      textColor: "text-warning-600",
    },
    {
      title: "Saldo Awal (INITIAL)",
      value: summary?.totalInitial ?? 0,
      icon: <TbDatabase className="text-2xl text-secondary" />,
      bgColor: "bg-secondary-50",
      textColor: "text-secondary-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {cards.map((card, idx) => (
        <Card key={idx} shadow="sm" className="border-none">
          <CardBody className="flex flex-row items-center gap-4 py-4 px-5">
            <div className={`p-3 rounded-xl ${card.bgColor}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-xs text-default-500 font-medium">{card.title}</p>
              <h3 className={`text-xl font-bold ${card.textColor}`}>
                {isLoading ? "..." : card.value}
              </h3>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
