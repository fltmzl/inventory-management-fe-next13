import React from "react";
import MainLayout from "../../components/Layout/MainLayout";
import CategoryForm from "../components/Form/CategoryForm";
import { useSWRConfig } from "swr";
import { useRouter } from "next/navigation";
import { api } from "@/utils/axios";
import toast from "react-hot-toast";
import useMutateState from "@/hooks/custom/useMutate";

export default function AddCategoryPage() {
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const { isMutate, setIsMutate } = useMutateState();

  const onSubmit = async (values: CategoryBody) => {
    const { code, name } = values;
    try {
      setIsMutate(true);
      const user = await api.post("/kategori", {
        kode: code,
        nama: name,
      });

      router.push("/dashboard/categories");
      mutate("/categories");
      toast.success(user.data.message);
    } catch (err) {
      console.log(err);
      toast.error("Gagal menambahkan data kategori");
    } finally {
      setIsMutate(false);
    }
  };

  return (
    <MainLayout title="Tambah Data Kategori">
      <div className="bg-background px-6 py-7 rounded-md">
        <CategoryForm onSubmit={onSubmit} formType="NEW" isMutate={isMutate} />
      </div>
    </MainLayout>
  );
}
