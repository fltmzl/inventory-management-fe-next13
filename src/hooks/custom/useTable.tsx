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
  initialRowsPerPage = 5,
}: useTableProps<T>): Table<T> {
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const [page, setPage] = useState(1);
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(initialVisibleColumns),
  );
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: columnToSearch,
    direction: "ascending",
  });

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [columns, visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredData = [...data];

    if (hasSearchFilter) {
      filteredData = filteredData.filter((data) =>
        data[columnToSearch as "nama"]
          .toLowerCase()
          .includes(filterValue.toLowerCase()),
      );
    }

    return filteredData;
  }, [data, filterValue, hasSearchFilter, columnToSearch]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof DataWithNamaProperty<T>];
      const second = b[sortDescriptor.column as keyof DataWithNamaProperty<T>];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

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
