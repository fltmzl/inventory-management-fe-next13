// import MainLayout from "@/pages/dashboard/components/Layout/MainLayout";
import React from "react";
import InventoryDetail from "../../components/Main/InventoryDetail";
import MainLayout from "@/pages/dashboard/components/Layout/MainLayout";
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

export default function InventoryEditPage({ params }: { params: { id: string } }) {
  return (
    <MainLayout title="Edit Barang">
      <InventoryDetail id={params.id} />
    </MainLayout>
  );
}
