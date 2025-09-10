import React from "react";
import MainLayout from "@/sections/dashboard/components/Layout/MainLayout";
import Units from "@/sections/dashboard/units/components/Main/Units";

export default function UnitsPage() {
  return (
    <MainLayout title="Satuan Barang">
      <Units />
    </MainLayout>
  );
}
