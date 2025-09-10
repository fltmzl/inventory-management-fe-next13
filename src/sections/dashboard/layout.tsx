import React, { useEffect } from "react";
import Drawer from "./components/Drawer/Drawer";
import { useAppDispatch, useAppSelector } from "@/redux/redux";
import { getUserFromToken } from "@/helpers/auth";
import { login } from "@/redux/features/authSlice";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const user = getUserFromToken();
    dispatch(login(user));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex">
      <Drawer />
      <main className="bg-zinc-200 dark:bg-neutral-950 flex-1 h-screen overflow-auto">
        {children}
      </main>
    </div>
  );
}
