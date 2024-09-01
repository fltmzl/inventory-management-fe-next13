import MainLayout from "@/pages/dashboard/components/Layout/MainLayout";
import React from "react";
import CategoryDetail from "../../components/Main/CategoryDetail";
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

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  return (
    <MainLayout title="Edit Kategori">
      <CategoryDetail id={params.id} />
    </MainLayout>
  );
}
