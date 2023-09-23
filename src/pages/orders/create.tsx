import { useState } from "react";
import { OrderForm } from "@/components/OrderForm";
import { useSession } from "next-auth/react";
import { notifications } from "@mantine/notifications";
import { IconCircleXFilled } from "@tabler/icons-react";
import { GetServerSideProps } from "next";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { Breadcrumbs } from "@/components/BreadCrumbs";

interface IProps {
  userID: any;
}

export default function Orders({ userID }: IProps) {
  const { status, data } = useSession();
  const [formIsLoading, setFormIsLoading] = useState(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    // prevent submission if !auth
    if (status !== "authenticated") {
      return notifications.show({
        title: "Unauthorized",
        message: "Please sign in to continue.",
        color: "red",
        autoClose: 5000,
        icon: <IconCircleXFilled />,
      });
    }

    setFormIsLoading(true);

    const { quantity, doses_on_hand, order_placed_at, arrived } = event.target;

    const body = {
      quantity: quantity.value,
      doses_on_hand: doses_on_hand.value,
      order_placed_at: order_placed_at[1].value,
      userID,
      arrived: arrived.checked,
    };

    const res = await fetch("/api/orders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      setFormIsLoading(false);
      return notifications.show({
        title: "Something went wrong!",
        message: "Please try again later.",
        color: "red",
        autoClose: 5000,
        icon: <IconCircleXFilled />,
      });
    }

    setFormIsLoading(false);

    return notifications.show({
      title: "Success",
      message: "You have successfully created a new order.",
      color: "blue",
      autoClose: 5000,
    });
  };

  return (
    <>
      <Breadcrumbs
        crumbs={[
          { title: "Home", href: "/" },
          { title: "Orders", href: "/orders" },
          { title: "Create New Order", href: "/orders/create" },
        ]}
      />

      <h1>Create Order</h1>
      <OrderForm handleSubmit={handleSubmit} formIsLoading={formIsLoading} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const userID = session?.user?.id;
  return {
    props: {
      userID,
    },
  };
};
