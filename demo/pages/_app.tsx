import type { AppProps } from "next/app";
import { WalletKitProvider } from "@gokiprotocol/walletkit";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        async
        defer
        data-website-id="175a63c0-47c0-492c-a585-f94b6aec20e1"
        src="https://analytics.metapasshq.xyz/umami.js"
      />
      <WalletKitProvider
        app={{
          name: "Sqlana Store",
          icon: (
            <img
              src="https://goki.so/assets/android-chrome-256x256.png"
              alt="icon"
            />
          ),
        }}
      >
        {" "}
        <Toaster />
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </WalletKitProvider>
    </>
  );
}

export default MyApp;

const theme = extendTheme({
  styles: {
    global: (props: any) => ({
      body: {
        bg: mode("black", "white")(props),
      },
    }),
  },
});
