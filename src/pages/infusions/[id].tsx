import { useRouter } from "next/router";
import { Title, Text, Button } from "@mantine/core";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { supabase } from "@/utils/supabase";
import type { Infusion } from "@/utils/types";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { Breadcrumbs } from "@/components/BreadCrumbs";

import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { TrackInfusionForm } from "@/components/TrackInfusionForm";

interface IProps {
  infusion: Infusion | null;
  userID: string | null;
}

export default function ViewInfusion({ infusion, userID }: IProps) {
  const [deleteIsLoading, setDeleteIsLoading] = useState(false);
  const [updateIsLoading, setUpdateIsLoading] = useState(false);

  const handleDeleteInfusionByID = async () => {
    if (!infusion) {
      return null;
    }

    setDeleteIsLoading(true);
    const response = await fetch(`/api/infusions/${infusion.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userID,
      }),
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

  const handleUpdateInfusionByID = async (event: any) => {
    event.preventDefault();

    if (!infusion) {
      return null;
    }
    const bleed_location = event.target.bleed_location.value
      .toLowerCase()
      .trim();
    const infusion_date = event.target.infusion_date[1].value;
    const treated_within = event.target.treated_within.checked;
    const notes = event.target.notes.value.trim();

    setUpdateIsLoading(true);

    const response = await fetch(`/api/infusions/${infusion.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bleed_location,
        infusion_date,
        treated_within,
        notes,
        userID,
      }),
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
        message: "Infusion updated.",
        color: "green",
        autoClose: 5000,
      });
    }

    setUpdateIsLoading(false);
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
      <Breadcrumbs
        crumbs={[
          { title: "Home", href: "/" },
          { title: "Infusions", href: "/infusions/view" },
          { title: infusion.id, href: `/infusions/${infusion.id}` },
        ]}
      />
      <Title className="mb-2">View Infusion</Title>
      <Text className="mb-4 font-bold text-green-400">ID: {infusion.id}</Text>
      <TrackInfusionForm
        handleSubmit={handleUpdateInfusionByID}
        uniqueBleedLocations={[]}
        formIsLoading={updateIsLoading}
        currentValues={infusion}
      />

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
      userID: userID || null,
    },
  };
};
