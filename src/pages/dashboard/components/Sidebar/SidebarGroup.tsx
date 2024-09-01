"use client";

import React, { useState } from "react";
import { IoChevronDownOutline } from "react-icons/io5";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

type SidebarGroupProps = {
  children: React.ReactNode;
  label: string;
  icon: React.ReactElement;
  openByDefault?: boolean;
};

export default function SidebarGroup({ children, icon, label = "Label", openByDefault = true }: SidebarGroupProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);

  return (
    <div>
      <button className="py-4 flex justify-between items-center w-full" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        <div className="flex gap-3 text-sm">
          <div>{icon}</div>
          <div className="font-medium">{label}</div>
        </div>
        <IoChevronDownOutline size={20} className={twMerge("origin-center duration-300", isDropdownOpen ? "rotate-0" : "rotate-90")} />
      </button>
      <motion.div
        variants={{
          hidden: {
            height: 0,
          },
          visible: {
            height: "auto",
          },
        }}
        transition={{
          duration: 0.1,
        }}
        initial="hidden"
        animate={isDropdownOpen ? "visible" : "hidden"}
        className="pl-5 space-y-2 overflow-hidden"
      >
        {children}
      </motion.div>
    </div>
  );
}
