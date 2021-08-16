import { NextApiRequest, NextApiResponse } from "next";
import { getSession  } from "next-auth/client";
import { stripe } from "../../services/stripe";

export default async(req: NextApiRequest, res:NextApiResponse) => {
    if(req.method === 'POST') {
        const session = await getSession({req})

        const stripeCustomer = await stripe.customers.create({
            email: session.user.email,
            // metadata:

        })

        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: stripeCustomer.id,
            payment_method_types: ['card'], //tipos de pagamentos
            billing_address_collection: 'required', //preencher endereço ou automatico
            line_items: [
                {price: 'price_1J36v8HtAsL3HzLBpP3xBpRF', quantity: 1 }
            ],
            mode:'subscription',
            allow_promotion_codes: true,
            success_url: process.env.STRIPE_SUCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL
        })

        return res.status(200).json({sessionId: stripeCheckoutSession.id })
    } else {
        res.setHeader('Allow', 'POST')
        res.status(405).end('method not alolowed')
    }
}