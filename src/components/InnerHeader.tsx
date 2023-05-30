import { useSession } from "next-auth/react";
import { Text } from "@mantine/core";
import { IconMedicalCross } from "@tabler/icons-react";
import type { ReactNode } from "react";

import ThemeButton from "./ThemeButton";

interface IProps {
  burgerMenu?: ReactNode;
}

export default function InnerHeader({ burgerMenu }: IProps) {
  const { status } = useSession();

  return (
    <div className="flex justify-between">
      <div className="flex">
        <Text size="xl" weight={600}>
          Infusion Log
        </Text>
      </div>
      {burgerMenu}
    </div>
  );
}
