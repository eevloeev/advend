// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { MongoClient } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const databaseName = "advend"
const uri = process.env.MONGODB_URI
const options = {}

let client = new MongoClient(uri, options)
let clientPromise: Promise<MongoClient> = client.connect()
let db = client.db(databaseName)

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise
export { db, databaseName }
