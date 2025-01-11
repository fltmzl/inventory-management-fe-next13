import React from "react";
import useSWR from "swr";
import TransactionsOutTable from "../Table/TransactionsOutTable";
import { DateRangePicker, DateValue, RangeValue } from "@nextui-org/react";
import { parseDate } from "@internationalized/date";
import { addDays, convertToDateString, today } from "@/utils/dateTime";
import SpinnerLoadingTable from "@/shared/components/SpinnerLoadingTable";

export default function TransactionsOut() {
  const { data, isLoading } = useSWR("/transaksi-barang-keluar");
  const [value, setValue] = React.useState<RangeValue<DateValue>>({
    start: parseDate(convertToDateString(today())),
    end: parseDate(convertToDateString(addDays(1))),
  });

  if (isLoading) return <SpinnerLoadingTable />;

  return (
    <>
      <TransactionsOutTable transactions={data.data} />
    </>
  );
}
