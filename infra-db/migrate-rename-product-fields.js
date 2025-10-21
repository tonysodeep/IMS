/*
Migration script: rename fields in products collection
- categoryId -> category
- supplierId -> supplier

Usage:
  # dry-run (default) - shows sample updates, no writes
  node migrate-rename-product-fields.js

  # run actual migration
  DRY_RUN=false node migrate-rename-product-fields.js

Set MONGO_URI env to point to your MongoDB, defaults to mongodb://localhost:27017/inventory
*/

import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/pos-db";
const DRY_RUN = process.env.DRY_RUN !== "false"; // default true

async function main() {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    console.log("Connected to", MONGO_URI);
    const db = client.db();
    const products = db.collection("products");

    // count matching docs first
    const filter = { $or: [{ categoryId: { $exists: true } }, { supplierId: { $exists: true } }] };
    const count = await products.countDocuments(filter);
    console.log(`Found ${count} product(s) with legacy fields (categoryId/supplierId).`);

    if (count === 0) return;

    const batchSize = 100;
    let processed = 0;

    const cursor = products.find(filter).batchSize(batchSize);

    while (await cursor.hasNext()) {
      const batchDocs = [];
      for (let i = 0; i < batchSize && (await cursor.hasNext()); i++) {
        const doc = await cursor.next();
        const updates = {};
        if (doc.categoryId !== undefined && doc.category === undefined) {
          updates.category = doc.categoryId;
        }
        if (doc.supplierId !== undefined && doc.supplier === undefined) {
          updates.supplier = doc.supplierId;
        }
        if (Object.keys(updates).length > 0) {
          batchDocs.push({ _id: doc._id, updates });
        }
      }

      if (batchDocs.length === 0) break;

      console.log(`Prepared ${batchDocs.length} update(s)`);
      if (DRY_RUN) {
        batchDocs.slice(0, 5).forEach((b) => console.log("DRY RUN sample:", b));
      } else {
        // build bulkWrite operations
        const ops = batchDocs.map((b) => ({
          updateOne: {
            filter: { _id: b._id },
            update: { $set: b.updates, $unset: { categoryId: "", supplierId: "" } },
          },
        }));
        const res = await products.bulkWrite(ops, { ordered: false });
        console.log("Bulk result:", res);
      }

      processed += batchDocs.length;
    }

    console.log(`Processed ~${processed} documents. ${DRY_RUN ? "(dry run)" : "(updated)"}`);
    console.log("Done.");
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

main();
