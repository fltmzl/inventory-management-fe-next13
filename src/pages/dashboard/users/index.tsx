import React from "react";
import Users from "@/sections/dashboard/users/components/Main/Users";
import MainLayout from "@/sections/dashboard/components/Layout/MainLayout";

export default function UsersPage() {
  return (
    <MainLayout title="Data Karyawan">
      <Users />
    </MainLayout>
  );
}
