import Image from "next/image";
import React from "react";

export default function BrandLogo() {
  return (
    <Image
      src="/assets/logo/banujaya.svg"
      alt="Banu Jaya"
      width={120}
      height={120}
      className=""
    />
  );
}
