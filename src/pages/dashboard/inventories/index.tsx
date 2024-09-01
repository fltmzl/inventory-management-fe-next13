import React from "react";
import MainLayout from "../components/Layout/MainLayout";
import Inventories from "./components/Main/Inventories";

export default function CustomersPage() {
  return (
    <MainLayout title="Data Barang">
      <Inventories />
    </MainLayout>
  );
}
