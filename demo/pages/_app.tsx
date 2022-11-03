import type { AppProps } from "next/app";
import { WalletKitProvider } from "@gokiprotocol/walletkit";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
function MyApp({ Component, pageProps }: AppProps) {
  return (
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
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </WalletKitProvider>
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
