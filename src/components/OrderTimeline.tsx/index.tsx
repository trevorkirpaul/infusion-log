import React from "react";
import { Timeline, Text } from "@mantine/core";
import { FactorOrder, InfusionByOrder } from "@/utils/types";
import { IconClockHour3, IconCircleCheck } from "@tabler/icons-react";
import dayjs from "dayjs";
import Link from "next/link";
import { InfusionsForOrder } from "./InfusionsForOrder";

interface IProps {
  orders?: FactorOrder[] | null;
  infusionsByOrder: InfusionByOrder[];
}

export const OrderTimeline: React.FC<IProps> = ({
  orders,
  infusionsByOrder,
}) => {
  if (!orders) return null;
  return (
    <>
      <Timeline active={orders.length - 1} bulletSize={24} lineWidth={2}>
        {orders.map((o) => {
          return (
            <Timeline.Item
              bullet={o.arrived ? <IconCircleCheck /> : <IconClockHour3 />}
              title={`${o.quantity} dose(s) ordered`}
              color={o.arrived ? "green" : "yellow"}
              key={o.id}
            >
              <Text size="sm" mt={4}>
                Arrived:{" "}
                <Text
                  className="inline-block"
                  color={o.arrived ? "green" : "yellow"}
                >
                  {o.arrived ? "Yes" : "No"}
                </Text>
              </Text>
              <Text c="dimmed" size="sm" mt={4}>
                Ordered On:{" "}
                {dayjs(o.order_placed_at).format("MM/DD/YYYY h:mmA")}
              </Text>
              <Text c="dimmed" size="sm" mt={12}>
                {o.doses_on_hand} doses were on hand at the time of this order.
              </Text>

              <InfusionsForOrder
                orderID={o.id}
                infusionsByOrder={infusionsByOrder}
              />

              <Link
                className="mt-4 text-blue-400 border rounded border-gray-600 py-1 px-2 inline-block hover:text-blue-200 hover:border-blue-200"
                href={`/orders/${o.id}`}
              >
                View / Edit Order
              </Link>
            </Timeline.Item>
          );
        })}
      </Timeline>
    </>
  );
};
