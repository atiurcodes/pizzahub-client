import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe';
import { auth } from '@/lib/auth';


export async function POST() {
    try {
        const headersList = await headers()
        const origin = headersList.get('origin')

        const getSession = await auth.api.getSession({
            headers: await headers()
        })
        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    // Provide the exact Price ID (for example, price_1234) of the product you want to sell
                    price: 'price_1Ue6lNRC61FZs98GA0MblQxx',
                    quantity: 1,
                },
            ],
            mode: 'payment',
            customer_email: getSession?.user?.email,
            success_url: `${origin}/dashboard/vendor/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/dashboard/vendor/subscription/cancel`,
            // Provide a name (for example, hosted_web_0001) to label this Checkout integration and measure its conversion independently
            integration_identifier: 'pizza_hub_web_001',
        });
        return NextResponse.redirect(session.url as string, 303)
    } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error')
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}