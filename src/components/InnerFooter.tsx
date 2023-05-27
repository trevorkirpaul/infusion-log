import type { FC } from "react";
import Link from "next/link";
import { NavLink, Avatar, Text } from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconChevronRight } from "@tabler/icons-react";

const InnerFooter: FC = () => {
  const { status, data, ...rest } = useSession();
  const signInLink =
    status === "authenticated" ? "/api/auth/signout" : "/api/auth/signin";
  const src = status === "authenticated" ? data?.user?.image : null;

  return (
    <Link href={signInLink}>
      <NavLink
        label={
          <>
            <Text weight={900} size="sm">
              {data?.user?.name || "Sign In"}
            </Text>
            {data?.user?.email && <Text>{data?.user?.email}</Text>}
          </>
        }
        icon={<Avatar size="sm" radius="xl" src={src} />}
        rightSection={<IconChevronRight size="1.5rem" stroke={1.5} />}
      />
    </Link>
  );
};

export default InnerFooter;
