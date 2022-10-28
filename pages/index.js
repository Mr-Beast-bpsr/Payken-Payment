import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  "pk_test_51LxThRSIs5MqMViAdKdpIT57Qgx7wgxC34MBxRUofCRsIl6DYak8752zIBemujzjTPG5dmX5RSBTYe32DQjn7ot300ICSJGUXN"
);
// import { Stripe, loadStripe } from "@stripe/stripe-js";

export default function PreviewPage() {
  let amount = 1;
  React.useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      console.log("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      console.log(
        "Order canceled -- continue to shop around and checkout when you’re ready."
      );
    }
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    // setIsLoading(true);
    // let total = JSON.parse(localStorage.getItem("query"));

    try {
      const response = await axios.post("/api/checkout_sessions", {
        data: {amount:1,quantity:1,description:"Buy NFT with Payken"},
      });

      // let token =  localStorage.getItem('token')
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.data.id,
      });
      console.log(response.data.id, "id here for  you");
      if (error) {
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <form onSubmit={onSubmit} method="POST">
      <section>
        <button type="submit" role="link">
          Checkout
        </button>
      </section>
      <style jsx>
        {`
          section {
            background: #ffffff;
            display: flex;
            flex-direction: column;
            width: 400px;
            height: 112px;
            border-radius: 6px;
            justify-content: space-between;
          }
          button {
            height: 36px;
            background: #556cd6;
            border-radius: 4px;
            color: white;
            border: 0;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
          }
          button:hover {
            opacity: 0.8;
          }
        `}
      </style>
    </form>
  );
}
