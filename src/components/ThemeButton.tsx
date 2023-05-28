import { IconSunHigh, IconSunOff } from "@tabler/icons-react";
import { ActionIcon } from "@mantine/core";

export default function ThemeButton() {
  return (
    <ActionIcon variant="outline" color="yellow">
      <IconSunHigh size="1.125rem" />
    </ActionIcon>
  );
}
