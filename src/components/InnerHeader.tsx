import { useSession } from "next-auth/react";
import { Text } from "@mantine/core";
import type { ReactNode } from "react";

interface IProps {
  burgerMenu?: ReactNode;
}

export default function InnerHeader({}: IProps) {
  const { status } = useSession();

  return (
    <div className="flex justify-between">
      <div className="flex">
        <Text size="xl" weight={600}>
          &#128221; Infusion Log
        </Text>
      </div>
    </div>
  );
}
