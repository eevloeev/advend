import { NextApiRequest, NextApiResponse } from "next"

import { ObjectId } from "mongodb"
import { authOptions } from "pages/api/auth/[...nextauth]"
import { db } from "lib/mongodb"
import { unstable_getServerSession } from "next-auth"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query

  const domains = db.collection("domains")
  const query = { _id: new ObjectId(id as string) }

  const doc = await domains.findOne(query)

  if (!doc) {
    res.status(404).json({ message: "Domain not found." })
    return
  }

  let docDTO
  const session = await unstable_getServerSession(req, res, authOptions)

  if (session) {
    docDTO = {
      id: doc?._id,
      domain: doc?.domain,
      owner: doc?.owner,
      trafficIncoming: doc?.trafficIncoming,
      trafficOutgoing: doc?.trafficOutgoing,
      isHttps: doc?.isHttps,
      title: doc?.title,
      description: doc?.description,
      style: doc?.style,
    }
  } else {
    docDTO = {
      id: doc?._id,
      trafficIncoming: doc?.trafficIncoming,
      trafficOutgoing: doc?.trafficOutgoing,
      isHttps: doc?.isHttps,
      title: doc?.title,
      description: doc?.description,
      style: doc?.style,
    }
  }

  res.json(docDTO)
  return
}
