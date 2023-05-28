import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import Layout from "../components/layout";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: "dark",
        }}
      >
        <Notifications />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MantineProvider>
    </SessionProvider>
  );
}
