import type { FC } from "react";
import Link from "next/link";
import { NavLink, Avatar, Text, MediaQuery } from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconChevronRight } from "@tabler/icons-react";
import { MobileBottomMenu } from "./MobileBottomMenu";

const InnerFooter: FC = () => {
  const { status, data } = useSession();
  const signInLink =
    status === "authenticated" ? "/profile" : "/api/auth/signin";
  const src = status === "authenticated" ? data?.user?.image : null;

  return (
    <>
      {/* Sign In / Account button for larger than mobile */}
      <MediaQuery smallerThan="md" styles={{ display: "none" }}>
        <Link href={signInLink}>
          <NavLink
            className="w-72"
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
      </MediaQuery>
      {/* For Mobile Menu - responsive in component */}
      <MobileBottomMenu />
    </>
  );
};

export default InnerFooter;
