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

  //  handle routes
  switch (req.method) {
    case "DELETE":
      return handleDelete(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

const handleError = (res: NextApiResponse, e: any) => {
  res.status(500).send(e ? e?.details : "error unknown");
};

const handleDelete = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;

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
