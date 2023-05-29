import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Group, Title, Text } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useState } from "react";
import { useRouter } from "next/router";

export const ReportModal = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleNaviateToReportCreation = () => {
    setLoading(true);
    const start = value[0]?.toISOString();
    const end = value[1]?.toISOString();

    const url = encodeURI(`/create-report?start=${start}&end=${end}`);

    router.push(url);
  };
  return (
    <>
      <Modal opened={opened} onClose={close} title="Create Report">
        <Text>
          Select a date range for the report. Any infusions within that range
          will be included.
        </Text>
        <Text>
          After creating the report, you will be able to download it as a PDF.
        </Text>
        <Group className="mt-10" position="center">
          <DatePicker
            size="lg"
            type="range"
            value={value}
            onChange={setValue}
          />
          <Button
            className="my-5"
            variant="outline"
            size="lg"
            onClick={handleNaviateToReportCreation}
            loading={loading}
            disabled={loading}
          >
            Create Report From Date Range
          </Button>
        </Group>
      </Modal>

      <Group className="mt-4">
        <Button color="green" variant="outline" onClick={open}>
          Create Report
        </Button>
      </Group>
    </>
  );
};
