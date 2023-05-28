import React from "react";
import { Page, View, StyleSheet } from "@react-pdf/renderer";
import { TableRow } from "./TableRow";
import type { Infusion } from "@/utils/types";

const styles = StyleSheet.create({
  page: {
    fontSize: 11,
    flexDirection: "column",
  },
});

interface IProps {
  infusions: Infusion[];
}

export const InfusionsTable = ({ infusions }: IProps) => (
  <View style={styles.page}>
    <TableRow infusions={infusions} />
  </View>
);
