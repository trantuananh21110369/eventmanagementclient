import React from "react";
import { useLocation } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";

function PaymentPage() {
  const {
    state: { apiResult, userInput },
  } = useLocation();

  console.log(apiResult);
  console.log("Client secret" + apiResult.clientSecret);
  console.log(userInput);

  const stripePromise = loadStripe(
    "pk_test_51Q3ftJFzLMb5zV0uqUIIx7meUo4cRfGKLJrlRhI72lajrcZQyPiraxVGboCMewqMJ2tfpgAYBHP10laJcFv6Pqau00Lj85pDeb"
  );
  const options = {
    clientSecret: apiResult?.result?.clientSecret,
  };

  console.log(apiResult);

  return (
    <Elements stripe={stripePromise} options={options}>
      <div className="container m-5 p-5">
        <div className="row">
          <div className="col-md-7">
            <p> Name: </p>
            <p> Phone: </p>
            <p> Total price: </p>
          </div>
          <div className="col-md-5">
            <PaymentForm data={apiResult} userInput={userInput} />
          </div>
        </div>
      </div>
    </Elements>
  );
}

export default PaymentPage;
