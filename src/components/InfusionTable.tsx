import type { Infusion } from "@/utils/types";
import { Table, Text, Tooltip } from "@mantine/core";
import dayjs from "dayjs";
interface IProps {
  infusions: Infusion[];
}
export default function InfusionTable({ infusions }: IProps) {
  const rows = infusions.map((infusions) => (
    <tr key={infusions.id}>
      <td>{dayjs(infusions.infusion_date).format("MM/DD/YYYY h:mmA")}</td>
      <td>{infusions.bleed_location}</td>
    </tr>
  ));

  return (
    <>
      <Table striped highlightOnHover captionSide="top" fontSize="lg">
        <caption>Dates are in MM/DD/YYYY h:mmA format</caption>
        <thead>
          <tr>
            <th>Infusion Date</th>
            <th>Bleed Location</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </>
  );
}
