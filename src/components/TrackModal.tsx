import { Modal, Button, Group, Title, Text, Stepper } from "@mantine/core";
import { useRouter } from "next/router";
import { FC, useState } from "react";

interface IProps {
  opened: boolean;
  close: () => void;
}

export const TrackModal: FC<IProps> = ({ opened, close }) => {
  const router = useRouter();
  const [active, setActive] = useState(1);
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

  return (
    <>
      <Modal
        opened={opened}
        onClose={handleClose}
        title={getModalTitle()}
        centered
      >
        <Stepper
          active={active}
          onStepClick={setActive}
          orientation="horizontal"
        >
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
                color="blue"
                variant="outline"
                onClick={() => handleTrackFor("medicine")}
              >
                Track Medicine
              </Button>
            </Button.Group>
          </Stepper.Step>
          <Stepper.Step>Step 2 content: Verify email</Stepper.Step>
          <Stepper.Step>Step 3 content: Get full access</Stepper.Step>
          <Stepper.Completed>
            Completed, click back button to get to previous step
          </Stepper.Completed>
        </Stepper>

        {/* <Group position="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
          <Button onClick={nextStep}>Next step</Button>
        </Group> */}
      </Modal>
    </>
  );
};
