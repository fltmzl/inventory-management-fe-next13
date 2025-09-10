import MainLayout from "@/sections/dashboard/components/Layout/MainLayout";
import UnitDetail from "@/sections/dashboard/units/components/Main/UnitDetail";
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

export default function EditUnitPage({ params }: { params: { id: string } }) {
  return (
    <MainLayout title="Edit Satuan">
      <UnitDetail id={params.id} />
    </MainLayout>
  );
}
