import React from "react";
import { GetServerSideProps } from "next";
import MainLayout from "@/sections/dashboard/components/Layout/MainLayout";
import CustomerDetail from "@/sections/dashboard/customers/components/Main/CustomerDetail";

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
    <MainLayout title="Edit Data Pelanggan">
      <CustomerDetail id={params.id} />
    </MainLayout>
  );
}
