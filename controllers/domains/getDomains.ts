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

  const domains = db.collection("domains")
  const query = {
    owner: session.user?.email,
  }

  const cursor = domains.find(query)
  const domainList: any = []
  await cursor.forEach((doc) =>
    domainList.push({
      id: doc?._id,
      domain: doc?.domain,
      owner: doc?.owner,
      trafficIncoming: doc?.trafficIncoming,
      trafficOutgoing: doc?.trafficOutgoing,
    })
  )

  res.json({ domains: domainList })
  return
}
