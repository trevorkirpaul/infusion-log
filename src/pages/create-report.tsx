import React from "react";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import {
  Button,
  Title,
  Text as TextMantine,
  Divider,
  Alert,
} from "@mantine/core";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { IconAlertCircle } from "@tabler/icons-react";

import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { InfusionLogReportPDF } from "@/components/PDF/Document";
import { supabase } from "@/utils/supabase";
import type { Infusion } from "@/utils/types";

const styles = StyleSheet.create({
  downloadLink: {
    // display: "inline-block",
    // backgroundColor: "lightblue",
    // color: "black",
    // padding: 10,
    // borderRadius: 4,
    // width: 200,
    // textAlign: "center",
  },
});

interface IProps {
  infusions: Infusion[];
  numberOfInfusions: number;
  start: string | null;
  end: string | null;
  name: string | null;
  email: string | null;
}

function Example({ infusions, start, end, name, email }: IProps) {
  return (
    <div>
      <Title className="mb-5">Report</Title>
      <Alert
        icon={<IconAlertCircle size="1rem" />}
        title="Important"
        color="yellow"
        mb="lg"
      >
        Infusion Log is <span className="font-bold">not</span> HIPPA compliant.
        Please do not include any personal information in your report.
      </Alert>

      <TextMantine className="mb-10">
        Your report will be available once the button below is ready.
      </TextMantine>

      <Divider className="my-10" />
      <PDFDownloadLink
        document={
          <InfusionLogReportPDF
            infusions={infusions}
            start={start}
            end={end}
            name={name}
            email={email}
          />
        }
        fileName="infusion_log_test.pdf"
        style={styles.downloadLink}
      >
        {({ blob, url, loading, error }) => {
          return (
            <Button
              loading={loading}
              disabled={loading}
              color={loading ? "gray" : "green"}
              variant="outline"
            >
              {loading
                ? "Loading document..."
                : "Your Report is ready, click here to download now"}
            </Button>
          );
        }}
      </PDFDownloadLink>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const userID = session?.user?.id;

  const { start, end } = ctx.query;

  const { count: numberOfInfusions, data } = await supabase
    .from("infusion")
    .select("*", { count: "exact", head: false })
    .eq("user_id", userID)
    .gte("infusion_date", start)
    .lte("infusion_date", end)
    .order("infusion_date", { ascending: false });

  return {
    props: {
      numberOfInfusions,
      infusions: data || [],
      start,
      end,
      email: session?.user?.email,
      name: session?.user?.name,
    },
  };
};

Example.getLayout = function getLayout(page: any) {
  return <>{page}</>;
};

export default dynamic(() => Promise.resolve(Example), {
  ssr: false,
});
