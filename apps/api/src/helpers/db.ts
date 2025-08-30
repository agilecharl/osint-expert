import { Db, Document, MongoClient, WithId } from 'mongodb';
import { Pool } from 'pg';

// MongoDB Helper
let mongoClient: MongoClient | null = null;
let mongoDb: Db | null = null;

// PostgreSQL Helper
const pgPool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export async function pgQuery<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const client = await pgPool.connect();
  try {
    const res = await client.query(text, params);
    return res.rows;
  } finally {
    client.release();
  }
}

export async function getMongoDb(): Promise<Db> {
  if (!mongoClient) {
    mongoClient = new MongoClient(process.env.MONGO_URL as string);
    await mongoClient.connect();
    mongoDb = mongoClient.db(process.env.MONGO_DB_NAME);
  }
  return mongoDb!;
}

export async function mongoFind<T extends WithId<Document> = WithId<Document>>(
  collection: string,
  query: object = {}
): Promise<T[]> {
  const db = await getMongoDb();
  return db.collection(collection).find(query).toArray() as Promise<T[]>;
}

export async function mongoInsert<T extends Document>(
  collection: string,
  doc: T
): Promise<void> {
  const db = await getMongoDb();
  await db.collection(collection).insertOne(doc);
}
