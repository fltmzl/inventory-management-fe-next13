"use client";

import { Button, Switch } from "@nextui-org/react";
import React from "react";
import { HiMiniBars3BottomLeft } from "react-icons/hi2";
import { useAppDispatch } from "@/redux/redux";
import { toggleDrawer } from "@/redux/features/drawerSlice";
import Profile from "./Profile";
import { MdSunny } from "react-icons/md";
import { IoMdMoon } from "react-icons/io";
import { useTheme } from "next-themes";

export default function Header() {
  const dispatch = useAppDispatch();
  const { theme, setTheme } = useTheme();

  return (
    <header className="py-3 px-4 lg:px-6 flex justify-between bg-background w-full sticky top-0 z-30">
      <Button className="lg:hidden" isIconOnly variant="light" aria-label="drawer menu" onClick={() => dispatch(toggleDrawer())}>
        <HiMiniBars3BottomLeft size={30} />
      </Button>

      <div className="lg:ml-auto flex items-center gap-5">
        <Switch
          defaultSelected
          onValueChange={(isSelected) => {
            isSelected ? setTheme("dark") : setTheme("light");
          }}
          size="lg"
          color="secondary"
          thumbIcon={({ isSelected, className }) => (isSelected ? <MdSunny className={className} /> : <IoMdMoon className={className} />)}
        ></Switch>
        <Profile />
      </div>
    </header>
  );
}
