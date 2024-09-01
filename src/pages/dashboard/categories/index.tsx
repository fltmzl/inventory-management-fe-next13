import React from "react";
import MainLayout from "../components/Layout/MainLayout";
import Categories from "./components/Main/Categories";

export default function CategoriesPage() {
  return (
    <MainLayout title="Kategori Barang">
      <Categories />
    </MainLayout>
  );
}
