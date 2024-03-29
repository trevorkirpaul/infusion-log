import { OrderForm } from "@/components/OrderForm";
import { FactorOrder } from "@/utils/types";
import { Title, Button } from "@mantine/core";
import { GetServerSideProps } from "next";
import { supabase } from "@/utils/supabase";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { Breadcrumbs } from "@/components/BreadCrumbs";

interface IProps {
  order: FactorOrder | null;
  userID: any;
}

export default function ViewOrder({ userID, order }: IProps) {
  const [deleteIsLoading, setDeleteIsLoading] = useState(false);
  const [updateIsLoading, setUpdateIsLoading] = useState(false);

  const handleDeleteOrderByID = async () => {
    if (!order) return null;

    setDeleteIsLoading(true);
    const response = await fetch(`/api/orders/${order.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID,
      }),
    });

    if (!response.ok) {
      notifications.show({
        title: "Something went wrong!",
        message: "Please try again later.",
        color: "red",
        autoClose: 5000,
      });
    } else {
      notifications.show({
        title: "Success!",
        message: "Factor Order deleted.",
        color: "green",
        autoClose: 5000,
      });
    }
    setDeleteIsLoading(false);
  };

  const handleUpdateFactorOrderByID = async (e: any) => {
    e.preventDefault();

    if (!order) return null;

    setUpdateIsLoading(true);

    const { quantity, doses_on_hand, order_placed_at, arrived } = e.target;

    const response = await fetch(`/api/orders/${order.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quantity: quantity.value,
        doses_on_hand: doses_on_hand.value,
        order_placed_at: order_placed_at[1].value,
        userID,
        arrived: arrived.checked,
      }),
    });

    if (!response.ok) {
      notifications.show({
        title: "Something went wrong!",
        message: "Please try again later.",
        color: "red",
        autoClose: 5000,
      });
    } else {
      notifications.show({
        title: "Success!",
        message: "Factor Order updated.",
        color: "green",
        autoClose: 5000,
      });
    }

    setUpdateIsLoading(false);
  };

  return (
    <div>
      <Breadcrumbs
        crumbs={[
          { title: "Home", href: "/" },
          { title: "Orders", href: "/orders" },
          { title: order?.id || "?", href: `/orders/${order?.id}` },
        ]}
      />

      <Title mb={10}>View/Update Order</Title>
      <OrderForm
        handleSubmit={handleUpdateFactorOrderByID}
        formIsLoading={updateIsLoading}
        currentValues={order}
      />
      <div className="my-4">
        <Button
          variant="outline"
          color="red"
          onClick={handleDeleteOrderByID}
          loading={deleteIsLoading}
          disabled={deleteIsLoading}
        >
          Delete Infusion
        </Button>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const userID = session?.user?.id;
  const { id: orderID } = ctx.query;

  const { data } = await supabase
    .from("factor_order")
    .select("*")
    .eq("id", orderID)
    .eq("user_id", userID);

  return {
    props: {
      order: data ? data[0] : null,
      userID,
    },
  };
};
