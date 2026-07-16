#!/usr/bin/env node
/* Read-only usage census for Homebase Etherlink data (Firestore).
 *
 * Lists root collections, counts documents, and buckets them by creation
 * month using Firestore's document createTime metadata.
 *
 * Auth: exchanges the operator's local firebase-tools CLI login for an
 * access token — run `firebase login` first. The OAuth client id/secret
 * below are firebase-tools' own public constants (shipped in its source),
 * not credentials.
 *
 * Usage:
 *   node firestore-census.js [projectId]     (default: homebase-6907d)
 */
const fs = require("fs")
const os = require("os")
const path = require("path")

const PROJECT = process.argv[2] || "homebase-6907d"
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)`
const CLIENT_ID = "563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com"
const CLIENT_SECRET = "j9iVZfS8kkCEFUPaAeJV0sAi"

async function getToken() {
  const cfg = JSON.parse(
    fs.readFileSync(path.join(os.homedir(), ".config", "configstore", "firebase-tools.json"), "utf8")
  )
  const refresh = cfg.tokens && cfg.tokens.refresh_token
  if (!refresh) throw new Error("No firebase-tools login found — run `firebase login` first")
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: refresh,
      grant_type: "refresh_token"
    })
  })
  if (!res.ok) throw new Error(`token exchange failed: ${res.status} ${await res.text()}`)
  return (await res.json()).access_token
}

async function api(token, url, body) {
  const res = await fetch(url, {
    method: body ? "POST" : "GET",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined
  })
  if (!res.ok) throw new Error(`${url.slice(BASE.length)}: ${res.status} ${await res.text()}`)
  return res.json()
}

const ym = iso => iso.slice(0, 7)

async function main() {
  const token = await getToken()
  const { collectionIds } = await api(token, `${BASE}/documents:listCollectionIds`, { pageSize: 100 })
  console.log("Root collections:", collectionIds.join(", "))

  for (const cid of collectionIds) {
    const agg = await api(token, `${BASE}/documents:runAggregationQuery`, {
      structuredAggregationQuery: {
        structuredQuery: { from: [{ collectionId: cid }] },
        aggregations: [{ count: {}, alias: "n" }]
      }
    })
    const count = agg[0] && agg[0].result ? agg[0].result.aggregateFields.n.integerValue : "?"
    console.log(`\n--- ${cid}: ${count} docs ---`)
    if (count === "?" || Number(count) === 0) continue

    const byMonth = {}
    const rows = await api(token, `${BASE}/documents:runQuery`, {
      structuredQuery: {
        from: [{ collectionId: cid }],
        select: { fields: [{ fieldPath: "__name__" }] }
      }
    })
    for (const row of rows) {
      if (row.document) byMonth[ym(row.document.createTime)] = (byMonth[ym(row.document.createTime)] || 0) + 1
    }
    console.log(Object.keys(byMonth).sort().map(m => `${m}: ${byMonth[m]}`).join("  "))
  }
}
main().catch(e => { console.error(e.message); process.exit(1) })
