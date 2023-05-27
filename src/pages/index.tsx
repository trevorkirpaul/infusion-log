import HomeActionCard from "@/components/HomeActionCard";
import { Grid } from "@mantine/core";

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

export default function Home() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Infusion Log</h1>
      <Grid>
        <Grid.Col {...responsePropsForGridCols}>
          <HomeActionCard
            title="Track Infusion"
            body={content.track.body}
            buttonLabel={content.track.buttonLabel}
            href="/infusions/track"
          />
        </Grid.Col>
        <Grid.Col {...responsePropsForGridCols}>
          <HomeActionCard
            title="Track Infusion"
            body={content.view.body}
            buttonLabel={content.view.buttonLabel}
            href="/infusions/view"
          />
        </Grid.Col>
      </Grid>
    </>
  );
}
