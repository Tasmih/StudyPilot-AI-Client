import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

// Cache the MongoDB connection in Next.js development to avoid exhausting connections
const globalForMongo = global as unknown as { mongoClient?: MongoClient };

const client = globalForMongo.mongoClient || new MongoClient(process.env.MONGO_URI as string);
if (process.env.NODE_ENV !== "production") globalForMongo.mongoClient = client;

const db = client.db(process.env.DB_NAME || "studypilot_ai");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
