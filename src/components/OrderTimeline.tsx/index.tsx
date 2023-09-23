import React from "react";
import { Timeline, Text } from "@mantine/core";
import { FactorOrder } from "@/utils/types";
import { IconClockHour3, IconCircleCheck } from "@tabler/icons-react";
import dayjs from "dayjs";
import Link from "next/link";

interface IProps {
  orders: FactorOrder[];
}

export const OrderTimeline: React.FC<IProps> = ({ orders }) => {
  return (
    <>
      <Timeline active={orders.length - 1} bulletSize={24} lineWidth={2}>
        {orders.map((o) => {
          return (
            <Timeline.Item
              bullet={o.arrived ? <IconCircleCheck /> : <IconClockHour3 />}
              title={`${o.quantity} ordered`}
              color={o.arrived ? "green" : "yellow"}
            >
              <Text c="dimmed" size="sm" mt={4}>
                {o.doses_on_hand} doses were on hand at the time of this order.
              </Text>
              <Text size="sm" mt={4}>
                Arrived:{" "}
                <Text
                  className="inline-block"
                  color={o.arrived ? "green" : "yellow"}
                >
                  {o.arrived ? "Yes" : "No"}
                </Text>
              </Text>
              <Text c="dimmed" size="sm" my={8}>
                {dayjs(o.order_placed_at).format("MM/DD/YYYY h:mmA")}
              </Text>
              <Link
                className="text-blue-400 border rounded border-gray-600 py-1 px-2 inline-block hover:text-blue-200 hover:border-blue-200"
                href={`/orders/${o.id}`}
              >
                View / Edit
              </Link>
            </Timeline.Item>
          );
        })}
      </Timeline>
    </>
  );
};
