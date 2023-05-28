import { Title, Text, Stack, Button, Divider } from "@mantine/core";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { supabase } from "@/utils/supabase";
import { BleedingDisorder, User } from "@/utils/types";
import { ProfileInfoPanel } from "@/components/Profile/InfoPanel";
import { authOptions } from "../pages/api/auth/[...nextauth]";

interface IProps {
  user: User | null;
  bleedingDisorders: BleedingDisorder[];
}

export default function Profile({ user, bleedingDisorders }: IProps) {
  const { status, data, ...rest } = useSession();
  const signInLink =
    status === "authenticated" ? "/api/auth/signout" : "/api/auth/signin";
  return (
    <>
      <div className="mb-10">
        <Title className="mb-5">Profile</Title>
      </div>
      <Stack>
        <Link href={signInLink}>
          <Button variant="outline" color="red">
            {status === "authenticated" ? "Sign Out" : "Sign In"}
          </Button>
        </Link>
        <Divider my="lg" />

        <ProfileInfoPanel user={user} bleedingDisorders={bleedingDisorders} />
      </Stack>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const userID = session?.user?.id;

  const { data: bleedingDisordersFromDB } = await supabase
    .from("bleeding_disorder")
    .select("*");

  const { data: userFromDB } = await supabase
    .from("user")
    .select("*")
    .eq("id", userID);

  return {
    props: {
      user: userFromDB && userFromDB[0] ? userFromDB[0] : null,
      bleedingDisorders: bleedingDisordersFromDB || [],
    },
  };
};
