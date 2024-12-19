import React from "react";
import { useLocation } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./Component/PaymentForm";
import { useSelector } from "react-redux";
import { RootState } from "Storage/Redux/store";
import { userModel } from "Interfaces";

function PaymentPage() {
  const user: userModel = useSelector((state: RootState) => state.userAuthStore);

  const {
    state: { apiResult, userInput },
  } = useLocation();

  const stripePromise = loadStripe(
    "pk_test_51Q3ftJFzLMb5zV0uqUIIx7meUo4cRfGKLJrlRhI72lajrcZQyPiraxVGboCMewqMJ2tfpgAYBHP10laJcFv6Pqau00Lj85pDeb"
  );
  const options = {
    clientSecret: apiResult?.result?.clientSecret,
  };

  console.log(apiResult?.result?.numberPhone + " " + apiResult);

  return (
    <Elements stripe={stripePromise} options={options}>
      <div className="max-w-4xl mx-auto p-6 bg-gray-200 shadow-md rounded-lg m-3">
        <div className="bg-second text-white py-4 px-6 rounded-t-lg text-center">
          <h2 className="text-2xl font-semibold">Payment Page</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
            <p className="mb-2">
              <strong>Name:</strong> {user?.fullName || "Not provided"}
            </p>
            <p>
              <strong>Phone:</strong> {apiResult?.result?.numberPhone || "Not provided"}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Payment Form</h3>
            <div className="p-4 bg-white rounded shadow">
              <PaymentForm data={apiResult} />
            </div>
          </div>
        </div>
        <div className="bg-gray-200 text-center py-2 rounded-b-lg">
          <p className="text-sm text-gray-600">Secure Payment via Stripe</p>
        </div>
      </div>
    </Elements>
  );
}

export default PaymentPage;
