import { NextApiRequest, NextApiResponse } from "next"

import { ObjectId } from "mongodb"
import { authOptions } from "pages/api/auth/[...nextauth]"
import { db } from "lib/mongodb"
import { pick } from "lodash"
import { unstable_getServerSession } from "next-auth/next"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(req, res, authOptions)

  if (!session) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  const { id } = req.query
  const updates = req.body

  const domains = db.collection("domains")

  const result = await domains.updateOne(
    { _id: new ObjectId(id as string) },
    {
      $set: pick(updates, [
        "trafficIncoming",
        "trafficOutgoing",
        "isHttps",
        "title",
        "description",
        "background",
        "color",
      ]),
    }
  )

  if (result.modifiedCount === 0) {
    res.status(404).json({ message: "You don't have this domain." })
    return
  }

  res.json({ message: "The domain has been updated successfully." })
  return
}
