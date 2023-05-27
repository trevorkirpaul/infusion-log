import { GetServerSideProps } from "next";
import { supabase } from "@/utils/supabase";
import type { Infusion } from "@/utils/types";
import InfusionTable from "@/components/InfusionTable";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { Pagination } from "@mantine/core";
import { useRouter } from "next/router";

const createPageHref = (page: number) => `?page=${page}`;

interface IProps {
  infusions: Infusion[];
  numberOfInfusions: number;
}

export default function ViewInfusions({
  infusions,
  numberOfInfusions,
}: IProps) {
  const router = useRouter();
  const { page: currentPage } = router.query;
  return (
    <>
      <h1>View Infusions ({numberOfInfusions})</h1>
      <Pagination
        className="my-4"
        value={currentPage ? Number(currentPage) : 1}
        onChange={(page) => {
          router.push(createPageHref(page));
        }}
        total={Math.ceil(numberOfInfusions / 4)}
      />
      <InfusionTable infusions={infusions} />
      <Pagination
        className="mt-4"
        value={currentPage ? Number(currentPage) : 1}
        onChange={(page) => {
          router.push(createPageHref(page));
        }}
        total={Math.ceil(numberOfInfusions / 4)}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const userID = session?.user?.id;
  const { page } = ctx.query;
  const range = getRange(page);

  const { count: numberOfInfusions, data } = await supabase
    .from("infusion")
    .select("*", { count: "exact", head: false })
    .eq("user_id", userID)
    .order("infusion_date", { ascending: false })
    .range(range.start, range.end);

  return {
    props: {
      numberOfInfusions,
      infusions: data || [],
    },
  };
};

const getRange = (page: string | string[] | undefined) => {
  const safePage = page ? Number(page) - 1 : 0;
  if (safePage < 0) return { start: 0, end: 4 };
  const start = safePage * 4;
  const end = start + 4;

  return { start, end };
};
