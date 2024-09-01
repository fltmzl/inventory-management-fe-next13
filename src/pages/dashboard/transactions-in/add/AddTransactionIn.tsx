"use client";

import React from "react";
import MainLayout from "../../components/Layout/MainLayout";
import TransactionInForm from "../components/Form/TransactionInForm";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import { api } from "@/utils/axios";
import { TransactionInBody } from "../components/Form/transactionInBody";
import useMutateState from "@/hooks/custom/useMutate";

type AddTransactionInProps = {
  inventoryItems: Inventory[];
};

export type ItemsProps = {
  id: string;
  price: number;
  total: number;
};

export default function AddTransactionIn({
  inventoryItems,
}: AddTransactionInProps) {
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const { isMutate, setIsMutate } = useMutateState();

  const onSubmit = async (values: TransactionInBody, items: ItemsProps[]) => {
    const { id, lotNumber, date, totalPrice } = values;

    try {
      setIsMutate(true);
      const user = await api.post("/transaksi-barang-masuk", {
        id,
        nomorLot: lotNumber,
        tanggal: new Date(date).toISOString(),
        hargaTotal: totalPrice,
        barang: items.map((item) => ({
          ...item,
          hargaSatuan: item.price,
          jumlah: item.total,
        })),
      });

      router.push("/dashboard/transactions-in");
      mutate("/transaksi-barang-masuk");
      toast.success(user.data.message);
    } catch (err) {
      console.log(err);
      toast.error("Gagal menambahkan transaksi barang masuk");
    } finally {
      setIsMutate(false);
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
          }}
          isMutate={isMutate}
        />
      </div>
    </MainLayout>
  );
}
