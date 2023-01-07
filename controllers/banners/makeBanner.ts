import { NextApiRequest, NextApiResponse } from "next"

import { ObjectId } from "mongodb"
import { db } from "lib/mongodb"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query

  if (!id) {
    res.status(400).json({ message: "ID required" })
    return
  }

  const domains = db.collection("domains")

  const cursor = domains.aggregate([
    {
      $match: {
        _id: { $nin: [new ObjectId(id as string)] },
        trafficIncoming: true,
      },
    },
    { $sample: { size: 3 } },
  ])
  const data: any = []
  await cursor.forEach((doc) =>
    data.push({
      title: doc?.title ?? "",
      description: doc?.description ?? "",
      link: `${process.env.API_URL}/api/v1/redirect?to=${doc?._id}`,
      background: doc?.background ?? "#000000",
      color: doc?.color ?? "#ffffff",
    })
  )

  res.json(data)
  return
}
