import type { Infusion } from "@/utils/types";
import { Table } from "@mantine/core";

interface IProps {
  infusions: Infusion[];
}
export default function InfusionTable({ infusions }: IProps) {
  const rows = infusions.map((infusions) => (
    <tr key={infusions.id}>
      <td>{infusions.created_at}</td>
      <td>{infusions.bleed_location}</td>
      <td>{infusions.infusion_date}</td>
    </tr>
  ));

  return (
    <Table>
      <thead>
        <tr>
          <th>Created At</th>
          <th>Bleed Location</th>
          <th>Infusion Date</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}
