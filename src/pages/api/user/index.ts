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
    case "PUT":
      return handlePut(req, res, session.user.id);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

const handleError = (res: NextApiResponse, e: unknown) => {
  res.status(500).send(e ? e?.details : "error unknown");
};

const handlePut = async (
  req: NextApiRequest,
  res: NextApiResponse,
  userId: any
) => {
  try {
    const { body } = req;

    const { data, error } = await supabase
      .from("user")
      .update({ bleeding_disorder: body.bleeding_disorder })
      .eq("id", userId)
      .select();

    res.status(200).send({
      data,
      error,
    });
  } catch (e) {
    handleError(res, e);
  }
};
