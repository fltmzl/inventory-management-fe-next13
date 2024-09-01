import React from "react";
import MainLayout from "../components/Layout/MainLayout";
import Users from "./components/Main/Users";

export default function UsersPage() {
  return (
    <MainLayout title="Data Karyawan">
      <Users />
    </MainLayout>
  );
}
