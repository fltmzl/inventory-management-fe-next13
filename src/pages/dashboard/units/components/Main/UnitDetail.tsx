"use client";

import React from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { api } from "@/utils/axios";
import toast from "react-hot-toast";
import UnitForm from "../Form/UnitForm";
import useMutateState from "@/hooks/custom/useMutate";

type UnitDetailProps = {
  id: string;
};

export default function UnitDetail({ id }: UnitDetailProps) {
  const router = useRouter();
  const { data, isLoading } = useSWR<ApiSuccessResponse<Unit>>(`/satuan/${id}`);
  const { isMutate, setIsMutate } = useMutateState();

  if (isLoading) return <p>loading satuan edit</p>;

  const unit = data!.data;

  const initialForm: CategoryBody = {
    code: unit.kode,
    name: unit.nama,
  };

  const onSubmit = async (values: CategoryBody) => {
    const { code, name } = values;

    try {
      setIsMutate(true);
      const unit = await api.put(`/satuan/${id}`, {
        kode: code,
        nama: name,
      });

      router.push("/dashboard/units");
      toast.success(unit.data.message);
    } catch (err) {
      console.log(err);
      toast.error("Gagal mengedit data satuan");
    } finally {
      setIsMutate(false);
    }
  };

  return (
    <div className="bg-background px-6 py-7 rounded-md">
      <UnitForm
        formType="EDIT"
        initialValues={initialForm}
        onSubmit={onSubmit}
        isMutate={isMutate}
      />
    </div>
  );
}
