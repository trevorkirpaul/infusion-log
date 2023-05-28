import React from "react";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../pages/api/auth/[...nextauth]";

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
    display: "inline-block",
    backgroundColor: "lightblue",
    color: "black",
    padding: 10,
    borderRadius: 4,
    width: 200,
    textAlign: "center",
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
        {({ blob, url, loading, error }) =>
          loading ? "Loading document..." : "Download now!"
        }
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
