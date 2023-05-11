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
  switch (req.method) {
    case "POST":
      return handlePost(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

const handleError = (res: NextApiResponse, e: unknown) => {
  res.status(500).send(e ? e?.details : "error unknown");
};

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { body } = req;

    if (!body.bleedLocation || body.bleedLocation === "") {
      return res.status(400).send("Bleed location is required");
    }

    const { data: newlyCreatedInfusion, error: errorForNewlyCreatedInfusion } =
      await supabase
        .from("infusion")
        .insert({
          infusion_date: body.infusionDate,
          bleed_location: body.bleedLocation,
          treated_within: body.treatedWithin,
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
