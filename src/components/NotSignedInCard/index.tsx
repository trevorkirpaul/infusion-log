import { Card, Image, Text, Badge, Button, Group } from "@mantine/core";
import Link from "next/link";
import React from "react";

export const NotSignedInCard: React.FC = () => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>
          Sorry! You need to sign in to use this feature.
        </Text>
      </Group>
      <Text size="sm" color="dimmed">
        Click{" "}
        <Link href="/api/auth/signin" className="text-blue-500 underline">
          here
        </Link>{" "}
        to sign in.
      </Text>
    </Card>
  );
};
