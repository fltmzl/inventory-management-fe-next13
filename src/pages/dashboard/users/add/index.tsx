import React from "react";
import { api } from "@/utils/axios";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useSWRConfig } from "swr";
import useMutateState from "@/hooks/custom/useMutate";
import UserForm from "@/sections/dashboard/users/components/Form/UserForm";
import { UserBody } from "@/types/userBody";
import MainLayout from "@/sections/dashboard/components/Layout/MainLayout";

export default function AddUserPage() {
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const { isMutate, setIsMutate } = useMutateState();

  const onSubmit = async (values: UserBody) => {
    const { address, email, fullname, password, phoneNumber, role, username } =
      values;
    try {
      setIsMutate(true);
      const user = await api.post("/pegawai", {
        namaLengkap: fullname,
        username,
        email,
        foto: "",
        telepon: phoneNumber,
        password,
        alamat: address,
        role: role.toUpperCase(),
      });

      router.push("/dashboard/users");
      mutate("/pegawai");
      toast.success(user.data.message);
    } catch (err) {
      console.log(err);
      toast.error("Gagal menambahkan data keryawan");
    } finally {
      setIsMutate(false);
    }
  };

  return (
    <MainLayout title="Tambah Data Karyawan">
      <div className="bg-background px-6 py-7 rounded-md">
        <UserForm onSubmit={onSubmit} formType="NEW" isMutate={isMutate} />
      </div>
    </MainLayout>
  );
}
