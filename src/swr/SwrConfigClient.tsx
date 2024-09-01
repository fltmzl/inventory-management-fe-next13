import React from "react";
import { SWRConfig } from "swr";
import { fetcher } from "./fetcher";

type SwrConfigClientProps = {
  children: React.ReactNode;
};

export default function SwrConfigClient({ children }: SwrConfigClientProps) {
  return (
    <SWRConfig
      value={{
        fetcher: fetcher,
      }}
    >
      {children}
    </SWRConfig>
  );
}
