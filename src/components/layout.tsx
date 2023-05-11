import InnerHeader from "./InnerHeader";
import SideBar from "./SideBar";
import { AppShell, Navbar, Header } from "@mantine/core";

export default function Layout({ children }) {
  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar width={{ base: 300 }} p="xs">
          <SideBar />
        </Navbar>
      }
      header={
        <Header height={60} p="xs">
          <InnerHeader />
        </Header>
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
