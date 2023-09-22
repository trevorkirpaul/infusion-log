import { useState } from "react";
import { OrderForm } from "@/components/OrderForm";
import { Breadcrumbs, Anchor } from "@mantine/core";
import { useSession } from "next-auth/react";
import { notifications } from "@mantine/notifications";
import { IconCircleXFilled } from "@tabler/icons-react";

const breadcrumbItems = [
  { title: "Home", href: "/" },
  { title: "Orders", href: "/orders" },
  { title: "Create New Order", href: "/orders/create" },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

export default function Orders() {
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

    const { quantity, doses_on_hand, order_placed_at } = event.target;

    const body = {
      quantity: quantity.value,
      doses_on_hand: doses_on_hand.value,
      order_placed_at: order_placed_at[1].value,
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
      <Breadcrumbs>{breadcrumbItems}</Breadcrumbs>

      <h1>Create Order</h1>
      <OrderForm handleSubmit={handleSubmit} formIsLoading={formIsLoading} />
    </>
  );
}
