import { constant } from "@/constant";
import { Table } from "@/hooks/custom/useTable";
import React from "react";

type Props<TData> = {
  table: Table<TData>;
};

export default function ShowRows<TData>({ table }: Props<TData>) {
  const rowsList = constant.SHOW_ROWS_LIST;

  return (
    <div className="flex justify-between items-center">
      <label className="flex items-center text-default-400 text-xs">
        Tampilkan
        <select
          className="bg-background ring-1 ring-gray-700 pl-1 pr-2 py-0.5 mx-2 text-default-400 text-small rounded-md"
          onChange={table.onRowsPerPageChange}
          defaultValue={table.rowsPerPage}
        >
          {rowsList.map((row) => (
            <option value={row}>{row}</option>
          ))}
        </select>
        data
      </label>
    </div>
  );
}
