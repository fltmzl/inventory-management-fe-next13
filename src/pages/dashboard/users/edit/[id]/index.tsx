import MainLayout from "@/pages/dashboard/components/Layout/MainLayout";
import React from "react";
import UserForm from "../../components/Form/UserForm";
import { api } from "@/utils/axios";
import useSWR from "swr";
import { useParams } from "next/navigation";
import { cookies } from "next/headers";
import UserDetail from "../../components/Main/UserDetail";
import { GetServerSideProps } from "next";

const getUserById = async (id: string) => {
  const res = await api.get<ApiSuccessResponse<User>>(`/pegawai/${id}`);
  // const res = await fetch(`http://localhost:3001/pegawai/${id}`, { cache: "no-cache" });
  // const data = await res.json();

  return res.data;
  // return data;
};

export const getServerSideProps = (async (ctx) => {
  const id = ctx.params?.id as string;

  return {
    props: {
      params: {
        id,
      },
    },
  };
}) satisfies GetServerSideProps<{ params: { id: string } }>;

export default function EditUserPage({ params }: { params: { id: string } }) {
  // // unstable_noStore();
  // const { data } = await getUserById(params.id);
  // // const { data, isLoading } = useSWR(`/pegawai/${params.id}`);

  // console.log(data);

  // // if (isLoading) return <p>Loading brooo EDIT</p>;

  // const initialForm = {
  //   fullname: data.namaLengkap,
  //   username: data.username,
  //   email: data.email,
  //   password: "",
  //   confirmPassword: "",
  //   phoneNumber: data.telepon,
  //   address: data.alamat,
  //   role: data.role,
  // };

  return (
    <MainLayout title="Edit Data Karyawan">
      {/* <div className="bg-background px-6 py-7 rounded-md">
        <UserForm formType="EDIT" userId={data.id} initialValues={initialForm} />
      </div> */}
      <UserDetail id={params.id} />
    </MainLayout>
  );
}
