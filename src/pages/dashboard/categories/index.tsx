import Categories from "@/sections/dashboard/categories/components/Main/Categories";
import MainLayout from "@/sections/dashboard/components/Layout/MainLayout";
import React from "react";

export default function CategoriesPage() {
  return (
    <MainLayout title="Kategori Barang">
      <Categories />
    </MainLayout>
  );
}
