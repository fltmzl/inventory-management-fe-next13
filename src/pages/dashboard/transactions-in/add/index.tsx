import { api } from "@/utils/axios";
import AddTransactionIn from "./AddTransactionIn";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

const getInventoryItems = async () => {
  const { data } = await api.get<ApiSuccessResponse<Inventory[]>>("/barang");
  return data.data;
};

export const getServerSideProps = (async () => {
  const inventoryItems = await getInventoryItems();

  return { props: { inventoryItems } };
}) satisfies GetServerSideProps<{ inventoryItems: Inventory[] }>;

export default function AddTransactionInPage({
  inventoryItems,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <AddTransactionIn inventoryItems={inventoryItems} />;
}
