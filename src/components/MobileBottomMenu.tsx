import { FC } from "react";
import { Button, MediaQuery } from "@mantine/core";
import { useRouter } from "next/router";

export const MobileBottomMenu: FC = () => {
  const router = useRouter();
  const buttonVariant = "default";
  return (
    <MediaQuery largerThan="md" styles={{ display: "none" }}>
      <div>
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
          <Button
            onClick={() => router.push("/infusions/track")}
            variant={buttonVariant}
            color="gray"
          >
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
