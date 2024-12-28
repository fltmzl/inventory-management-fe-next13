import useSWR from "swr";
import CustomerForm from "../Form/CustomerForm";
import { api } from "@/utils/axios";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import useMutateState from "@/hooks/custom/useMutate";
import SpinnerLoadingTable from "@/shared/components/SpinnerLoadingTable";
import { CustomerBody } from "@/types/customerBody";

export default function CustomerDetail({ id }: { id: string }) {
  const router = useRouter();
  const { data, isLoading } = useSWR<ApiSuccessResponse<Customer>>(
    `/pelanggan/${id}`,
  );
  const { isMutate, setIsMutate } = useMutateState();

  if (isLoading) return <SpinnerLoadingTable />;

  const customer = data!.data;

  const initialForm: CustomerBody = {
    id: customer.id,
    name: customer.nama,
    email: customer.email,
    phoneNumber: customer.telepon,
    address: customer.alamat,
  };

  const onSubmit = async (values: CustomerBody) => {
    const { id, name, address, email, phoneNumber } = values;
    try {
      setIsMutate(true);
      const customer = await api.put(`/pelanggan/${id}`, {
        id,
        nama: name,
        telepon: phoneNumber,
        email,
        alamat: address,
      });

      router.push("/dashboard/customers");
      toast.success(customer.data.message);
    } catch (err) {
      console.log(err);
      toast.error("Gagal mengedit data pelanggan");
    } finally {
      setIsMutate(false);
    }
  };

  return (
    <div className="bg-background px-6 py-7 rounded-md">
      <CustomerForm
        formType="EDIT"
        initialValues={initialForm}
        onSubmit={onSubmit}
        isMutate={isMutate}
      />
    </div>
  );
}
