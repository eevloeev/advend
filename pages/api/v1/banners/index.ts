import { NextApiRequest, NextApiResponse } from "next"

import makeBanner from "controllers/banners/makeBanner"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    await makeBanner(req, res)
  }

  res.status(404).end()
  return
}
