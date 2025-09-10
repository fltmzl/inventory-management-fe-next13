import useSWR from "swr";
import CategoriesTable from "../Table/CategoriesTable";
import SpinnerLoadingTable from "@/shared/components/SpinnerLoadingTable";

export default function Categories() {
  const { data, isLoading } = useSWR("/kategori");

  if (isLoading) return <SpinnerLoadingTable />;

  return <CategoriesTable categories={data.data} />;
}
