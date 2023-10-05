import { FC, useState } from "react";
import { IconMenu, IconChevronRight } from "@tabler/icons-react";
import {
  Paper,
  Transition,
  Text,
  createStyles,
  MediaQuery,
} from "@mantine/core";
import { NavLink } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";

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
  const [isOpen, setIsOpen] = useState(false);
  const { classes, cx, theme } = useStyles();
  const router = useRouter();

  return (
    <MediaQuery largerThan={"md"} styles={{ display: "none" }}>
      <div>
        <IconMenu
          className=" cursor-pointer"
          onClick={() => setIsOpen((prev) => !prev)}
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
