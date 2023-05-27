import { Title, Checkbox, Autocomplete } from "@mantine/core";
import { useSession } from "next-auth/react";
import { supabase } from "@/utils/supabase";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { IconCircleXFilled } from "@tabler/icons-react";
import { DateTimePicker } from "@mantine/dates";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { PostgrestError } from "@supabase/supabase-js";

const fieldClassName = "mb-5";

interface IProps {
  uniqueBleedLocations: string[];
}

export default function TrackInfusion(props: IProps) {
  const [formIsLoading, setFormIsLoading] = useState(false);
  const { status, data } = useSession();

  const handleSubmit = async (event) => {
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

    const bleedLocation = event.target.bleed_location.value;
    const infusionDate = event.target.infusion_date.value;
    const treatedWithin = event.target.treated_within.checked;

    const body = {
      bleedLocation,
      infusionDate,
      treatedWithin,
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
  return (
    <>
      <Title className="text-4xl font-bold mb-5">Track Infusion</Title>
      <form onSubmit={handleSubmit}>
        <div className={fieldClassName}>
          <Autocomplete
            data={props.uniqueBleedLocations}
            placeholder="enter location of bleed"
            label="Bleed Location"
            radius="xs"
            size="md"
            withAsterisk
            id="bleed_location"
            name="bleed_location"
          />
        </div>
        <div className={fieldClassName}>
          <DateTimePicker
            label="Date of Infusion"
            placeholder="Pick date and time of infusion"
            defaultValue={new Date()}
            id="infusion_date"
            name="infusion_date"
            withAsterisk
            radius="xs"
            size="md"
          />
        </div>
        <div className={fieldClassName}>
          <Checkbox
            labelPosition="left"
            label="Treated Within 3 Hours"
            defaultChecked={true}
            id="treated_within"
            name="treated_within"
            size="md"
          />
        </div>

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
          disabled={formIsLoading}
        >
          {!formIsLoading ? "Submit" : "...loading"}
        </button>
      </form>
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

interface IGetUniqueBleedLocations {
  allBleedLocations: Array<{ bleed_location: string }> | null;
  errorFromSB: PostgrestError | null;
}

/**
 * returns a unique array of strings, sorted, trimmed, and lowercased
 * if an error is detected, we fail silently and return an empty array
 */
const getUniqueBleedLocations = (x: IGetUniqueBleedLocations) => {
  try {
    const { allBleedLocations, errorFromSB } = x;
    if (errorFromSB || !allBleedLocations) {
      return [];
    }
    const uniqueBleedLocations = new Set(
      allBleedLocations.map((x) => x.bleed_location.trim().toLowerCase())
    );
    return Array.from(uniqueBleedLocations).sort();
  } catch (e) {
    return [];
  }
};
