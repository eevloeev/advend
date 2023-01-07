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
    isHttps: true,
    title: "My favorite site",
    description: "The whole world will know about my site!",
    background: "linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)",
    color: "#ffffff",
    clicks: 0,
  }
  const id = await domains.insertOne(doc)

  res.json({ id, ...doc })
  return
}
