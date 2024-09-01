"use client";

import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import { useAppDispatch, useAppSelector } from "@/redux/redux";
import { AnimatePresence, motion } from "framer-motion";
import { closeDrawer } from "@/redux/features/drawerSlice";
import { twMerge } from "tailwind-merge";
import { useMediaQuery } from "@/hooks/custom/useMediaQuery";

export default function Drawer() {
  const drawer = useAppSelector((state) => state.drawer);
  const dispatch = useAppDispatch();
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  const onClickBackdrop = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    dispatch(closeDrawer());

    e.stopPropagation();
  };

  return (
    <>
      <AnimatePresence>
        <motion.aside
          variants={{
            hidden: {
              translateX: isLargeScreen ? 0 : "-100%",
            },
            visible: {
              translateX: 0,
            },
          }}
          initial="hidden"
          transition={{
            type: "spring",
            duration: 0.2,
            bounce: 0.2,
          }}
          animate={drawer.isOpen ? "visible" : "hidden"}
          exit="hidden"
          className={twMerge("absolute lg:static z-50")}
        >
          <Sidebar />
        </motion.aside>
      </AnimatePresence>

      {/* Backdrop Drawer */}
      <motion.div
        variants={{
          hidden: {
            display: "none",
          },
          visible: {
            display: "block",
          },
        }}
        initial="hidden"
        animate={drawer.isOpen ? "visible" : "hidden"}
        className="fixed z-40 inset-0 bg-gray-700/20 backdrop-blur-[2px]"
        onClick={onClickBackdrop}
      ></motion.div>
    </>
  );
}
