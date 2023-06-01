import { useSession } from "next-auth/react";
import { Text, MediaQuery } from "@mantine/core";
import { IconMedicalCross } from "@tabler/icons-react";
import type { ReactNode } from "react";

import ThemeButton from "./ThemeButton";

interface IProps {
  burgerMenu?: ReactNode;
}

export default function InnerHeader({}: IProps) {
  const { status } = useSession();

  return (
    <div className="flex justify-between">
      <div className="flex">
        <Text size="xl" weight={600}>
          Infusion Log
        </Text>
      </div>
    </div>
  );
}
