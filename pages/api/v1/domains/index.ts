import { NextApiRequest, NextApiResponse } from "next"

import getDomains from "controllers/domains/getDomains"
import insertDomain from "controllers/domains/insertDomain"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    await insertDomain(req, res)
  } else if (req.method === "GET") {
    await getDomains(req, res)
  }

  res.status(404).end()
  return
}
