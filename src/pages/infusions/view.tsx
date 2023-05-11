import { GetServerSideProps } from "next";
import { supabase } from "@/utils/supabase";
import type { Infusion } from "@/utils/types";
import InfusionTable from "@/components/InfusionTable";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

interface IProps {
  infusions: Infusion[];
  numberOfInfusions: number;
}

export default function ViewInfusions({ infusions }: IProps) {
  return (
    <>
      <h1>View Infusions</h1>
      <InfusionTable infusions={infusions} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const userID = session?.user?.id;

  const { count: numberOfInfusions, data } = await supabase
    .from("infusion")
    .select("*", { count: "exact", head: false })
    .eq("user_id", userID);

  return {
    props: {
      numberOfInfusions,
      infusions: data || [],
    },
  };
};
