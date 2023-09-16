import { Title, Checkbox, Autocomplete, Textarea } from "@mantine/core";
import { useSession } from "next-auth/react";
import { supabase } from "@/utils/supabase";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { IconCircleXFilled } from "@tabler/icons-react";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { getUniqueBleedLocations } from "@/utils/getUniqueBleedLocations";
import { NotSignedInCard } from "@/components/NotSignedInCard";
import { TrackInfusionForm } from "@/components/TrackInfusionForm";

interface IProps {
  uniqueBleedLocations: string[];
}

export default function TrackInfusion(props: IProps) {
  const [formIsLoading, setFormIsLoading] = useState(false);
  const { status, data } = useSession();

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (status !== "authenticated") {
      return notifications.show({
        title: "Unauthorized",
        message: "Please sign in to continue.",
        color: "red",
        autoClose: 5000,
        icon: <IconCircleXFilled />,
      });
    }

    setFormIsLoading(true);

    const bleedLocation = event.target.bleed_location.value
      .toLowerCase()
      .trim();
    const infusionDate = event.target.infusion_date[1].value;
    const treatedWithin = event.target.treated_within.checked;
    const notes = event.target.notes.value.trim();

    const body = {
      bleedLocation,
      infusionDate,
      treatedWithin,
      notes,
      userID: data?.user?.id,
    };

    const res = await fetch("/api/infusions/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      setFormIsLoading(false);
      return notifications.show({
        title: "Something went wrong!",
        message: "Please try again later.",
        color: "red",
        autoClose: 5000,
        icon: <IconCircleXFilled />,
      });
    }

    setFormIsLoading(false);
    return notifications.show({
      title: "Success",
      message: "You have successfully tracked an infusion.",
      color: "blue",
      autoClose: 5000,
    });
  };

  if (status !== "authenticated") {
    return <NotSignedInCard />;
  }

  return (
    <>
      <Title className="text-4xl font-bold mb-5">Track Infusion</Title>
      <TrackInfusionForm
        handleSubmit={handleSubmit}
        uniqueBleedLocations={props.uniqueBleedLocations}
        formIsLoading={formIsLoading}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const userID = session?.user?.id;

  const { data: allBleedLocations, error } = await supabase
    .from("infusion")
    .select("bleed_location")
    .eq("user_id", userID);

  const uniqueBleedLocations = getUniqueBleedLocations({
    allBleedLocations,
    errorFromSB: error,
  });

  return {
    props: {
      uniqueBleedLocations,
    },
  };
};
