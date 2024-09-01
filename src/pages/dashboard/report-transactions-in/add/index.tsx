import { api } from "@/utils/axios";
import AddTransactionOut from "./AddTransactionOut";

const getInventoryItems = async () => {
  const { data } = await api.get<ApiSuccessResponse<Inventory[]>>("/barang");
  return data.data;
};

const getInitialData = async () => {
  const inventory = api.get<ApiSuccessResponse<Inventory[]>>("/barang");
  const itemRequest = api.get<ApiSuccessResponse<ItemRequest[]>>("/permintaan-barang");

  const [inventoryData, itemRequestData] = await Promise.all([inventory, itemRequest]);

  return {
    inventoryItems: inventoryData.data.data,
    itemRequestItems: itemRequestData.data.data,
  };
};

export default async function AddTransactionInPage() {
  const initialData = await getInitialData();

  return <AddTransactionOut inventoryItems={initialData.inventoryItems} itemRequestItems={initialData.itemRequestItems} />;
}
