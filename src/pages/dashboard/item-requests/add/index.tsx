import { api } from "@/utils/axios";
import AddItemRequest from "./AddItemRequest";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

const getInitialData = async (): Promise<{
  inventoryItems: Inventory[];
  customerItems: Customer[];
  userItems: User[];
}> => {
  const inventory = api.get<ApiSuccessResponse<Inventory[]>>("/barang");
  const customer = api.get<ApiSuccessResponse<Customer[]>>("/pelanggan");
  const user = api.get<ApiSuccessResponse<User[]>>("/pegawai");

  const [inventoryData, customerData, userData] = await Promise.all([
    inventory,
    customer,
    user,
  ]);

  return {
    inventoryItems: inventoryData.data.data,
    customerItems: customerData.data.data,
    userItems: userData.data.data,
  };
};

export const getServerSideProps = (async (ctx) => {
  const initialData = await getInitialData();

  return {
    props: {
      initialData: {
        inventoryItems: initialData.inventoryItems,
        customerItems: initialData.customerItems,
        userItems: initialData.userItems,
      },
    },
  };
}) satisfies GetServerSideProps<{
  initialData: {
    inventoryItems: Inventory[];
    customerItems: Customer[];
    userItems: User[];
  };
}>;

export default function AddTransactionInPage({
  initialData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // const initialData = await getInitialData();

  return (
    <AddItemRequest
      inventoryItems={initialData.inventoryItems}
      customerItems={initialData.customerItems}
      userItems={initialData.userItems}
    />
  );
}
