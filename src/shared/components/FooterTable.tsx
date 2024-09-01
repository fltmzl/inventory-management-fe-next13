import { Table } from "@/hooks/custom/useTable";
import { Pagination } from "@nextui-org/react";
import React from "react";

type Props<TData> = {
  totalData: number;
  table: Table<TData>;
};

export default function FooterTable<TData>({ totalData, table }: Props<TData>) {
  return (
    <div className="py-8 px-8 flex justify-end items-center bg-background rounded-b-large">
      <span className="w-[30%] text-small text-default-400">
        Total data: {totalData}
      </span>

      <div className="flex gap-2 items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={table.page}
          total={table.pages}
          onChange={table.setPage}
        />
      </div>
    </div>
  );
}
