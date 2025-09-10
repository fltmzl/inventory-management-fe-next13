import MainLayout from "@/sections/dashboard/components/Layout/MainLayout";
import ItemRequests from "@/sections/dashboard/item-requests/components/Main/ItemRequests";
import React from "react";

export default function ItemRequestsPage() {
  return (
    <MainLayout title="Permintaan Barang">
      <ItemRequests />
    </MainLayout>
  );
}
