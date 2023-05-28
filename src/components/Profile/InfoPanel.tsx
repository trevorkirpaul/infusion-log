import React from "react";
import { BleedingDisorder, User } from "@/utils/types";
import {
  Title,
  Text,
  NativeSelect,
  Button,
  Divider,
  Input,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";

interface IProps {
  user: User | null;
  bleedingDisorders: BleedingDisorder[];
}

export const ProfileInfoPanel: React.FC<IProps> = ({
  user,
  bleedingDisorders,
}) => {
  const [updateUserIsLoading, setUpdateUserIsLoading] = React.useState(false);

  if (!user) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setUpdateUserIsLoading(true);
      const bleeding_disorder = event.target.bleeding_disorder.value;
      const theme = event.target.theme.value || "dark";

      const body = {
        bleeding_disorder,
        theme,
      };

      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        return notifications.show({
          title: "Something went wrong!",
          message: "Please try again later.",
          color: "red",
          autoClose: 5000,
        });
      }

      notifications.show({
        title: "Success",
        message: "You have successfully updated your profile.",
        color: "blue",
        autoClose: 5000,
      });
    } catch (e) {
      return notifications.show({
        title: "Error",
        message: "There was an error.",
        color: "red",
        autoClose: 5000,
      });
    }
    setUpdateUserIsLoading(false);
  };

  return (
    <>
      <Title>Profile Details</Title>
      <Text className="mb-4">
        Please update your profile details below. This information will be used
        to help us better understand the bleeding disorder community.
      </Text>
      <form onSubmit={handleSubmit}>
        <Input.Wrapper
          className="mb-4"
          id="email"
          label="Your Email"
          description="Your email cannot be changed."
          required
        >
          <Input
            defaultValue={user.email}
            name="email"
            id="email"
            placeholder="Enter your email"
            disabled
          />
        </Input.Wrapper>
        <Input.Wrapper
          className="mb-4"
          id="id"
          label="Your User ID"
          description="Your User ID cannot be changed."
          required
        >
          <Input
            defaultValue={user.id}
            name="id"
            id="id"
            placeholder="Enter your id"
            disabled
          />
        </Input.Wrapper>
        <NativeSelect
          defaultValue={user.bleeding_disorder}
          name="bleeding_disorder"
          id="bleeding_disorder"
          label="Bleeding Disorder"
          placeholder="Select your bleeding disorder"
          data={bleedingDisorders
            .sort((a, b) => {
              if (a.name < b.name) {
                return -1;
              }
              return 1;
            })
            .map((bleedingDisorder) => ({
              value: `${bleedingDisorder.id}`,
              label: bleedingDisorder.name,
            }))}
        />
        <NativeSelect
          name="theme"
          defaultValue={user.theme}
          id="theme"
          label="Theme"
          placeholder="Select your theme for Infusion Log"
          data={["light", "dark"]}
        />
        <Button
          className="mt-10"
          variant="outline"
          type="submit"
          loading={updateUserIsLoading}
          disabled={updateUserIsLoading}
        >
          {updateUserIsLoading ? "Loading..." : "Update Profile"}
        </Button>
      </form>
      <Divider my="lg" />
    </>
  );
};
