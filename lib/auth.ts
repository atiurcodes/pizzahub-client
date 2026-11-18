import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { nextCookies } from "better-auth/next-js"
import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)
const db = client.db('pizzahubdb')

export const auth = betterAuth({
    database: mongodbAdapter(db, { client }),

    emailAndPassword: {
        enabled: true,
        minPasswordLength: 6,
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        },
    },

    user: {
        additionalFields: {
            role: { type: "string", defaultValue: "customer", input: true },
            isBlocked: { type: "boolean", defaultValue: false, input: false },
            businessName: { type: "string", defaultValue: "", input: true },
            subscriptionPlan: { type: "string", defaultValue: "free", input: false },
            subscriptionExpiresAt: { type: "date", required: false, input: false },
        },
    },

    databaseHooks: {
        user: {
            create: {
                before: async (user) => ({
                    data: {
                        ...user,
                        // Block "admin" role on public sign up
                        role: user.role === "vendor" ? "vendor" : "customer",
                    },
                }),
            },
        },
    },

    plugins: [nextCookies()],
})
