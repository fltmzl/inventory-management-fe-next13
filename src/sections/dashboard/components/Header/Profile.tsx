import { logout } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/redux";
import {
  Badge,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User as UserProfile,
} from "@nextui-org/react";
import React from "react";
import { BiLogOut } from "react-icons/bi";
import { IoChevronDownOutline } from "react-icons/io5";
import useSWR from "swr";

export default function Profile() {
  const dispatch = useAppDispatch();
  const { data, isLoading } = useSWR<User>("/auth/profile");

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Dropdown placement="bottom-start">
      <DropdownTrigger>
        <div className="flex gap-7 items-center cursor-pointer">
          <UserProfile
            as="button"
            avatarProps={{
              size: "sm",
              src: "/assets/img/profile-300.png",
            }}
            className="transition-transform"
            classNames={{
              name: "text-xs",
              description: "text-[10px]",
            }}
            description={data?.email}
            name={data?.namaLengkap}
          />

          <IoChevronDownOutline size={20} />
        </div>
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-medium mb-1">Signed in as</p>
          <div className="flex gap-2 items-center">
            <p className="font-bold">{data?.namaLengkap}</p>
            <Chip size="sm" color="primary">
              {data?.role}
            </Chip>
          </div>
        </DropdownItem>
        {/* <DropdownItem key="settings">My Settings</DropdownItem>
        <DropdownItem key="team_settings">Team Settings</DropdownItem>
        <DropdownItem key="analytics">Analytics</DropdownItem>
        <DropdownItem key="system">System</DropdownItem>
        <DropdownItem key="configurations">Configurations</DropdownItem>
        <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem> */}
        <DropdownItem
          key="logout"
          color="danger"
          startContent={<BiLogOut size={20} />}
          onClick={handleLogout}
        >
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
