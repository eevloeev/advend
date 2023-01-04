import { NextApiRequest, NextApiResponse } from "next"

import deleteDomain from "controllers/domains/deleteDomain"
import editDomain from "controllers/domains/editDomain"
import getDomain from "controllers/domains/getDomain"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    await getDomain(req, res)
  } else if (req.method === "DELETE") {
    await deleteDomain(req, res)
  } else if (req.method === "PUT") {
    await editDomain(req, res)
  }

  res.status(404).end()
  return
}
