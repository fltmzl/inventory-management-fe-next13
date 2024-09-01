import { Table as TableModel } from "@/hooks/custom/useTable";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React from "react";

type Props<TData> = {
  table: TableModel<TData>;
  emptyTableContentMessage?: string;
  bottomContent: JSX.Element;
  topContent: JSX.Element;
  renderCell: (data: TData, columnKey: React.Key) => JSX.Element;
};

export default function TableData<TData>({
  table,
  bottomContent,
  topContent,
  emptyTableContentMessage = "Data tidak ditemukan",
  renderCell,
}: Props<TData>) {
  return (
    <Table
      aria-label="customer table"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      className="gap-0"
      classNames={{
        wrapper: "max-h-[382px] bg-background rounded-b-none shadow-none",
      }}
      selectedKeys={table.selectedKeys}
      selectionMode="none"
      sortDescriptor={table.sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={table.setSelectedKeys}
      onSortChange={table.setSortDescriptor}
    >
      <TableHeader columns={table.headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={emptyTableContentMessage}
        items={table.sortedItems}
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => {
              return <TableCell>{renderCell(item, columnKey)}</TableCell>;
            }}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
