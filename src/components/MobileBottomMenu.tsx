import { FC } from "react";
import { Button, MediaQuery } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDisclosure } from "@mantine/hooks";
import { TrackModal } from "./TrackModal";

export const MobileBottomMenu: FC = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const router = useRouter();
  const buttonVariant = "default";
  return (
    <MediaQuery largerThan="md" styles={{ display: "none" }}>
      <div>
        <TrackModal opened={opened} close={close} />
        <Button.Group>
          <Button
            onClick={() => router.push("/")}
            variant={buttonVariant}
            color="gray"
          >
            Home
          </Button>
          <Button
            onClick={() => router.push("/report")}
            variant={buttonVariant}
            color="gray"
          >
            Reports
          </Button>
          <Button onClick={open} variant={buttonVariant} color="gray">
            Track
          </Button>
          <Button
            onClick={() => router.push("/infusions/view")}
            variant={buttonVariant}
            color="gray"
          >
            View
          </Button>
          <Button
            onClick={() => router.push("/profile")}
            variant={buttonVariant}
            color="gray"
          >
            Profile
          </Button>
        </Button.Group>
      </div>
    </MediaQuery>
  );
};
