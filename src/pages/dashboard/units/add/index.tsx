import React from "react";
import { useSWRConfig } from "swr";
import { useRouter } from "next/router";
import { api } from "@/utils/axios";
import toast from "react-hot-toast";
import useMutateState from "@/hooks/custom/useMutate";
import { CategoryBody } from "@/types/categoryBody";
import MainLayout from "@/sections/dashboard/components/Layout/MainLayout";
import UnitForm from "@/sections/dashboard/units/components/Form/UnitForm";

export default function AddUnitPage() {
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const { isMutate, setIsMutate } = useMutateState();

  const onSubmit = async (values: CategoryBody) => {
    const { code, name } = values;
    try {
      setIsMutate(true);
      const user = await api.post("/satuan", {
        kode: code,
        nama: name,
      });

      router.push("/dashboard/units");
      mutate("/units");
      toast.success(user.data.message);
    } catch (err) {
      console.log(err);
      toast.error("Gagal menambahkan data satuan");
    } finally {
      setIsMutate(false);
    }
  };

  return (
    <MainLayout title="Tambah Satuan">
      <div className="bg-background px-6 py-7 rounded-md">
        <UnitForm onSubmit={onSubmit} formType="NEW" isMutate={isMutate} />
      </div>
    </MainLayout>
  );
}
