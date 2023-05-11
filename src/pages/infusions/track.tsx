import { Title, TextInput, Checkbox } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { IconCircleXFilled } from "@tabler/icons-react";

export default function TrackInfusion() {
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
  const fieldClassName = "mb-5";
  return (
    <>
      <Title className="text-4xl font-bold mb-5">Track Infusion</Title>
      <form onSubmit={handleSubmit}>
        <div className={fieldClassName}>
          <TextInput
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
          <TextInput
            placeholder="enter when infusion occurred"
            label="Date of Infusion"
            radius="xs"
            size="md"
            withAsterisk
            type="date"
            defaultValue={new Date().toISOString().slice(0, 10)}
            id="infusion_date"
            name="infusion_date"
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
