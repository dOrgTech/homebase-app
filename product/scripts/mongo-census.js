#!/usr/bin/env node
/* Read-only usage census for the Homebase lite backend (MongoDB).
 *
 * Counts documents per collection and buckets them by creation month
 * (derived from ObjectId timestamps — no schema assumptions).
 *
 * Usage:
 *   ATLAS_URI="mongodb+srv://..." node mongo-census.js
 *
 * Requires the `mongodb` driver on the resolution path (run from a
 * checkout of homebase-lite-backend, or `npm i mongodb` anywhere).
 * Read-only: only listDatabases/listCollections/count/find(_id) are used.
 */
const { MongoClient, ObjectId } = require("mongodb")

const uri = process.env.ATLAS_URI
if (!uri) {
  console.error("Set ATLAS_URI (never commit it).")
  process.exit(2)
}

function ym(oid) {
  const d = oid.getTimestamp()
  return d.getUTCFullYear() + "-" + String(d.getUTCMonth() + 1).padStart(2, "0")
}

async function main() {
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 20000 })
  await client.connect()
  const { databases } = await client.db().admin().listDatabases()
  console.log("Databases:", databases.map(d => `${d.name} (${(d.sizeOnDisk / 1024 / 1024).toFixed(1)}MB)`).join(", "))

  for (const dbInfo of databases) {
    if (["admin", "local", "config"].includes(dbInfo.name)) continue
    const db = client.db(dbInfo.name)
    console.log(`\n=== DB: ${dbInfo.name} ===`)
    for (const c of await db.listCollections().toArray()) {
      const coll = db.collection(c.name)
      const count = await coll.estimatedDocumentCount()
      console.log(`\n--- ${c.name}: ${count} docs ---`)
      if (count === 0 || count > 500000) continue
      const byMonth = {}
      for (const doc of await coll.find({}, { projection: { _id: 1 } }).toArray()) {
        if (doc._id instanceof ObjectId) byMonth[ym(doc._id)] = (byMonth[ym(doc._id)] || 0) + 1
      }
      console.log(Object.keys(byMonth).sort().map(m => `${m}: ${byMonth[m]}`).join("  "))
    }
  }
  await client.close()
}
main().catch(e => { console.error(e.message); process.exit(1) })
