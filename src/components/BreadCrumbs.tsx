import { Breadcrumbs as BC } from "@mantine/core";
import React from "react";
import Link from "next/link";

interface Crumb {
  title: string | number;
  href: string;
}

interface IProps {
  crumbs: Crumb[];
}

export const Breadcrumbs: React.FC<IProps> = ({ crumbs }) => {
  return (
    <BC mb={10}>
      {crumbs.map((c) => (
        <Link className="text-blue-400" key={c.title} href={c.href}>
          {c.title}
        </Link>
      ))}
    </BC>
  );
};
