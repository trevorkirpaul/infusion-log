import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import dayjs from "dayjs";
import type { Infusion } from "@/utils/types";
import { InfusionsTable } from "../Table";

// Create styles
const styles = StyleSheet.create({
  downloadLink: {
    display: "inline-block",
    backgroundColor: "lightblue",
    color: "black",
    padding: 10,
    borderRadius: 4,
    width: 200,
    textAlign: "center",
  },
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 5,
    padding: 5,
    flexGrow: 1,
  },
  textTitle: {
    marginBottom: 40,
  },
  textCreatedOn: {
    marginBottom: 50,
    fontSize: 10,
  },
});

interface IProps {
  infusions: Infusion[];
}

export const InfusionLogReportPDF = ({ infusions }: IProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.textTitle}>Infusion Log | Report</Text>
        <Text style={styles.textCreatedOn}>
          Created On: {dayjs().format("MM/DD/YYYY h:mmA")}
        </Text>
        <InfusionsTable infusions={infusions} />
      </View>
    </Page>
  </Document>
);
