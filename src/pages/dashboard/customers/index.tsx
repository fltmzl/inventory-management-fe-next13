import React from "react";
import MainLayout from "../components/Layout/MainLayout";
import Customers from "./components/Main/Customers";

export default function CustomersPage() {
  return (
    <MainLayout title="Data Pelanggan">
      <Customers />
    </MainLayout>
  );
}
