import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import React from "react";
import { useState } from "react";
import { apiResponse } from "../../../Interfaces";
import { useConfirmOrderMutation } from "../../../Apis/orderApi";
import { useNavigate } from "react-router-dom";
import { SD_OrderStatus } from "Utility/SD";

function PaymentForm({ data, userInput }: any) {
  const navigate = useNavigate();
  const stripe = useStripe();
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmOrder] = useConfirmOrderMutation();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    setIsProcessing(true);
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "https://example.com/order/123/complete",
      },
      redirect: "if_required",
    });

    if (result.error) {
      toastNotify("An unexpected error occured", "error");
      console.log(result.error.message);
    } else {
      console.log("Kết quả" + data?.result?.stripePaymentIntentId);

      const orderData: any = {
        stripePaymentIntentId: data?.result?.stripePaymentIntentId,
        status: result.paymentIntent.status === "succeeded" ? SD_OrderStatus.SUCCESSFUL : SD_OrderStatus.FAIL,
      }
      console.log(orderData);

      //Confirm order
      const response: apiResponse = await confirmOrder({
        orderHeaderId: data?.result?.orderHeaderId,
        orderData: orderData
      });

      if (response) {
        if (response.data?.isSuccess) {
          navigate(
            `/order-success`
          );
        } else {
          navigate("/failed");
        }
      }
    }
    setIsProcessing(false);
  };

  return (
    <form onClick={handleSubmit}>
      <PaymentElement />
      <button
        disabled={!stripe || isProcessing}
        className="btn btn-success mt-5"
      >
        <span id="button-text">
          {isProcessing ? "Processing ..." : "Submit Order"}
        </span>
      </button>
    </form>
  );
}

export default PaymentForm;
function toastNotify(arg0: string, arg1: string) {
  throw new Error("Function not implemented.");
}
