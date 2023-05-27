import { Card, Image, Text, Badge, Button, Group } from "@mantine/core";
import Link from "next/link";

interface IProps {
  title: string;
  body: string;
  buttonLabel: string;
  href: string;
}

function HomeActionCard({ title, body, buttonLabel, href = "#" }: IProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>{title}</Text>
      </Group>

      <Text size="sm" color="dimmed">
        {body}
      </Text>

      <Link href={href}>
        <Button variant="light" color="blue" fullWidth mt="md" radius="md">
          {buttonLabel}
        </Button>
      </Link>
    </Card>
  );
}

export default HomeActionCard;
