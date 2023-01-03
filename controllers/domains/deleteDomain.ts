import { NextApiRequest, NextApiResponse } from "next"

import { ObjectId } from "mongodb"
import { authOptions } from "pages/api/auth/[...nextauth]"
import { db } from "lib/mongodb"
import { unstable_getServerSession } from "next-auth/next"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(req, res, authOptions)

  if (!session) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  const { id } = req.query

  const domains = db.collection("domains")

  const result = await domains.deleteOne({
    _id: new ObjectId(id as string),
    owner: session.user?.email,
  })

  if (result.deletedCount === 0) {
    res.status(404).json({ message: "You don't have this domain." })
    return
  }

  res.json({ message: "The domain has been deleted successfully." })
  return
}
