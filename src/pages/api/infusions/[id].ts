import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // protect route
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).send("unauthorized");
  }

  const userIDFromSession: number | null = session?.user?.id || null;

  //  handle routes
  switch (req.method) {
    case "DELETE":
      return handleDelete(req, res, userIDFromSession);
    case "PUT":
      return handleUpdate(req, res, userIDFromSession);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

const handleError = (res: NextApiResponse, e: any) => {
  res.status(500).send(e ? e?.details : "error unknown");
};

const handleDelete = async (
  req: NextApiRequest,
  res: NextApiResponse,
  userIDFromSession: number | null
) => {
  try {
    const { id } = req.query;
    const { userID } = req.body;

    if (userIDFromSession !== Number(userID)) {
      return res
        .status(400)
        .send(
          "Error: You are not authorized to track another user's infusion."
        );
    }

    const { data: deletedInfusion, error: errorForDeletedInfusion } =
      await supabase.from("infusion").delete().match({ id: id });

    res.status(200).send({
      deletedInfusion,
      errorForDeletedInfusion,
    });
  } catch (e) {
    handleError(res, e);
  }
};

const handleUpdate = async (
  req: NextApiRequest,
  res: NextApiResponse,
  userIDFromSession: number | null
) => {
  try {
    const { id } = req.query;
    const { userID } = req.body;

    if (userIDFromSession !== Number(userID)) {
      return res
        .status(400)
        .send(
          "Error: You are not authorized to track another user's infusion."
        );
    }

    const { bleed_location, infusion_date, notes, treated_within } = req.body;

    const { data: newlyUpdatedInfusion, error: updateInfusionError } =
      await supabase
        .from("infusion")
        .update({
          bleed_location,
          infusion_date,
          notes,
          treated_within,
        })
        .eq("id", id)
        .select();

    res.status(200).send({
      newlyUpdatedInfusion,
      updateInfusionError,
    });
  } catch (e) {
    handleError(res, e);
  }
};
