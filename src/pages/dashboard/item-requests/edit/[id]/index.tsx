import AddItemRequest from "@/sections/dashboard/item-requests/add/AddItemRequest";
import { api } from "@/utils/axios";
import { getInputDateTimeLocal } from "@/utils/dateTime";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

const getInitialData = async (
  id: string,
): Promise<{
  inventoryItems: Inventory[];
  customerItems: Customer[];
  userItems: User[];
  initialItemRequest: ItemRequest;
}> => {
  const inventory = api.get<ApiSuccessResponse<Inventory[]>>("/barang");
  const customer = api.get<ApiSuccessResponse<Customer[]>>("/pelanggan");
  const user = api.get<ApiSuccessResponse<User[]>>("/pegawai");
  const initialData = api.get<ApiSuccessResponse<ItemRequest>>(
    `/permintaan-barang/${id}`,
  );

  const [inventoryData, customerData, userData, initialItemRequest] =
    await Promise.all([inventory, customer, user, initialData]);

  return {
    inventoryItems: inventoryData.data.data,
    customerItems: customerData.data.data,
    userItems: userData.data.data,
    initialItemRequest: initialItemRequest.data.data,
  };
};

export const getServerSideProps = (async (ctx) => {
  const params = ctx.params as { id: string };
  const initialData = await getInitialData(params.id);

  return {
    props: {
      initialData: {
        inventoryItems: initialData.inventoryItems,
        customerItems: initialData.customerItems,
        userItems: initialData.userItems,
        initialItemRequest: initialData.initialItemRequest,
      },
    },
  };
}) satisfies GetServerSideProps<{
  initialData: {
    inventoryItems: Inventory[];
    customerItems: Customer[];
    userItems: User[];
    initialItemRequest: ItemRequest;
  };
}>;

export default function AddItemRequestPage({
  initialData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <AddItemRequest
      inventoryItems={initialData.inventoryItems}
      customerItems={initialData.customerItems}
      userItems={initialData.userItems}
      isEditForm
      initialDataForEdit={{
        ...initialData.initialItemRequest,
        tanggal: getInputDateTimeLocal(initialData.initialItemRequest.tanggal),
      }}
    />
  );
}
