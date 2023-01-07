import type { NextApiRequest, NextApiResponse } from "next"

import { ObjectId } from "mongodb"
import { db } from "lib/mongodb"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { to } = req.query

  const domains = db.collection("domains")
  const query = { _id: new ObjectId(to as string) }

  const doc = await domains.findOne(query)

  if (!doc) {
    res.status(404).json({ message: "Domain not found." })
    return
  }

  domains.updateOne(query, { $inc: { clicks: 1 } })

  const target = `http${doc?.isHttps ? "s" : ""}://${doc?.domain}`

  res.status(302).redirect(target)
}
