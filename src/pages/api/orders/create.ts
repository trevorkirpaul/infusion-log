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

    if (userIDFromSession !== Number(body.userID)) {
      return res
        .status(400)
        .send(
          "Error: You are not authorized to track another user's infusion."
        );
    }

    if (
      !body.quantity ||
      !body.doses_on_hand ||
      !body.order_placed_at ||
      !body.userID
    ) {
      return res.status(400).send("missing values required");
    }

    const { data, error } = await supabase
      .from("factor_order")
      .insert({
        quantity: body.quantity,
        doses_on_hand: body.doses_on_hand,
        order_placed_at: body.order_placed_at,
        user_id: body.userID,
        arrived: body.arrived || false,
      })
      .select();

    res.status(200).send({
      newlyCreatedFactorOrder: data,
      error,
    });
  } catch (e) {
    handleError(res, e);
  }
};
