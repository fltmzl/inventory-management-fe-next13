import React from "react";
import MainLayout from "../../components/Layout/MainLayout";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useSWRConfig } from "swr";
import { api } from "@/utils/axios";
import ItemRequestsForm from "../components/Form/ItemRequestsForm";
import useMutateState from "@/hooks/custom/useMutate";
import { ItemRequestsBody } from "@/types/itemRequestsBody";
import { v4 as uuidv4 } from "uuid";

type AddItemRequestsProps = {
  inventoryItems: Inventory[];
  customerItems: Customer[];
  userItems: User[];
  isEditForm?: boolean;
  initialDataForEdit?: ItemRequest;
};

export type ItemsProps = {
  id: string;
  total: number;
};

export default function AddItemRequest({
  inventoryItems,
  customerItems,
  userItems,
  isEditForm = false,
  initialDataForEdit,
}: AddItemRequestsProps) {
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const { isMutate, setIsMutate } = useMutateState();

  const onSubmit = async (values: ItemRequestsBody, items: ItemsProps[]) => {
    const { id, customer_id, user_id, date } = values;

    try {
      setIsMutate(true);

      if (isEditForm) {
        const permintaanBarang = await api.put(`/permintaan-barang/${id}`, {
          id,
          pelanggan_id: customer_id,
          pegawai_id: user_id,
          tanggal: new Date(date).toISOString(),
          barang: items.map((item) => ({
            ...item,
            jumlah: item.total,
          })),
        });

        toast.success(permintaanBarang.data.message);
      } else {
        const permintaanBarang = await api.post("/permintaan-barang", {
          id,
          pelanggan_id: customer_id,
          pegawai_id: user_id,
          tanggal: new Date(date).toISOString(),
          barang: items.map((item) => ({
            ...item,
            jumlah: item.total,
          })),
        });

        toast.success(permintaanBarang.data.message);
      }

      router.push("/dashboard/item-requests");
      mutate("/permintaan-barang");
    } catch (err) {
      console.log(err);

      if (isEditForm) {
        toast.error("Gagal mengedit permintaan barang");
      } else {
        toast.error("Gagal menambahkan permintaan barang");
      }
    } finally {
      setIsMutate(false);
    }
  };

  const initialItemValue = initialDataForEdit?.barang.map((item) => ({
    key: uuidv4(),
    id: item.id,
    total: item.jumlah,
  }));

  return (
    <MainLayout title="Tambah Permintaan Barang">
      <div className="bg-background px-6 py-7 rounded-md">
        {isEditForm ? (
          <ItemRequestsForm
            formType={"EDIT"}
            onSubmit={onSubmit}
            initialValues={{
              id: initialDataForEdit?.id as string,
              customer_id: initialDataForEdit?.pelanggan_id as string,
              date: initialDataForEdit?.tanggal as string,
              user_id: initialDataForEdit?.pegawai_id as string,
            }}
            initialValueOptions={{
              inventoryItems,
              customerItems,
              userItems,
              initialItemValue,
            }}
            isMutate={isMutate}
          />
        ) : (
          <ItemRequestsForm
            formType={"NEW"}
            onSubmit={onSubmit}
            initialValueOptions={{
              inventoryItems,
              customerItems,
              userItems,
            }}
            isMutate={isMutate}
          />
        )}
      </div>
    </MainLayout>
  );
}
