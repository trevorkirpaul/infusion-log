import { FC, useState } from "react";
import { IconChevronRight } from "@tabler/icons-react";
import {
  Paper,
  Transition,
  createStyles,
  MediaQuery,
  Burger,
  Avatar,
  Text,
} from "@mantine/core";
import { NavLink } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const useStyles = createStyles((theme) => ({
  dropdown: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: "hidden",

    [theme.fn.largerThan("md")]: {
      display: "none",
    },
  },
}));

const routes = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Track Infusion",
    href: "/infusions/track",
  },
  {
    label: "View Infusions",
    href: "/infusions/view",
  },
  {
    label: "Orders",
    href: "/orders",
  },
  {
    label: "Reports",
    href: "/report",
  },
  {
    label: "Profile",
    href: "/profile",
  },
];

export const MobileMenu: FC = () => {
  const { status, data } = useSession();
  const src = status === "authenticated" ? data?.user?.image : null;

  const [isOpen, setIsOpen] = useState(false);
  const { classes, cx, theme } = useStyles();
  const router = useRouter();

  return (
    <MediaQuery largerThan={"md"} styles={{ display: "none" }}>
      <div>
        <Burger
          opened={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
          size="sm"
        />
        <Transition transition="scale-y" duration={200} mounted={isOpen}>
          {(styles) => (
            <Paper
              className={classes.dropdown}
              withBorder
              shadow="md"
              style={{ ...styles, borderLeft: 0, borderRight: 0 }}
              radius={0}
            >
              <ul>
                <li className="pl-3 py-4 flex items-center font-bold">
                  <Avatar size={"md"} radius={"xl"} src={src} />
                  <Text className="ml-3">
                    {data?.user?.email || "Not signed in"}
                  </Text>
                </li>
                {routes.map((r) => (
                  <li key={r.href}>
                    <Link href={r.href}>
                      <NavLink
                        onClick={() => setIsOpen(false)}
                        label={r.label}
                        rightSection={
                          <IconChevronRight size="0.8rem" stroke={1.5} />
                        }
                        active={router.pathname === r.href}
                        color="cyan"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </Paper>
          )}
        </Transition>
      </div>
    </MediaQuery>
  );
};
