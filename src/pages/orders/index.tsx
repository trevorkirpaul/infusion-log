import Link from "next/link";
import { Title, Button } from "@mantine/core";
import { OrderTimeline } from "@/components/OrderTimeline.tsx";
import { getServerSession } from "next-auth/next";
import { GetServerSideProps } from "next";
import { supabase } from "@/utils/supabase";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { FactorOrder } from "@/utils/types";
import { IconPlus } from "@tabler/icons-react";
import { Breadcrumbs } from "@/components/BreadCrumbs";

interface IProps {
  orders: FactorOrder[];
}

export default function Orders({ orders }: IProps) {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { title: "Home", href: "/" },
          { title: "Orders", href: "/orders" },
        ]}
      />
      <Title mb={20}>Orders</Title>

      <Link className="mb-10 inline-block" href="/orders/create">
        <Button variant="outline" color="blue">
          <IconPlus className="mr-5" /> Create New Order
        </Button>
      </Link>

      <OrderTimeline orders={orders} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const userID = session?.user?.id;

  const { data } = await supabase
    .from("factor_order")
    .select("*", { count: "exact", head: false })
    .eq("user_id", userID)
    .order("order_placed_at", { ascending: false });

  return {
    props: {
      orders: data,
    },
  };
};
