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

  switch (req.method) {
    case "POST":
      return handlePost(req, res, userIDFromSession);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

const handleError = (res: NextApiResponse, e: any) => {
  res.status(500).send(e ? e?.details : "error unknown");
};

const handlePost = async (
  req: NextApiRequest,
  res: NextApiResponse,
  userIDFromSession: number | null
) => {
  try {
    const { body } = req;

    if (!body.bleedLocation || body.bleedLocation === "") {
      return res.status(400).send("Bleed location is required");
    }

    if (userIDFromSession !== body.userID) {
      return res
        .status(400)
        .send(
          "Error: You are not authorized to track another user's infusion."
        );
    }

    const { data: newlyCreatedInfusion, error: errorForNewlyCreatedInfusion } =
      await supabase
        .from("infusion")
        .insert({
          infusion_date: body.infusionDate,
          bleed_location: body.bleedLocation,
          treated_within: body.treatedWithin,
          notes: body.notes,
          user_id: body.userID,
        })
        .select();

    res.status(200).send({
      newlyCreatedInfusion,
      errorForNewlyCreatedInfusion,
    });
  } catch (e) {
    handleError(res, e);
  }
};
