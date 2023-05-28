import React, { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Infusion } from "@/utils/types";
import dayjs from "dayjs";

const baseRowStyles = {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 5,
  paddingBottom: 5,
  padding: 2,
};

const styles = StyleSheet.create({
  row: {
    ...baseRowStyles,
    backgroundColor: "lightgray",
  },
  rowLight: {
    ...baseRowStyles,
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
  const rows = infusions.map((infusion, idx) => (
    <View
      style={idx % 2 === 0 ? styles.row : styles.rowLight}
      key={infusion.id}
    >
      <Text style={styles.description}>
        {dayjs(infusion.infusion_date).format("MM/DD/YYYY h:mmA")}
      </Text>
      <Text style={styles.xyz}>{infusion.bleed_location}</Text>
    </View>
  ));
  return <Fragment>{rows}</Fragment>;
};
