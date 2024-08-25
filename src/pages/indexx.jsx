import React from "react";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div>Hello world</div>
      <Image alt="test" width={40} height={100} style={{ backgroundColor: "red" }} />
    </div>
  );
}
