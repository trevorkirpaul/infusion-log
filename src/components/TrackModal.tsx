import { Modal, Button, Stepper, Title, Text } from "@mantine/core";
import { FC, useState } from "react";
import { TrackInfusionForm } from "./TrackInfusionForm";
import { notifications } from "@mantine/notifications";
import { IconCircleXFilled } from "@tabler/icons-react";
import { useSession } from "next-auth/react";

interface IProps {
  opened: boolean;
  close: () => void;
}

export const TrackModal: FC<IProps> = ({ opened, close }) => {
  const { status, data } = useSession();
  const [formIsLoading, setFormIsLoading] = useState(false);
  const [active, setActive] = useState(0);
  const [trackingFor, setTrackingFor] = useState<
    "infusion" | "medicine" | null
  >(null);

  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const handleTrackFor = (trackType: "infusion" | "medicine") => {
    setTrackingFor(trackType);
    nextStep();
  };

  const getModalTitle = () => {
    switch (trackingFor) {
      case "infusion":
        return "Track Infusion";
      case "medicine":
        return "Track Medicine";
      default:
        return "Track Infusion/Medicine";
    }
  };

  const handleClose = () => {
    setTrackingFor(null);
    setActive(0);
    close();
  };

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

    const bleedLocation = event.target.bleed_location.value;
    const infusionDate = event.target.infusion_date.value;
    const treatedWithin = event.target.treated_within.checked;
    const notes = event.target.notes.value;

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
    setActive(2);
    return notifications.show({
      title: "Success",
      message: "You have successfully tracked an infusion.",
      color: "blue",
      autoClose: 5000,
    });
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={handleClose}
        title={getModalTitle()}
        centered
      >
        <Stepper active={active} orientation="horizontal">
          <Stepper.Step>
            <Button.Group orientation="vertical">
              <Button
                mb={10}
                color="blue"
                variant="outline"
                onClick={() => handleTrackFor("infusion")}
              >
                Track Infusion
              </Button>
              <Button
                disabled
                color="blue"
                variant="outline"
                onClick={() => handleTrackFor("medicine")}
              >
                Track Medicine
              </Button>
            </Button.Group>
          </Stepper.Step>
          <Stepper.Step>
            <TrackInfusionForm
              handleSubmit={handleSubmit}
              formIsLoading={formIsLoading}
              uniqueBleedLocations={[]}
            />
          </Stepper.Step>
          <Stepper.Step>
            <Title className="mb-5">Success</Title>
            <Text>
              Completed, You have tracked a new infusion. You can close this
              modal.
            </Text>
          </Stepper.Step>
          {/* <Stepper.Completed></Stepper.Completed> */}
        </Stepper>
      </Modal>
    </>
  );
};
