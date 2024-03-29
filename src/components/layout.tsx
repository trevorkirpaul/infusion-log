import InnerFooter from "./InnerFooter";
import InnerHeader from "./InnerHeader";
import SideBar from "./SideBar";
import {
  AppShell,
  Footer,
  Navbar,
  Header,
  Burger,
  MediaQuery,
} from "@mantine/core";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { status, data } = useSession();
  const theme = status === "authenticated" ? data?.user?.theme : "dark";
  const [opened, setOpened] = useState(false);

  const handleCloseBurgerMenu = () => {
    if (opened) setOpened(false);
  };

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: theme,
      }}
    >
      <Notifications />
      <AppShell
        padding="xl"
        navbar={
          <Navbar
            className="h-full"
            hidden={!opened}
            width={{ md: 200, lg: 300 }}
            p="xs"
            hiddenBreakpoint="md"
          >
            <SideBar handleCloseBurgerMenu={handleCloseBurgerMenu} />
          </Navbar>
        }
        header={
          <Header height={50} p="xs">
            <InnerHeader />
          </Header>
        }
        footer={
          <MediaQuery smallerThan="md" styles={{ display: "none" }}>
            <Footer height={70} p="xs">
              <InnerFooter />
            </Footer>
          </MediaQuery>
        }
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        })}
      >
        {children}
      </AppShell>
    </MantineProvider>
  );
}
