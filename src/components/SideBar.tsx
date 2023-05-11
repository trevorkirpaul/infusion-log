import { useSession } from "next-auth/react";
import { NavLink, Avatar, Text } from "@mantine/core";
import Link from "next/link";
import {
  IconChevronRight,
  IconHome,
  IconMedicineSyrup,
  IconTable,
} from "@tabler/icons-react";

export default function SideBar() {
  const { status, data, ...rest } = useSession();
  // dynamic vars for sign in/out link
  const signInLink =
    status === "authenticated" ? "/api/auth/signout" : "/api/auth/signin";
  const src = status === "authenticated" ? data?.user?.image : null;

  return (
    <ul className="flex flex-col justify-between h-full">
      <div>
        <li>
          <Link href="/">
            <NavLink
              label="Home"
              rightSection={<IconChevronRight size="0.8rem" stroke={1.5} />}
              icon={<IconHome color="white" />}
            />
          </Link>
        </li>
        <li>
          <Link href="/infusions/track">
            <NavLink
              label="Track Infusion"
              rightSection={<IconChevronRight size="0.8rem" stroke={1.5} />}
              icon={<IconMedicineSyrup color="red" />}
            />
          </Link>
        </li>
        <li>
          <Link href="/infusions/view">
            <NavLink
              label="View Infusions"
              rightSection={<IconChevronRight size="0.8rem" stroke={1.5} />}
              icon={<IconTable color="purple" />}
            />
          </Link>
        </li>
      </div>
      <li className="border-t border-gray-600 pt-5">
        <Link href={signInLink}>
          <NavLink
            label={
              <>
                <Text weight={900} size="lg">
                  {data?.user?.name || "Sign In"}
                </Text>
                {data?.user?.email && <Text>{data?.user?.email}</Text>}
              </>
            }
            icon={<Avatar size="lg" radius="xl" src={src} />}
            rightSection={<IconChevronRight size="1.5rem" stroke={1.5} />}
          />
        </Link>
      </li>
    </ul>
  );
}
