import { Providers } from "@/providers/Providers";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { PagesProgressBar as ProgressBar } from "next-nprogress-bar";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <Component {...pageProps} />
      <ProgressBar
        height="4px"
        color="#222222"
        options={{ showSpinner: false }}
        shallowRouting
      />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            padding: "15px 15px",
          },
        }}
      />
    </Providers>
  );
}
