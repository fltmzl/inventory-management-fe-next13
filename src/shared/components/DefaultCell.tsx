import React from "react";
import { twMerge } from "tailwind-merge";
type Props = {
  value: string | number | undefined;
  className?: string;
};

export default function DefaultCell({ value, className }: Props) {
  return (
    <div className={twMerge(className)}>
      <p> {value ?? "-"}</p>
    </div>
  );
}
