import type { Infusion } from "@/utils/types";
import { Table, Text, Tooltip } from "@mantine/core";
import dayjs from "dayjs";
import Link from "next/link";

interface IProps {
  infusions: Infusion[];
}
export default function InfusionTable({ infusions }: IProps) {
  const rows = infusions.map((infusions) => (
    <tr key={infusions.id}>
      <td>
        <Link
          className="text-blue-500 underline"
          href={`/infusions/${infusions.id}`}
        >
          {infusions.id}
        </Link>
      </td>
      <td>{dayjs(infusions.infusion_date).format("MM/DD/YYYY h:mmA")}</td>
      <td>{infusions.bleed_location}</td>
      <td className="max-w-sm">{infusions.notes || "n/a"}</td>
    </tr>
  ));

  return (
    <>
      <Table striped highlightOnHover fontSize="lg">
        <caption>Dates are in MM/DD/YYYY h:mmA format</caption>
        <thead>
          <tr>
            <th>ID</th>
            <th>Infusion Date</th>
            <th>Bleed Location</th>
            <th className="max-w-sm">Notes</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </>
  );
}
