import toast from "react-hot-toast";
import { api } from "@/utils/axios";
import { useRouter } from "next/router";
import { useSWRConfig } from "swr";
import useMutateState from "@/hooks/custom/useMutate";
import MainLayout from "@/sections/dashboard/components/Layout/MainLayout";
import InventoryForm from "@/sections/dashboard/inventories/components/Form/InventoryForm";
import { InventoryBody } from "@/types/inventoryBody";

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
