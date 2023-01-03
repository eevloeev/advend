import { NextApiRequest, NextApiResponse } from "next"

import deleteDomain from "controllers/domains/deleteDomain"
import editDomain from "controllers/domains/editDomain"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    await deleteDomain(req, res)
  } else if (req.method === "PUT") {
    await editDomain(req, res)
  }

  res.status(404).end()
  return
}
