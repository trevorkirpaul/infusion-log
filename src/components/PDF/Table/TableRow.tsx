import React, { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Infusion } from "@/utils/types";
import dayjs from "dayjs";

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    paddingBottom: 5,
    borderBottom: "1px solid black",
  },
  description: {
    width: "60%",
  },
  xyz: {
    width: "40%",
  },
});

interface IProps {
  infusions: Infusion[];
}

export const TableRow = ({ infusions }: IProps) => {
  const rows = infusions.map((infusion) => (
    <View style={styles.row} key={infusion.id}>
      <Text style={styles.description}>
        {dayjs(infusion.infusion_date).format("MM/DD/YYYY h:mmA")}
      </Text>
      <Text style={styles.xyz}>{infusion.bleed_location}</Text>
    </View>
  ));
  return <Fragment>{rows}</Fragment>;
};
