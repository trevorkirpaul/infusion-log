import { InfusionByOrder } from "@/utils/types";
import React from "react";
import { Text, Button, Collapse } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import dayjs from "dayjs";
import Link from "next/link";
import {
  IconCircleChevronDown,
  IconCircleChevronUp,
} from "@tabler/icons-react";

interface IProps {
  infusionsByOrder: InfusionByOrder[];
  orderID: number;
}

export const InfusionsForOrder: React.FC<IProps> = ({
  infusionsByOrder,
  orderID,
}) => {
  const [opened, { toggle }] = useDisclosure(false);

  const infusionsForThisOrder = infusionsByOrder.filter(
    (x) => x.order_id === orderID
  );

  const numberOfInfusionsTaken = infusionsForThisOrder.length;

  return (
    <>
      <Text mt={4} size="sm" c="dimmed" className="flex items-center">
        {numberOfInfusionsTaken} infusions(s) taken during this order{" "}
        {numberOfInfusionsTaken > 0 && (
          <Button
            disabled={numberOfInfusionsTaken === 0}
            variant="subtle"
            // color="gray"
            size="xs"
            onClick={toggle}
            className="ml-4 text-gray-500"
          >
            {opened ? <IconCircleChevronUp /> : <IconCircleChevronDown />}
          </Button>
        )}
      </Text>
      <Collapse in={opened}>
        <ul className="mt-2">
          {infusionsForThisOrder.map((infusion) => (
            <li>
              <Text mb={8} size="sm">
                <Link
                  className="text-blue-400 underline"
                  href={`/infusions/${infusion.infusion_id}`}
                >
                  {infusion.infusion_id}:
                </Link>{" "}
                {dayjs(infusion.infusion_date).format("MM/DD/YYYY h:mmA")}
              </Text>
            </li>
          ))}
        </ul>
      </Collapse>
    </>
  );
};
