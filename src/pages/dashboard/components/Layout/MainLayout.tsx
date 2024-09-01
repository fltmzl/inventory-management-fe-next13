import React from "react";
import Header from "../Header/Header";
import DashboardLayout from "../../layout";

type MainLayoutProps = {
  children: React.ReactNode;
  title?: string;
};

export default function MainLayout({ children, title = "Title Page" }: MainLayoutProps) {
  return (
    <DashboardLayout>
      <div>
        <Header />

        <div className="px-4 lg:px-6 py-9">
          <h1 className="text-3xl font-semibold">{title}</h1>

          <div className="mt-12">{children}</div>
        </div>
      </div>
    </DashboardLayout>
  );
}
