"use client";

import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, User } from "@nextui-org/react";
import React from "react";
import { IoChevronDownOutline } from "react-icons/io5";

export default function Profile() {
  return (
    <Dropdown placement="bottom-start">
      <DropdownTrigger>
        <div className="flex gap-7 items-center cursor-pointer">
          <User
            as="button"
            avatarProps={{
              size: "sm",
              src: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
            }}
            className="transition-transform"
            classNames={{
              name: "text-xs",
              description: "text-[10px]",
            }}
            description="@tonyreichert"
            name="Tony Reichert"
          />

          <IoChevronDownOutline size={20} />
        </div>
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-bold">Signed in as</p>
          <p className="font-bold">@tonyreichert</p>
        </DropdownItem>
        <DropdownItem key="settings">My Settings</DropdownItem>
        <DropdownItem key="team_settings">Team Settings</DropdownItem>
        <DropdownItem key="analytics">Analytics</DropdownItem>
        <DropdownItem key="system">System</DropdownItem>
        <DropdownItem key="configurations">Configurations</DropdownItem>
        <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
        <DropdownItem key="logout" color="danger">
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
