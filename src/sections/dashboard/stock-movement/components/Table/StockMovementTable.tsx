import { Chip, Input, Select, SelectItem } from "@nextui-org/react";
import React, { useCallback } from "react";
import { FiSearch } from "react-icons/fi";
import useTable from "@/hooks/custom/useTable";
import DefaultCell from "@/shared/components/DefaultCell";
import ShowRows from "@/shared/components/ShowRows";
import FilterShowColumn from "@/shared/components/FilterShowColumn";
import FooterTable from "@/shared/components/FooterTable";
import TableData from "@/shared/components/TableData";
import { ISODateToLocal } from "@/utils/dateTime";
import { columns } from "@/tables/stockMovement.table";

const INITIAL_VISIBLE_COLUMNS = [
  "tanggal",
  "barang",
  "tipe",
  "jumlah",
  "stokSebelum",
  "stokSesudah",
  "nomorLot",
  "referensiId",
  "keterangan",
];

type StockMovementTableProps = {
  movements: StockMovement[];
  selectedType: string;
  setSelectedType: (val: string) => void;
};

export default function StockMovementTable({
  movements,
  selectedType,
  setSelectedType,
}: StockMovementTableProps) {
  const table = useTable({
    columns: columns,
    data: movements,
    initialVisibleColumns: INITIAL_VISIBLE_COLUMNS,
    columnToSearch: "referensiId",
  });

  const renderCell = useCallback(
    (movement: StockMovement, columnKey: React.Key) => {
      switch (columnKey) {
        case "tanggal":
          return <DefaultCell value={ISODateToLocal(movement.tanggal)} />;
        case "barang":
          return (
            <div>
              <p className="font-semibold text-small text-foreground">
                {movement.barang?.nama || "-"}
              </p>
              <p className="text-tiny text-default-400">
                {movement.barang?.kategori?.nama
                  ? `${movement.barang.kategori.nama} • `
                  : ""}
                {movement.barang?.satuan?.nama || ""}
              </p>
            </div>
          );
        case "tipe":
          if (movement.tipe === "IN") {
            return (
              <Chip
                color="success"
                size="sm"
                variant="flat"
                className="font-semibold"
              >
                MASUK (IN)
              </Chip>
            );
          }
          if (movement.tipe === "OUT") {
            return (
              <Chip
                color="danger"
                size="sm"
                variant="flat"
                className="font-semibold"
              >
                KELUAR (OUT)
              </Chip>
            );
          }
          if (movement.tipe === "ADJUSTMENT") {
            return (
              <Chip
                color="warning"
                size="sm"
                variant="flat"
                className="font-semibold"
              >
                PENYESUAIAN
              </Chip>
            );
          }
          return (
            <Chip
              color="secondary"
              size="sm"
              variant="flat"
              className="font-semibold"
            >
              SALDO AWAL
            </Chip>
          );
        case "jumlah":
          const isPositive = movement.jumlah > 0;
          return (
            <span
              className={`font-semibold text-small ${
                isPositive ? "text-success-600" : "text-danger-600"
              }`}
            >
              {isPositive ? `+${movement.jumlah}` : movement.jumlah}{" "}
              <span className="text-tiny text-default-400 font-normal">
                {movement.barang?.satuan?.nama || ""}
              </span>
            </span>
          );
        case "stokSebelum":
          return (
            <DefaultCell
              className="text-default-600"
              value={`${movement.stokSebelum} ${movement.barang?.satuan?.nama || ""}`}
            />
          );
        case "stokSesudah":
          return (
            <span className="font-bold text-foreground">
              {movement.stokSesudah}{" "}
              <span className="text-tiny text-default-400 font-normal">
                {movement.barang?.satuan?.nama || ""}
              </span>
            </span>
          );
        case "nomorLot":
          return <DefaultCell value={movement.nomorLot?.kode || "-"} />;
        case "referensiId":
          return (
            <Chip size="sm" variant="flat" className="text-xs">
              {movement.referensiId || "-"}
            </Chip>
          );
        case "keterangan":
          return (
            <p
              className="text-xs text-default-500 max-w-xs truncate"
              title={movement.keterangan || ""}
            >
              {movement.keterangan || "-"}
            </p>
          );
        default:
          return (
            <DefaultCell
              value={movement[columnKey as keyof StockMovement] as string}
            />
          );
      }
    },
    [],
  );

  const topContent = (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex justify-between gap-3 items-end">
        <div className="flex gap-3 items-center flex-1 max-w-lg">
          <Input
            isClearable
            className="w-full sm:max-w-[55%]"
            placeholder="Cari no. referensi..."
            startContent={<FiSearch className="text-default-300" />}
            value={table.filterValue}
            onClear={() => table.onClear()}
            onValueChange={table.onSearchChange}
            size="sm"
          />
          <Select
            label="Tipe Mutasi"
            placeholder="Semua Tipe"
            selectedKeys={[selectedType]}
            size="sm"
            className="w-full sm:max-w-[45%]"
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <SelectItem key="ALL" value="ALL">
              Semua Tipe
            </SelectItem>
            <SelectItem key="IN" value="IN">
              Masuk (IN)
            </SelectItem>
            <SelectItem key="OUT" value="OUT">
              Keluar (OUT)
            </SelectItem>
            <SelectItem key="ADJUSTMENT" value="ADJUSTMENT">
              Penyesuaian (ADJUSTMENT)
            </SelectItem>
            <SelectItem key="INITIAL" value="INITIAL">
              Saldo Awal (INITIAL)
            </SelectItem>
          </Select>
        </div>

        <div className="flex gap-3 items-center">
          <ShowRows table={table} />
          <FilterShowColumn columns={columns} table={table} />
        </div>
      </div>
    </div>
  );

  const bottomContent = (
    <FooterTable totalData={movements?.length || 0} table={table} />
  );

  return (
    <TableData
      table={table}
      bottomContent={bottomContent}
      topContent={topContent}
      renderCell={renderCell}
      emptyTableContentMessage="Belum ada data mutasi stok"
    />
  );
}
