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
  text: {
    fontSize: 10,
    marginBottom: 5,
  },
  textCreatedOn: {
    marginBottom: 50,
    fontSize: 10,
  },
});

interface IProps {
  infusions: Infusion[];
  start: string | null;
  end: string | null;
  name: string | null;
  email: string | null;
}

export const InfusionLogReportPDF = ({
  infusions,
  start,
  end,
  name,
  email,
}: IProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.textTitle}>Infusion Log | Report</Text>
        <Text style={styles.text}>Name: {name}</Text>
        <Text style={styles.text}>Email: {email}</Text>
        <Text style={styles.text}>
          Created On: {dayjs().format("MM/DD/YYYY h:mmA")}
        </Text>
        <Text style={styles.text}>
          Start Date: {dayjs(start).format("MM/DD/YYYY h:mmA")}
        </Text>
        <Text style={styles.textCreatedOn}>
          End Date: {dayjs(end).format("MM/DD/YYYY h:mmA")}
        </Text>
        <InfusionsTable infusions={infusions} />
      </View>
    </Page>
  </Document>
);
