import { api } from "@/utils/axios";
import AddTransactionOut from "./AddTransactionOut";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

const getInitialData = async () => {
  const inventory = api.get<ApiSuccessResponse<Inventory[]>>("/barang");
  const itemRequest =
    api.get<ApiSuccessResponse<ItemRequest[]>>("/permintaan-barang");

  const [inventoryData, itemRequestData] = await Promise.all([
    inventory,
    itemRequest,
  ]);

  return {
    inventoryItems: inventoryData.data.data,
    itemRequestItems: itemRequestData.data.data,
  };
};

export const getServerSideProps = (async () => {
  const { inventoryItems, itemRequestItems } = await getInitialData();

  return {
    props: {
      inventoryItems,
      itemRequestItems,
    },
  };
}) satisfies GetServerSideProps<{
  inventoryItems: Inventory[];
  itemRequestItems: ItemRequest[];
}>;

export default function AddTransactionInPage({
  inventoryItems,
  itemRequestItems,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <AddTransactionOut
      inventoryItems={inventoryItems}
      itemRequestItems={itemRequestItems}
    />
  );
}
