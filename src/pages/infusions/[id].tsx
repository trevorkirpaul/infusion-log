import { useRouter } from "next/router";
import { Title, Text, Button } from "@mantine/core";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { supabase } from "@/utils/supabase";
import type { Infusion } from "@/utils/types";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import dayjs from "dayjs";

import { authOptions } from "../../pages/api/auth/[...nextauth]";

interface IProps {
  infusion: Infusion | null;
}

export default function ViewInfusion({ infusion }: IProps) {
  const [deleteIsLoading, setDeleteIsLoading] = useState(false);

  const handleDeleteInfusionByID = async () => {
    if (!infusion) {
      return null;
    }

    setDeleteIsLoading(true);
    const response = await fetch(`/api/infusions/${infusion.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      notifications.show({
        title: "Something went wrong!",
        message: "Please try again later.",
        color: "red",
        autoClose: 5000,
      });
    } else {
      notifications.show({
        title: "Success!",
        message: "Infusion deleted.",
        color: "green",
        autoClose: 5000,
      });
    }

    setDeleteIsLoading(false);
  };

  if (!infusion) {
    return (
      <>
        <Text>no infusion found</Text>
      </>
    );
  }

  return (
    <>
      <Title className="mb-4">View Infusion</Title>
      <Text>ID: {infusion.id}</Text>
      <Text>
        Infusion Date:{" "}
        {dayjs(infusion.infusion_date).format("MM/DD/YYYY h:mmA")}
      </Text>
      <Text>Bleed Location: {infusion.bleed_location}</Text>
      <Text>Notes: {infusion.notes || "n/a"}</Text>
      <div className="my-4">
        <Button
          variant="outline"
          color="red"
          onClick={handleDeleteInfusionByID}
          loading={deleteIsLoading}
          disabled={deleteIsLoading}
        >
          Delete Infusion
        </Button>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const userID = session?.user?.id;
  const { id: infusionID } = ctx.query;

  const { data } = await supabase
    .from("infusion")
    .select("*")
    .eq("id", infusionID)
    .eq("user_id", userID);

  return {
    props: {
      infusion: data ? data[0] : null,
    },
  };
};
