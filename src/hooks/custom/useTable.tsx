import { Selection, SortDescriptor } from "@nextui-org/react";
import {
  useState,
  useMemo,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { useMediaQuery } from "./useMediaQuery";

type DataWithNamaProperty<T> = T extends { nama: any }
  ? T extends { id: any }
    ? T
    : never
  : any;

type useTableProps<T> = {
  columns: {
    uid: string;
    name: string;
    sortable?: boolean;
  }[];
  initialVisibleColumns: string[];
  data: DataWithNamaProperty<T>[];
  columnToSearch?: any;
  initialRowsPerPage?: number;
  initialSortDescriptor?: SortDescriptor;
};

export type HeaderColumn = {
  name: string;
  uid: string;
  sortable?: boolean;
};

export type Table<T> = {
  page: number;
  pages: number;
  setPage: Dispatch<SetStateAction<number>>;
  filterValue: string;
  selectedKeys: Selection;
  setSelectedKeys: Dispatch<SetStateAction<Selection>>;
  visibleColumns: Selection;
  setVisibleColumns: Dispatch<SetStateAction<Selection>>;
  rowsPerPage: number;
  setRowsPerPage: Dispatch<SetStateAction<number>>;
  sortDescriptor: SortDescriptor;
  setSortDescriptor: Dispatch<SetStateAction<SortDescriptor>>;
  headerColumns: HeaderColumn[];
  sortedItems: DataWithNamaProperty<T>[];
  onRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onClear: () => void;
  onSearchChange: (value?: string) => void;
  isLargeScreen: boolean;
};

export default function useTable<T>({
  columns,
  initialVisibleColumns,
  data,
  columnToSearch = "nama",
  initialRowsPerPage = 50,
  initialSortDescriptor,
}: useTableProps<T>): Table<T> {
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const [page, setPage] = useState(1);
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(initialVisibleColumns),
  );
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>(
    initialSortDescriptor || {},
  );

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [columns, visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredData = [...(data || [])];

    if (hasSearchFilter) {
      filteredData = filteredData.filter((item) => {
        const valueToSearch = item[columnToSearch as "nama"];
        if (valueToSearch === null || valueToSearch === undefined) return false;
        return String(valueToSearch)
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      });
    }

    return filteredData;
  }, [data, filterValue, hasSearchFilter, columnToSearch]);

  const sortedData = useMemo(() => {
    if (!sortDescriptor || !sortDescriptor.column) {
      return filteredItems;
    }

    const columnKey = sortDescriptor.column as keyof DataWithNamaProperty<T>;

    return [...filteredItems].sort((a, b) => {
      const first = a[columnKey];
      const second = b[columnKey];

      const getComparableValue = (val: any): number | string => {
        if (val === null || val === undefined) return "";
        if (val instanceof Date) return val.getTime();

        // Handle nested object seperti pelanggan: { nama: "..." }
        if (typeof val === "object" && !Array.isArray(val)) {
          if ("nama" in val && typeof val.nama === "string") {
            return val.nama.toLowerCase();
          }
        }

        // Handle array
        if (Array.isArray(val)) return val.length;

        // Handle number
        if (typeof val === "number") return val;

        if (typeof val === "string") {
          const trimmed = val.trim();
          // Cek format tanggal ISO (misal "2024-09-13T..." atau "2024-09-13")
          if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
            const time = Date.parse(trimmed);
            if (!isNaN(time)) return time;
          }

          // Cek string numerik (misal "1500000" atau "250.5")
          if (trimmed !== "" && !isNaN(Number(trimmed))) {
            return Number(trimmed);
          }

          return trimmed.toLowerCase();
        }

        return String(val).toLowerCase();
      };

      const firstVal = getComparableValue(first);
      const secondVal = getComparableValue(second);

      let cmp = 0;
      if (typeof firstVal === "number" && typeof secondVal === "number") {
        cmp = firstVal < secondVal ? -1 : firstVal > secondVal ? 1 : 0;
      } else {
        cmp = String(firstVal).localeCompare(String(secondVal), undefined, {
          numeric: true,
          sensitivity: "base",
        });
      }

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [filteredItems, sortDescriptor]);

  const pages = Math.ceil(sortedData.length / rowsPerPage);

  const sortedItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sortedData.slice(start, end);
  }, [page, sortedData, rowsPerPage]);

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [setPage, setRowsPerPage],
  );

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  return {
    page,
    pages,
    setPage,
    filterValue,
    selectedKeys,
    setSelectedKeys,
    visibleColumns,
    setVisibleColumns,
    rowsPerPage,
    setRowsPerPage,
    sortDescriptor,
    setSortDescriptor,
    headerColumns,
    sortedItems,
    onRowsPerPageChange,
    onClear,
    onSearchChange,
    isLargeScreen,
  };
}
