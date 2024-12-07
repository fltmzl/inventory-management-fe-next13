import React from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  icon: React.ReactElement;
  title: string;
  value: string | number;
  className?: string;
};

export default function DashboardCard({
  icon,
  title,
  value,
  className,
}: Props) {
  return (
    <div
      className={twMerge(
        "py-12 px-10 rounded-2xl bg-background flex justify-between",
        className,
      )}
    >
      <div>
        <h1 className="text-lg font-medium text-gray-100">{title}</h1>
        <span className="text-5xl font-bold">{value}</span>
      </div>

      <div className="text-4xl size-20 grid place-content-center bg-background/20 rounded-full">
        {icon}
      </div>
    </div>
  );
}
