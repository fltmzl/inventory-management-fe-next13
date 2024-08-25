import { Html, Head, Main, NextScript } from "next/document";
// import { Toaster } from "react-hot-toast";

export default function Document() {
  return (
    <Html lang="en" className="">
      <Head />
      <body>
        <Main />
        {/* <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              padding: "15px 15px",
            },
          }}
        /> */}
        <NextScript />
      </body>
    </Html>
  );
}
