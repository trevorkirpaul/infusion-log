import { useRouter } from "next/router";
import { NavLink } from "@mantine/core";
import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";

interface IProps {
  handleCloseBurgerMenu: () => void;
}
export default function SideBar({ handleCloseBurgerMenu }: IProps) {
  const router = useRouter();

  return (
    <ul className="flex flex-col justify-between h-full">
      <div>
        <li>
          <Link href="/">
            <NavLink
              onClick={handleCloseBurgerMenu}
              label="Home"
              rightSection={<IconChevronRight size="0.8rem" stroke={1.5} />}
              active={router.pathname === "/"}
              color="cyan"
            />
          </Link>
        </li>
        <li>
          <Link href="/infusions/track">
            <NavLink
              onClick={handleCloseBurgerMenu}
              label="Track Infusion"
              rightSection={<IconChevronRight size="0.8rem" stroke={1.5} />}
              active={router.pathname === "/infusions/track"}
              color="cyan"
            />
          </Link>
        </li>
        <li>
          <Link href="/infusions/view">
            <NavLink
              onClick={handleCloseBurgerMenu}
              label="View Infusions"
              rightSection={<IconChevronRight size="0.8rem" stroke={1.5} />}
              active={router.pathname === "/infusions/view"}
              color="cyan"
            />
          </Link>
        </li>
        <li>
          <Link href="/orders">
            <NavLink
              onClick={handleCloseBurgerMenu}
              label="Orders"
              rightSection={<IconChevronRight size="0.8rem" stroke={1.5} />}
              active={router.pathname === "/orders"}
              color="cyan"
            />
          </Link>
        </li>
        <li>
          <Link href="/report">
            <NavLink
              onClick={handleCloseBurgerMenu}
              label="Reports"
              rightSection={<IconChevronRight size="0.8rem" stroke={1.5} />}
              active={router.pathname === "/report"}
              color="cyan"
            />
          </Link>
        </li>
        <li>
          <Link href="/profile">
            <NavLink
              onClick={handleCloseBurgerMenu}
              label="Profile"
              rightSection={<IconChevronRight size="0.8rem" stroke={1.5} />}
              active={router.pathname === "/profile"}
              color="cyan"
            />
          </Link>
        </li>
      </div>
    </ul>
  );
}
