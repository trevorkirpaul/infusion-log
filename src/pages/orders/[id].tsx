import { OrderForm } from "@/components/OrderForm";
import { FactorOrder } from "@/utils/types";
import { Title, Breadcrumbs, Anchor, Button } from "@mantine/core";
import { GetServerSideProps } from "next";
import { supabase } from "@/utils/supabase";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import { useState } from "react";
import { notifications } from "@mantine/notifications";

const breadcrumbItems = (orderID: number | null | undefined) =>
  [
    { title: "Home", href: "/" },
    { title: "Orders", href: "/orders" },
    { title: orderID, href: `/orders/${orderID}` },
  ].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

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

  return (
    <div>
      <Breadcrumbs mb={10}>{breadcrumbItems(order?.id)}</Breadcrumbs>

      <Title mb={10}>View/Update Order</Title>
      <OrderForm
        handleSubmit={() => {}}
        formIsLoading={false}
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
