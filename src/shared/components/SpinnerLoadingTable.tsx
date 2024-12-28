import { Spinner } from "@nextui-org/react";
import React from "react";

export default function SpinnerLoadingTable() {
  return (
    <div className="w-full h-[70vh] grid place-content-center">
      <Spinner color="success" size="lg" />
    </div>
  );
}
