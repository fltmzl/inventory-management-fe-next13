import MainLayout from "@/sections/dashboard/components/Layout/MainLayout";
import Inventories from "@/sections/dashboard/inventories/components/Main/Inventories";
import React from "react";

export default function CustomersPage() {
  return (
    <MainLayout title="Data Barang">
      <Inventories />
    </MainLayout>
  );
}
