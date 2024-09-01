"use client";

import toast from "react-hot-toast";
import MainLayout from "../../components/Layout/MainLayout";
import InventoryForm from "../components/Form/InventoryForm";
import { api } from "@/utils/axios";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import { InventoryBody } from "../components/Form/inventoryBody";
import useMutateState from "@/hooks/custom/useMutate";

export default function AddInventoryPage() {
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const { isMutate, setIsMutate } = useMutateState();

  const onSubmit = async (values: InventoryBody) => {
    const { id, name, stock, price, category_id, unit_id } = values;
    try {
      setIsMutate(true);
      const barang = await api.post("/barang", {
        id,
        nama: name,
        stok: stock,
        harga: price,
        kategori_id: category_id,
        satuan_id: unit_id,
        pembelianTerakhir: new Date().toISOString(),
      });

      router.push("/dashboard/inventories");
      mutate("/inventories");
      toast.success(barang.data.message);
    } catch (err) {
      console.log(err);
      toast.error("Gagal menambahkan data barang");
    } finally {
      setIsMutate(false);
    }
  };
  return (
    <MainLayout title="Tambah Data Barang">
      <div className="bg-background px-6 py-7 rounded-md">
        <InventoryForm onSubmit={onSubmit} formType="NEW" isMutate={isMutate} />
      </div>
    </MainLayout>
  );
}
