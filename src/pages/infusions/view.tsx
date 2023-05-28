import { GetServerSideProps } from "next";
import { supabase } from "@/utils/supabase";
import type { Infusion } from "@/utils/types";
import InfusionTable from "@/components/InfusionTable";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { Pagination, Select, Group, Title } from "@mantine/core";
import { useRouter } from "next/router";
import { getUniqueBleedLocations } from "@/utils/getUniqueBleedLocations";
import { NotSignedInCard } from "@/components/NotSignedInCard";

const createPageHref = (page: number) => `?page=${page}`;

interface IProps {
  infusions: Infusion[];
  numberOfInfusions: number;
  uniqueBleedLocations: string[];
  userID: string | null;
}

export default function ViewInfusions({
  infusions,
  numberOfInfusions,
  uniqueBleedLocations,
  userID,
}: IProps) {
  const router = useRouter();
  const { page: currentPage } = router.query;
  if (!userID) {
    return (
      <>
        <NotSignedInCard />
      </>
    );
  }
  return (
    <>
      <Title className="mb-4">View Infusions ({numberOfInfusions})</Title>
      <Group align="center" position="apart">
        <Pagination
          value={currentPage ? Number(currentPage) : 1}
          onChange={(page) => {
            router.push(createPageHref(page));
          }}
          total={Math.ceil(numberOfInfusions / 4)}
        />
        <Select
          onChange={(selection) => {
            const computedBleedLocation = selection
              ? selection.replace(" ", "%20")
              : null;
            const computedBleedLocationParam = computedBleedLocation
              ? `&bleed_location=${computedBleedLocation}`
              : "";
            router.push(`${createPageHref(1)}${computedBleedLocationParam}`);
          }}
          clearable
          label="Filter by bleed location"
          placeholder="Pick one"
          data={uniqueBleedLocations.map((bleedLocation) => ({
            value: bleedLocation,
            label: bleedLocation,
          }))}
        />
      </Group>
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
  const { page, bleed_location = null } = ctx.query;
  const range = getRange(page);

  const { count: numberOfInfusions, data } = await supabase
    .from("infusion")
    .select("*", { count: "exact", head: false })
    .eq("user_id", userID)
    .eq(bleed_location ? "bleed_location" : "", bleed_location)
    .order("infusion_date", { ascending: false })
    .range(range.start, range.end);

  const { data: allBleedLocations, error: allBleedLocationsError } =
    await supabase
      .from("infusion")
      .select("bleed_location")
      .eq("user_id", userID);

  const uniqueBleedLocations = getUniqueBleedLocations({
    allBleedLocations,
    errorFromSB: allBleedLocationsError,
  });

  return {
    props: {
      numberOfInfusions,
      uniqueBleedLocations,
      infusions: data || [],
      userID: userID || null,
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
