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
      <div className="flex align-baseline">
        <IconMedicalCross color="aqua" size="2rem" className="mr-2" />
        <Text color="white" size="xl" weight={600}>
          Infusion Log{" "}
          <Text className="inline-block" color="grey" weight={400}>
            v0.0.1
          </Text>
        </Text>
      </div>
      {burgerMenu}
    </div>
  );
}