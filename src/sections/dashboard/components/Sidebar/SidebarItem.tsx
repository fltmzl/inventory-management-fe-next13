import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { twMerge } from "tailwind-merge";

type SidebarItemProps = {
  href: string;
  icon: React.ReactElement;
  title: string;
};

export default function SidebarItem({
  href,
  icon,
  title = "Title",
}: SidebarItemProps) {
  const router = useRouter();
  const pathname = router.pathname;

  let isTabActive = pathname.startsWith(href);

  if (href === "/dashboard") {
    isTabActive = pathname === "/dashboard";
  }

  return (
    <Link
      href={href}
      className={twMerge(
        "flex items-center gap-3 py-3 text-sm",
        isTabActive &&
          "bg-primary-50 dark:bg-primary-800/50 text-primary-700 dark:text-primary-400 rounded-xl px-5",
      )}
    >
      {icon}
      <span className="font-medium">{title}</span>
    </Link>
  );
}
