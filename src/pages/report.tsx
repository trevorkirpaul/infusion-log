import { NotSignedInCard } from "@/components/NotSignedInCard";
import { ReportModal } from "@/components/Report/Modal";
import { Divider, Title, Text } from "@mantine/core";
import { useSession } from "next-auth/react";
import { Breadcrumbs } from "@/components/BreadCrumbs";

export default function Report() {
  const { status } = useSession();

  if (status !== "authenticated") {
    return <NotSignedInCard />;
  }

  return (
    <>
      <Breadcrumbs
        crumbs={[
          { title: "Home", href: "/" },
          { title: "Report", href: "/report" },
        ]}
      />
      <Title className="mb-8">Report</Title>
      <Text>
        Create a PDF report with a table showing your infusions within the
        selected date range. Click the Create Report button to start.
      </Text>

      <ReportModal />
      <Divider my="lg" />
    </>
  );
}
