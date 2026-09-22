import React, { useState, useRef } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker, Range } from "react-date-range";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { IoCalendar } from "react-icons/io5";
import { convertToLocaleDateString } from "@/utils/dateTime";
import { twMerge } from "tailwind-merge";
import useSWR from "swr";

type Props = {
  dateRange: { from: number; to: number };
  setDateRange: (range: { from: number; to: number }) => void;
  selectedBarangId: string;
  setSelectedBarangId: (id: string) => void;
};

export default function StockMovementFilter({
  dateRange,
  setDateRange,
  selectedBarangId,
  setSelectedBarangId,
}: Props) {
  const { data: barangList } = useSWR<ApiSuccessResponse<Inventory[]>>("/barang");

  const [date, setDate] = useState<Range[]>([
    {
      startDate: new Date(dateRange.from),
      endDate: new Date(dateRange.to),
      key: "selection",
    },
  ]);

  const inputDateRef = useRef<HTMLInputElement>(null);
  const [isDatePickerHovered, setIsDatePickerHovered] = useState(false);
  const [isDateShown, setIsDateShown] = useState(false);

  const handleDateInputBlur = () => {
    setTimeout(() => {
      if (!isDatePickerHovered) {
        setIsDateShown(false);
      }
    }, 200);
  };

  const handleApplyFilter = () => {
    if (date[0]?.startDate && date[0]?.endDate) {
      setDateRange({
        from: Number(date[0].startDate),
        to: Number(date[0].endDate),
      });
    }
  };

  return (
    <div className="bg-background p-4 rounded-xl shadow-sm mb-6 flex flex-wrap gap-4 items-end justify-between">
      <div className="flex flex-wrap items-end gap-4 flex-1">
        {/* Date Range Picker */}
        <div className="w-full max-w-xs relative inline-block">
          <Input
            className="w-full"
            size="sm"
            type="text"
            label="Periode Mutasi"
            labelPlacement="outside"
            placeholder={`${convertToLocaleDateString(date[0]?.startDate)} - ${convertToLocaleDateString(date[0]?.endDate)}`}
            value={`${convertToLocaleDateString(date[0]?.startDate)} - ${convertToLocaleDateString(date[0]?.endDate)}`}
            readOnly
            onFocus={() => setIsDateShown(true)}
            onBlur={handleDateInputBlur}
            ref={inputDateRef}
            startContent={<IoCalendar className="text-lg text-default-400 pointer-events-none flex-shrink-0" />}
          />

          <div
            id="datePickerContainer"
            className={twMerge("absolute z-30 shadow-2xl rounded-xl overflow-hidden mt-1", isDateShown ? "block" : "hidden")}
            onMouseEnter={() => setIsDatePickerHovered(true)}
            onMouseLeave={() => setIsDatePickerHovered(false)}
            onClick={() => inputDateRef.current?.focus()}
          >
            <DateRangePicker
              onChange={(item) => setDate([item.selection])}
              moveRangeOnFirstSelection={false}
              months={1}
              ranges={date}
              direction="horizontal"
              maxDate={new Date()}
            />
          </div>
        </div>

        {/* Filter Barang */}
        <div className="w-full max-w-xs">
          <Select
            label="Filter Barang"
            labelPlacement="outside"
            placeholder="Semua Barang"
            size="sm"
            selectedKeys={selectedBarangId ? [selectedBarangId] : ["ALL"]}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedBarangId(val === "ALL" ? "" : val);
            }}
          >
            <SelectItem key="ALL" value="ALL">
              Semua Barang
            </SelectItem>
            {(barangList?.data || []).map((barang) => (
              <SelectItem key={barang.id} value={barang.id}>
                {barang.nama} ({barang.satuan?.nama || "Item"})
              </SelectItem>
            ))}
          </Select>
        </div>

        <Button
          color="primary"
          size="sm"
          className="font-semibold h-[36px]"
          onClick={handleApplyFilter}
        >
          Terapkan Filter
        </Button>
      </div>
    </div>
  );
}
