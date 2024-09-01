// app/providers.tsx

import { store } from "@/redux/store";
import SwrConfigClient from "@/swr/SwrConfigClient";
import { NextUIProvider } from "@nextui-org/react";
import { Provider as ReduxProvider } from "react-redux";
import { useRouter } from "next/router";

// import NextUIProviderClient from "./NextUIProviderClient";
// import ProvidersClient from "./ProvidersClient";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      <ReduxProvider store={store}>
        <SwrConfigClient>{children}</SwrConfigClient>
      </ReduxProvider>
      {/* <ProvidersClient>{children}</ProvidersClient> */}
    </NextUIProvider>
  );
}
