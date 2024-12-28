import React, { useState } from "react";
import {
  Input,
  Button,
  Chip,
  User,
  ChipProps,
  Link,
  useDisclosure,
} from "@nextui-org/react";
import { IoIosAdd } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import { api } from "@/utils/axios";
import { toast } from "react-hot-toast";
import { useSWRConfig } from "swr";
import TableData from "@/shared/components/TableData";
import DeleteModal from "@/pages/dashboard/inventories/components/Table/DeleteModal";
import useTable from "@/hooks/custom/useTable";
import ShowRows from "@/shared/components/ShowRows";
import FilterShowColumn from "@/shared/components/FilterShowColumn";
import FooterTable from "@/shared/components/FooterTable";
import DefaultCell from "@/shared/components/DefaultCell";
import DefaultActionCell from "@/shared/components/DefaultActionCell";
import { columns } from "@/tables/user.table";

const statusColorMap: Record<string, ChipProps["color"]> = {
  ADMIN: "success",
  OWNER: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
  "namaLengkap",
  "username",
  "email",
  "role",
  "actions",
];

type UserTableProps = {
  users: User[];
};

export default function UserTable({ users }: UserTableProps) {
  const { mutate } = useSWRConfig();
  const table = useTable({
    columns: columns,
    data: users,
    initialVisibleColumns: INITIAL_VISIBLE_COLUMNS,
  });
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [itemToBeDeleted, setItemToBeDeleted] = useState("");

  const onOpenDeleteDialog = (id: string) => {
    setItemToBeDeleted(id);
    onOpen();
  };

  const onDeleteItem = async (userId: string) => {
    try {
      const user = await api.delete(`/pegawai/${userId}`);

      mutate("/pegawai");

      toast.success("Data karyawan berhasil dihapus");
      onClose();
    } catch (err) {
      console.log(err);
      toast.error("Gagal menghapus data");
    }
  };

  const renderCell = React.useCallback(
    (user: User, columnKey: React.Key) => {
      const cellValue = user[columnKey as keyof User];

      switch (columnKey) {
        case "namaLengkap":
          return (
            <User
              avatarProps={{ radius: "lg", src: user.foto }}
              description={user.email}
              name={cellValue}
            >
              {user.email}
            </User>
          );
        case "role":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[user.role]}
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
          );
        case "actions":
          return (
            <DefaultActionCell
              id={user.id}
              onOpenDeleteDialog={onOpenDeleteDialog}
            />
          );
        default:
          return <DefaultCell value={cellValue as string} />;
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onDeleteItem],
  );

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex flex-col lg:flex-row justify-between gap-3 items-center">
          <ShowRows table={table} />

          <div className="flex-1 flex justify-end gap-3">
            <FilterShowColumn table={table} columns={columns} />

            <Button
              as={Link}
              href="/dashboard/users/add"
              color="primary"
              className="font-semibold w-fit"
              startContent={<IoIosAdd size={20} />}
            >
              Karyawan
            </Button>
            {/* <Link href="/dashboard/users/add">Test</Link> */}

            <Input
              isClearable
              radius="md"
              className="w-full sm:max-w-[44%]"
              classNames={{
                inputWrapper: "py-0 h-full",
              }}
              size="sm"
              placeholder="Search by name..."
              startContent={<FiSearch />}
              value={table.filterValue}
              onClear={() => table.onClear()}
              onValueChange={table.onSearchChange}
            />
          </div>
        </div>
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  const bottomContent = React.useMemo(() => {
    return <FooterTable totalData={users.length} table={table} />;
  }, [table, users.length]);

  return (
    <>
      <TableData
        table={table}
        topContent={topContent}
        bottomContent={bottomContent}
        renderCell={renderCell}
        emptyTableContentMessage="Barang tidak ditemukan "
      />

      <DeleteModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Hapus Data Karyawan"
        desc="Apakah Anda yakin ingin menghapus data ini? Data akan dihapus secara permanen"
        itemIdToBeDeleted={itemToBeDeleted}
        onDelete={onDeleteItem}
      />
    </>
  );
}
