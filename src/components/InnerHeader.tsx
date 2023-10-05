import { Text } from "@mantine/core";
import type { ReactNode } from "react";
import { MobileMenu } from "./MobileMenu";

interface IProps {
  burgerMenu?: ReactNode;
}

export default function InnerHeader({}: IProps) {
  return (
    <div className="flex justify-between">
      <div className="flex">
        <Text size="xl" weight={600}>
          &#128221; Infusion Log
        </Text>
      </div>
      <MobileMenu />
    </div>
  );
}
