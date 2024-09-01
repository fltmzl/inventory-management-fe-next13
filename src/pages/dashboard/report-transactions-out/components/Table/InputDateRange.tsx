"use client";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { DateRangePicker } from "react-date-range";
import { ISODateToLocal, convertToLocaleDateString } from "@/utils/dateTime";
import { addDays } from "date-fns";
import { Button, Input } from "@nextui-org/react";
import { IoCalendar } from "react-icons/io5";
import { twMerge } from "tailwind-merge";
import { TbReportAnalytics } from "react-icons/tb";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatToRupiah } from "@/utils/formatToRupiah";
import { formatArrayOfItemToString } from "@/utils/formatArray";

type InputDateRangeProps = {
  dateRange: {
    from: number;
    to: number;
  };
  setDateRange: Dispatch<SetStateAction<{ from: number; to: number }>>;
  transactions: TransactionOut[];
};

export default function InputDateRange({ setDateRange, dateRange, transactions }: InputDateRangeProps) {
  const [date, setDate] = useState([
    {
      startDate: new Date(dateRange.from),
      endDate: addDays(new Date(dateRange.to), 1),
      key: "selection",
    },
  ]);
  const inputDateRef = useRef<HTMLInputElement>(null);
  const [isDatePickerHovered, setIsDatePickerHovered] = useState(false);
  const [isDateShown, setIsDateShown] = useState(false);
  const [isDatePickerOpened, setIsDatePickerOpened] = useState(false);

  useEffect(() => {
    if (!isDatePickerOpened) return;

    const handleMonthClick = (e: Event) => {
      console.log("Month clicked");
      e.stopPropagation();
    };

    document.querySelector(".rdrMonthAndYearPickers")?.addEventListener("click", handleMonthClick);

    return () => {
      document.querySelector(".rdrMonthAndYearPickers")?.removeEventListener("click", handleMonthClick);
    };
  }, [isDatePickerOpened]);

  const handleDateInputBlur = () => {
    setTimeout(() => {
      if (!isDatePickerHovered) {
        setIsDateShown(false);
      }
    }, 200);
  };

  const handlerExportPdf = () => {
    const doc = new jsPDF();

    const mappedTransactions = transactions.map((transaction) => {
      return [transaction.id, transaction.pelanggan.nama, ISODateToLocal(transaction.tanggal), formatArrayOfItemToString(transaction.barang), `Rp${formatToRupiah(Number(transaction.hargaTotal))}`];
    });

    doc.text("Banu Jaya", 15, 15);

    doc.setFontSize(10);
    doc.text(`Tanggal Transaksi:   ${convertToLocaleDateString(date[0].startDate, "short")} - ${convertToLocaleDateString(date[0].endDate, "short")}`, 15, 30);

    autoTable(doc, {
      margin: {
        top: 40,
      },
      head: [["ID Transaksi", "Pelanggan", "Tanggal", "Barang", "Harga Total"]],
      body: mappedTransactions.length ? mappedTransactions : [[{ colSpan: 5, content: "Data Transaksi tidak ada", styles: { halign: "center" } }]],
    });

    doc.output("dataurlnewwindow");
  };

  return (
    <div className="flex items-end gap-5 mb-10 print:hidden">
      <div className="flex items-end gap-5 w-full">
        <div className="w-full max-w-xs relative inline-block">
          <Input
            className="w-full"
            size="md"
            type="text"
            label="Tanggal"
            labelPlacement="outside"
            placeholder={`  ${convertToLocaleDateString(date[0].startDate)} - ${convertToLocaleDateString(date[0].endDate)}`}
            onFocus={() => {
              setIsDatePickerOpened(true);
              setIsDateShown(true);
            }}
            onBlur={handleDateInputBlur}
            ref={inputDateRef}
            startContent={<IoCalendar className="text-xl text-default-400 pointer-events-none flex-shrink-0" />}
          />

          <div
            id="datePickerContainer"
            className={twMerge("absolute z-20", isDateShown ? "block" : "hidden")}
            onMouseEnter={() => setIsDatePickerHovered(true)}
            onMouseLeave={() => setIsDatePickerHovered(false)}
            onClick={() => {
              inputDateRef.current?.focus();
            }}
          >
            <DateRangePicker
              onChange={(item) => {
                setDate([item.selection]);
                console.log(item);
              }}
              moveRangeOnFirstSelection={false}
              months={1}
              ranges={date}
              direction="horizontal"
            />
          </div>
        </div>

        <div>
          <Button
            color="primary"
            className="font-semibold"
            onClick={() => {
              setDateRange({
                from: +date[0].startDate,
                to: +date[0].endDate,
              });
            }}
          >
            Tampilkan
          </Button>
        </div>
      </div>

      <div>
        <Button onClick={handlerExportPdf} color="primary" variant="bordered" className="font-semibold" startContent={<TbReportAnalytics size={20} />}>
          Export
        </Button>
      </div>
    </div>
  );
}
