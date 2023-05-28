import HomeActionCard from "@/components/HomeActionCard";
import { Grid, Text, Card, Divider } from "@mantine/core";
import { supabase } from "@/utils/supabase";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { GetServerSideProps } from "next";
import { getBleedLocationStats } from "@/utils/getBleedLocationStats";
import Link from "next/link";
import { NotSignedInCard } from "@/components/NotSignedInCard";

const content = {
  track: {
    body: "Track your infusions here.",
    buttonLabel: "Track Infusion",
  },
  view: {
    body: "View your infusions here.",
    buttonLabel: "View Infusions",
  },
};

const responsePropsForGridCols = {
  md: 6,
  lg: 3,
};

const getBleedDataForIdx = (
  bleedLocationStats: IProps["bleedLocationStats"],
  idx: number
) => {
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
  bleedLocationStats: { [key: string]: number };
  name?: string;
  userID?: string;
}

export default function Home({ bleedLocationStats, name, userID }: IProps) {
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
      <h1 className="text-4xl font-bold mb-8">{title}</h1>
      <Card className="mb-8">
        <Text>
          <span className={boldText}>Primary Target Bleed Location:</span>{" "}
          {targetBleedLocation.bleedLocation}
        </Text>
        <Text>
          <span className={boldText}>Number of target bleeds:</span>{" "}
          {targetBleedLocation.count}
        </Text>
        <Divider my="sm" />
        <Text>
          <span className={boldText}>Top Bleed Locations:</span>{" "}
          {[0, 1, 2].map((idx) => {
            const l = getBleedDataForIdx(bleedLocationStats, idx).bleedLocation;
            return (
              <span key={l}>
                {l}
                {idx !== 2 && ", "}
              </span>
            );
          })}
        </Text>
      </Card>
      <Grid>
        <Grid.Col {...responsePropsForGridCols}>
          <HomeActionCard
            title="Track Infusion"
            body={content.track.body}
            buttonLabel={content.track.buttonLabel}
            href="/infusions/track"
            color="pink"
          />
        </Grid.Col>
        <Grid.Col {...responsePropsForGridCols}>
          <HomeActionCard
            title="Track Infusion"
            body={content.view.body}
            buttonLabel={content.view.buttonLabel}
            href="/infusions/view"
            color="green"
          />
        </Grid.Col>
      </Grid>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const userID = session?.user?.id;

  const { data: allBleedLocations, error: allBleedLocationsError } =
    await supabase
      .from("infusion")
      .select("bleed_location")
      .eq("user_id", userID);

  const bleedLocationStats = getBleedLocationStats({
    allBleedLocations,
    errorFromSB: allBleedLocationsError,
  });

  return {
    props: {
      bleedLocationStats,
      name: session?.user?.name || null,
      userID: userID || null,
    },
  };
};
