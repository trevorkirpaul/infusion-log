import Link from "next/link";
import { Breadcrumbs, Anchor } from "@mantine/core";
import { OrderTimeline } from "@/components/OrderTimeline.tsx";
import { getServerSession } from "next-auth/next";
import { GetServerSideProps } from "next";
import { supabase } from "@/utils/supabase";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { FactorOrder } from "@/utils/types";

const breadcrumbItems = [
  { title: "Home", href: "/" },
  { title: "Orders", href: "/orders" },
  // { title: 'Create New Order', href: '/orders/create' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

interface IProps {
  orders: FactorOrder[];
}

export default function Orders({ orders }: IProps) {
  return (
    <>
      <Breadcrumbs>{breadcrumbItems}</Breadcrumbs>
      <h1 className="mb-5">Orders</h1>
      <ul className="mb-10">
        <li>
          <Link href="/orders/create">Create New Order</Link>
        </li>
      </ul>

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
    .eq("user_id", userID);

  return {
    props: {
      orders: data,
    },
  };
};
