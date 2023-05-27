import { useRouter } from "next/router";
import { NavLink } from "@mantine/core";
import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";

export default function SideBar() {
  const router = useRouter();

  return (
    <ul className="flex flex-col justify-between h-full">
      <div>
        <li>
          <Link href="/">
            <NavLink
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
              label="View Infusions"
              rightSection={<IconChevronRight size="0.8rem" stroke={1.5} />}
              active={router.pathname === "/infusions/view"}
              color="cyan"
            />
          </Link>
        </li>
      </div>
    </ul>
  );
}
