const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY,);

export default async function handler(req, res) {
  if (req.method == "POST") {
    try {
      console.log(req.body.data)
let {amount,quantity,description} = req.body.data;
      // Create Checkout Sessions from body params.4
      // let transformedItem = {
      //   price_data: {
      //     currency: "usd",
      //     product_data: {
      //       name: "HealthiWealthi™ RXHEAL Reward Tokens",
      //     },
      //     unit_amount: 100 * 100,
      //   },
      //   description: "HealthiWealthi™ RXHEAL Reward Tokens",
      //   quantity: 1,
      // };
      console.log(amount,quantity)
      const session = await stripe.checkout.sessions.create({
        // customer_email: 'customer@example.com',
        payment_method_types: ['card'],

        line_items: [
          {
            price_data: {
              currency: "usd",
              unit_amount: 100* amount,
              product_data: {
                name: "NFT",
                description,
                images: ["https://media.geeksforgeeks.org/wp-content/uploads/20200412121906/skeleton-loading.gif"],
              },
            },
            quantity,
          },
        ],

        // invoice_creation: {
        //   enabled: true,
        //   invoice_data: {
        //     description: 'Invoice for Product X',
        //     metadata: {order: 'order-xyz'},
        //     account_tax_ids: ['DE123456789'],
        //     custom_fields: [{name: 'Purchase Order', value: 'PO-XYZ'}],
        //     rendering_options: {amount_tax_display: 'include_inclusive_tax'},
        //     footer: 'B2B Inc.',
        //   },
        // },
        mode: "payment",
        payment_method_types:["card"],
        success_url: `${req.headers.origin}/?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
      });
      console.log("first",session)
     res.status(200).json(session)
    } catch (err) {
      console.log("first")
      console.log(err)
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    console.log("F")
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
