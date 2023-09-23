import Link from "next/link";
import { Title, Button, Text } from "@mantine/core";
import { OrderTimeline } from "@/components/OrderTimeline.tsx";
import { getServerSession } from "next-auth/next";
import { GetServerSideProps } from "next";
import { supabase } from "@/utils/supabase";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { FactorOrder, InfusionByOrder } from "@/utils/types";
import { IconPlus } from "@tabler/icons-react";
import { Breadcrumbs } from "@/components/BreadCrumbs";
import { NotSignedInCard } from "@/components/NotSignedInCard";

interface IProps {
  orders?: FactorOrder[] | null;
  infusionsByOrder: InfusionByOrder[];
  userID: string | null;
}

export default function Orders({ orders, infusionsByOrder, userID }: IProps) {
  if (!userID) {
    return (
      <>
        <NotSignedInCard />
      </>
    );
  }
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { title: "Home", href: "/" },
          { title: "Orders", href: "/orders" },
        ]}
      />
      <Title mb={20}>Orders</Title>

      <Text mb={20}>
        All of your Factor Orders will be listed below in a timeline. You can
        view each infusion within each Factor Order as well!
      </Text>

      <Link className="mb-10 inline-block" href="/orders/create">
        <Button variant="outline" color="blue">
          <IconPlus className="mr-5" /> Create New Order
        </Button>
      </Link>

      <OrderTimeline orders={orders} infusionsByOrder={infusionsByOrder} />
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

  // get_infusions_by_order_for_user

  const { data: infusionsByOrder } = await supabase.rpc(
    "get_infusions_by_order_for_user",
    { uid: userID }
  );

  return {
    props: {
      orders: data,
      infusionsByOrder,
      userID: userID || null,
    },
  };
};
