import React from "react";
import { RxDashboard } from "react-icons/rx";
import { HiOutlineUsers } from "react-icons/hi2";
import { PiUsersThree } from "react-icons/pi";
import { BsBoxSeam } from "react-icons/bs";
import { TbWeight } from "react-icons/tb";
import { TbReportAnalytics } from "react-icons/tb";
import { IoReceiptOutline } from "react-icons/io5";
import { LuTags } from "react-icons/lu";
import SidebarGroup from "./SidebarGroup";
import SidebarItem from "./SidebarItem";

export default function Sidebar() {
  return (
    <>
      <div className="flex flex-col shadow-md min-w-72 h-screen bg-background">
        <div className="border-b-1 mx-6 py-6 border-gray-300/40">
          <p className="font-bold text-4xl text-center">Logo</p>
        </div>

        {/* Navbar */}
        <div className="py-8 px-4 space-y-2 h-full overflow-y-auto">
          <SidebarItem href="/dashboard" icon={<RxDashboard size={20} />} title="Dashboard" />
          <SidebarItem href="/dashboard/users" icon={<HiOutlineUsers size={20} />} title="Data Karyawan" />
          <SidebarItem href="/dashboard/customers" icon={<PiUsersThree size={20} />} title="Data Pelanggan" />
          <SidebarItem href="/dashboard/inventories" icon={<BsBoxSeam size={20} />} title="Data Stok Barang" />
          <SidebarItem href="/dashboard/categories" icon={<LuTags size={20} />} title="Kategori Barang" />
          <SidebarItem href="/dashboard/units" icon={<TbWeight size={20} />} title="Satuan Barang" />
          <SidebarItem href="/dashboard/item-requests" icon={<TbWeight size={20} />} title="Permintaan Barang" />

          <SidebarGroup icon={<IoReceiptOutline size={20} />} label="Transaksi">
            <SidebarItem href="/dashboard/transactions-in" icon={<IoReceiptOutline size={20} />} title="Barang Masuk" />
            <SidebarItem href="/dashboard/transactions-out" icon={<IoReceiptOutline size={20} />} title="Barang Keluar" />
          </SidebarGroup>

          <SidebarGroup icon={<TbReportAnalytics size={20} />} label="Laporan">
            <SidebarItem href="/dashboard/report-stock" icon={<TbReportAnalytics size={20} />} title="Laporan Stok" />
            <SidebarItem href="/dashboard/report-transactions-in" icon={<TbReportAnalytics size={20} />} title="Laporan Barang Masuk" />
            <SidebarItem href="/dashboard/report-transactions-out" icon={<TbReportAnalytics size={20} />} title="Laporan Barang Keluar" />
          </SidebarGroup>
        </div>
      </div>
    </>
  );
}
