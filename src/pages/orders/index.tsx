import Link from "next/link";
import { Breadcrumbs, Anchor } from "@mantine/core";

const breadcrumbItems = [
  { title: "Home", href: "/" },
  { title: "Orders", href: "/orders" },
  // { title: 'Create New Order', href: '/orders/create' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

export default function Orders() {
  return (
    <>
      <Breadcrumbs>{breadcrumbItems}</Breadcrumbs>
      <h1>Orders</h1>
      <ul>
        <li>
          <Link href="/orders/create">Create New Order</Link>
        </li>
      </ul>
    </>
  );
}
