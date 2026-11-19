import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { nextCookies } from "better-auth/next-js"
import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)
const db = client.db('pizzahubdb')

export const auth = betterAuth({
    database: mongodbAdapter(db, { client }),

    // Store a signed HS256 JWT inside Better Auth's session cookie (better-auth.session_data)
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 60 * 60 * 24 * 7, // 7 days
            strategy: "jwt",
        },
    },

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
            update: {
                before: async (user) => {
                    // Security rule: Prevent users from changing their role, block status, or subscription
                    const cleanData = { ...user }
                    delete (cleanData as Record<string, unknown>).role
                    delete (cleanData as Record<string, unknown>).isBlocked
                    delete (cleanData as Record<string, unknown>).subscriptionPlan
                    delete (cleanData as Record<string, unknown>).subscriptionExpiresAt

                    return {
                        data: cleanData,
                    }
                },
            },
        },
    },

    plugins: [nextCookies()],
})
