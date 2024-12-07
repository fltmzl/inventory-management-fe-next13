import { Spinner } from "@nextui-org/react";
import React from "react";

export default function SpinnerLoading() {
  return (
    <div className="w-full min-h-72 grid place-content-center">
      <Spinner />
    </div>
  );
}
