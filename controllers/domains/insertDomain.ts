import { NextApiRequest, NextApiResponse } from "next"

import { authOptions } from "pages/api/auth/[...nextauth]"
import { db } from "lib/mongodb"
import { unstable_getServerSession } from "next-auth/next"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(req, res, authOptions)

  if (!session) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  const { domain } = req.body

  const domains = db.collection("domains")

  const candidate = await domains.findOne({
    domain,
    owner: session.user?.email,
  })

  if (candidate) {
    res.status(409).json({ message: "This domain has been added before." })
    return
  }

  const doc = {
    domain,
    owner: session.user?.email,
    trafficIncoming: false,
    trafficOutgoing: false,
  }
  const id = await domains.insertOne(doc)

  res.json({ id, ...doc })
  return
}
