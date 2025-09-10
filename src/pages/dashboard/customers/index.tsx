import MainLayout from "@/sections/dashboard/components/Layout/MainLayout";
import Customers from "@/sections/dashboard/customers/components/Main/Customers";
import React from "react";

export default function CustomersPage() {
  return (
    <MainLayout title="Data Pelanggan">
      <Customers />
    </MainLayout>
  );
}
