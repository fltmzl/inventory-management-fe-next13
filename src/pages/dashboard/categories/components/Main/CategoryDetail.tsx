"use client";

import React from "react";
import CategoryForm from "../Form/CategoryForm";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { api } from "@/utils/axios";
import toast from "react-hot-toast";
import useMutateState from "@/hooks/custom/useMutate";

type CategoryDetailProps = {
  id: string;
};

export default function CategoryDetail({ id }: CategoryDetailProps) {
  const router = useRouter();
  const { data, isLoading } = useSWR<ApiSuccessResponse<Category>>(`/kategori/${id}`);
  const { isMutate, setIsMutate } = useMutateState();

  if (isLoading) return <p>loading kategori edit</p>;

  const category = data!.data;

  const initialForm: CategoryBody = {
    code: category.kode,
    name: category.nama,
  };

  const onSubmit = async (values: CategoryBody) => {
    const { code, name } = values;

    try {
      setIsMutate(true);
      const category = await api.put(`/kategori/${id}`, {
        kode: code,
        nama: name,
      });

      router.push("/dashboard/categories");
      toast.success(category.data.message);
    } catch (err) {
      console.log(err);
      toast.error("Gagal mengedit data kategori");
    } finally {
      setIsMutate(false);
    }
  };

  return (
    <div className="bg-background px-6 py-7 rounded-md">
      <CategoryForm formType="EDIT" initialValues={initialForm} onSubmit={onSubmit} isMutate={isMutate} />
    </div>
  );
}
