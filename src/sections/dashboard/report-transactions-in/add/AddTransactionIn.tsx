import React from "react";
import MainLayout from "../../components/Layout/MainLayout";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useSWRConfig } from "swr";
import { api } from "@/utils/axios";
import { TransactionOutBody } from "@/types/transactionOutBody";
import TransactionInForm from "../components/Form/TransactionInForm";

type AddTransactionOutProps = {
  inventoryItems: Inventory[];
  itemRequestItems: ItemRequest[];
};

export type ItemsProps = {
  id: string;
  price: number;
  total: number;
};

export default function AddTransactionIn({
  inventoryItems,
  itemRequestItems,
}: AddTransactionOutProps) {
  const { mutate } = useSWRConfig();
  const router = useRouter();

  const onSubmit = async (values: TransactionOutBody, items: ItemsProps[]) => {
    const { id, itemRequest_id, date, totalPrice } = values;

    try {
      const user = await api.post("/transaksi-barang-keluar", {
        id,
        permintaanBarang_id: itemRequest_id,
        tanggal: new Date(date).toISOString(),
        hargaTotal: totalPrice,
        barang: items.map((item) => ({
          ...item,
          hargaSatuan: item.price,
          jumlah: item.total,
        })),
      });

      router.push("/dashboard/transactions-out");
      mutate("/transaksi-barang-keluar");
      toast.success(user.data.message);
    } catch (err) {
      console.log(err);
      toast.error("Gagal menambahkan transaksi barang keluar");
    }
  };

  return (
    <MainLayout title="Tambah Transaksi Barang Masuk">
      <div className="bg-background px-6 py-7 rounded-md">
        <TransactionInForm
          formType="NEW"
          onSubmit={onSubmit}
          initialValueOptions={{
            inventoryItems,
            itemRequestItems,
          }}
        />
      </div>
    </MainLayout>
  );
}
