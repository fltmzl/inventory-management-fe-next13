// import MainLayout from "@/pages/dashboard/components/Layout/MainLayout";
import React from "react";
import { GetServerSideProps } from "next";
import MainLayout from "@/sections/dashboard/components/Layout/MainLayout";
import InventoryDetail from "@/sections/dashboard/inventories/components/Main/InventoryDetail";

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

export default function InventoryEditPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <MainLayout title="Edit Barang">
      <InventoryDetail id={params.id} />
    </MainLayout>
  );
}
