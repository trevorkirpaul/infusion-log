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

export default function Layout({ children }) {
  const [opened, setOpened] = useState(false);

  const handleCloseBurgerMenu = () => {
    if (opened) setOpened(false);
  };

  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar
          className="h-full"
          hidden={!opened}
          width={{ sm: 200, lg: 300 }}
          p="xs"
          hiddenBreakpoint="sm"
        >
          <SideBar handleCloseBurgerMenu={handleCloseBurgerMenu} />
        </Navbar>
      }
      header={
        <Header height={60} p="xs">
          <InnerHeader
            burgerMenu={
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <Burger
                  opened={opened}
                  onClick={() => setOpened((o) => !o)}
                  size="sm"
                  mr="xl"
                />
              </MediaQuery>
            }
          />
        </Header>
      }
      footer={
        <Footer height={70} p="md">
          <InnerFooter />
        </Footer>
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
  );
}
