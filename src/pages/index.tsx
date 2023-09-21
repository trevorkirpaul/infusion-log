import { Badge, Text, Card, Divider, SimpleGrid, Flex } from "@mantine/core";
import { supabase } from "@/utils/supabase";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { GetServerSideProps } from "next";
import { getBleedLocationStats } from "@/utils/getBleedLocationStats";
import { NotSignedInCard } from "@/components/NotSignedInCard";
import { LineChart } from "@/components/LineChart";
import { PieChart } from "@/components/PieChart";
import {
  getInfusionDataForChart,
  getInfusionsByBleedLocation,
} from "@/utils/getInfusionDataForChart";
import { useMediaQuery } from "@mantine/hooks";

const getBleedDataForIdx = (
  bleedLocationStats: IProps["bleedLocationStats"],
  idx: number
) => {
  if (!bleedLocationStats) return null;
  return Object.keys(bleedLocationStats)
    .map((key) => {
      return {
        bleedLocation: key,
        count: bleedLocationStats[key],
      };
    })
    .sort((a, b) => b.count - a.count)[idx];
};

interface IProps {
  bleedLocationStats: { [key: string]: number } | null;
  name?: string;
  userID?: string;
  infusionDataForChart: [string, number][];
  infusionsByBleedLocation: [string, number][];
  allBleedCount?: number | null;
}

export default function Home({
  bleedLocationStats,
  name,
  userID,
  infusionDataForChart,
  infusionsByBleedLocation,
  allBleedCount,
}: IProps) {
  const matchesMobile = useMediaQuery("(max-width: 800px)");

  if (!name || !userID) {
    return (
      <>
        <NotSignedInCard />
      </>
    );
  }

  const targetBleedLocation = getBleedDataForIdx(bleedLocationStats, 0);

  const boldText = "font-bold";
  const title = name ? `Welcome, ${name}` : "Welcome";

  return (
    <>
      <h1 className="text-2xl font-bold mb-8">{title}</h1>

      {bleedLocationStats && targetBleedLocation ? (
        <Card className="mb-8">
          <div className="mb-3">
            <Text className="mb-3 font-bold">
              Primary Target Bleed Location:
            </Text>
            <Badge size="lg" color="red">
              {targetBleedLocation.bleedLocation}: {targetBleedLocation.count}
            </Badge>
          </div>

          <Text className="mb-3 font-bold">Total Bleeds Tracked:</Text>
          <Badge size="lg" color="blue">
            {allBleedCount}
          </Badge>

          <Divider my="sm" />
          <Text className="font-bold mb-3">Top Bleed Location(s):</Text>
          <Flex direction={{ base: "column", sm: "row" }} rowGap={10}>
            {[0, 1, 2].map((idx) => {
              const l = getBleedDataForIdx(
                bleedLocationStats,
                idx
              )?.bleedLocation;
              if (!l) {
                return null;
              }
              const getColor = (_idx: number) => {
                switch (_idx) {
                  case 2:
                    return "yellow";
                  case 1:
                    return "orange";
                  default:
                    return "red";
                }
              };
              return (
                <Badge
                  key={l}
                  className="mr-0 md:mr-3 w-fit"
                  size="lg"
                  color={getColor(idx)}
                >
                  {l}
                </Badge>
              );
            })}
          </Flex>
        </Card>
      ) : null}

      {bleedLocationStats && targetBleedLocation ? (
        <SimpleGrid cols={matchesMobile ? 1 : 2}>
          <LineChart
            userId={userID}
            infusionDataForChart={infusionDataForChart}
          />
          <PieChart
            userId={userID}
            infusionDataForChart={infusionsByBleedLocation}
            title="Infusions By Bleed Location (Top 3)"
          />
        </SimpleGrid>
      ) : (
        <Text>No Data.</Text>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const userID = session?.user?.id;

  const {
    data: allBleedLocations,
    error: allBleedLocationsError,
    count: allBleedCount,
  } = await supabase
    .from("infusion")
    .select("bleed_location", { count: "exact" })
    .eq("user_id", userID);

  const bleedLocationStats = getBleedLocationStats({
    allBleedLocations,
    errorFromSB: allBleedLocationsError,
  });

  const infusionDataForChart = await getInfusionDataForChart({
    userId: userID,
    supabase,
  });

  const _infusionDataForChart = Array.from(
    infusionDataForChart ? infusionDataForChart.entries() : []
  );

  const infusionsByBleedLocation = await getInfusionsByBleedLocation({
    userId: userID,
    supabase,
  });

  const sortedInfusionsByBleedLocation = Array.from(
    infusionsByBleedLocation ? infusionsByBleedLocation.entries() : []
  ).sort((a, b) => b[1] - a[1]);

  const topThree = [
    sortedInfusionsByBleedLocation[0] || null,
    sortedInfusionsByBleedLocation[1] || null,
    sortedInfusionsByBleedLocation[2] || null,
  ].filter((x) => x);

  return {
    props: {
      bleedLocationStats,
      name: session?.user?.name || null,
      userID: userID || null,
      infusionDataForChart: _infusionDataForChart,
      infusionsByBleedLocation: topThree,
      allBleedCount,
    },
  };
};
