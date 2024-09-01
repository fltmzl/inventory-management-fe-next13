import MainLayout from "@/pages/dashboard/components/Layout/MainLayout";
import React from "react";
import CustomerDetail from "../../components/Main/CustomerDetail";
import { GetServerSideProps } from "next";

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
  return (
    <MainLayout title="Edit Data Karyawan">
      <CustomerDetail id={params.id} />
    </MainLayout>
  );
}
