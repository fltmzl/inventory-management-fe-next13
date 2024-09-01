import React from "react";
import MainLayout from "../components/Layout/MainLayout";
import ItemRequests from "./components/Main/ItemRequests";

export default function ItemRequestsPage() {
  return (
    <MainLayout title="Permintaan Barang">
      <ItemRequests />
    </MainLayout>
  );
}
