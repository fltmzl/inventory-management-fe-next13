"use client";

import useSWR from "swr";
import { api } from "@/utils/axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import InventoryForm from "../Form/InventoryForm";
import { InventoryBody } from "../Form/inventoryBody";
import useMutateState from "@/hooks/custom/useMutate";

export default function InventoryDetail({ id }: { id: string }) {
  const router = useRouter();
  const { data, isLoading } = useSWR<ApiSuccessResponse<Inventory>>(`/barang/${id}`);
  const { isMutate, setIsMutate } = useMutateState();

  if (isLoading) return <p>loading borrr EDIT.....</p>;

  const inventory = data!.data;

  const initialForm: InventoryBody = {
    id: inventory.id,
    name: inventory.nama,
    stock: inventory.stok,
    price: inventory.harga,
    category_id: inventory.kategori.id,
    unit_id: inventory.satuan.id,
  };

  const onSubmit = async (values: InventoryBody) => {
    const { id, name, stock, price, category_id, unit_id } = values;

    try {
      setIsMutate(true);
      const customer = await api.put(`/barang/${id}`, {
        id,
        nama: name,
        stok: Number(stock),
        harga: Number(price),
        kategori_id: category_id,
        satuan_id: unit_id,
      });

      router.push("/dashboard/inventories");
      toast.success(customer.data.message);
    } catch (err) {
      console.log(err);
      toast.error("Gagal mengedit data barang");
    } finally {
      setIsMutate(false);
    }
  };

  return (
    <div className="bg-background px-6 py-7 rounded-md">
      <InventoryForm formType="EDIT" initialValues={initialForm} onSubmit={onSubmit} initialSelectedCategory={inventory.kategori} initialSelectedUnit={inventory.satuan} isMutate={isMutate} />
    </div>
  );
}
