import useSWR from "swr";
import UserForm from "../Form/UserForm";
import { api } from "@/utils/axios";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import SpinnerLoadingTable from "@/shared/components/SpinnerLoadingTable";
import { UserBody } from "@/types/userBody";

export default function UserDetail({ id }: { id: string }) {
  const router = useRouter();
  const { data, isLoading } = useSWR(`/pegawai/${id}`);
  const [isMutate, setIsMutate] = useState(false);

  if (isLoading) return <SpinnerLoadingTable />;

  const initialForm = {
    fullname: data.data.namaLengkap,
    username: data.data.username,
    email: data.data.email,
    password: "",
    confirmPassword: "",
    phoneNumber: data.data.telepon,
    address: data.data.alamat,
    role: data.data.role,
  };

  const onSubmit = async (values: UserBody) => {
    const { address, email, fullname, password, phoneNumber, role, username } =
      values;
    try {
      setIsMutate(true);
      const user = await api.put(`/pegawai/${id}`, {
        namaLengkap: fullname,
        username,
        email,
        foto: "",
        telepon: phoneNumber,
        alamat: address,
        role: role.toUpperCase(),
      });

      router.push("/dashboard/users");
      toast.success(user.data.message);
    } catch (err) {
      console.log(err);
    } finally {
      setIsMutate(false);
    }
  };

  return (
    <div className="bg-background px-6 py-7 rounded-md">
      <UserForm
        formType="EDIT"
        initialValues={initialForm}
        isMutate={isMutate}
        onSubmit={onSubmit}
      />
    </div>
  );
}
