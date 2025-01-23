import React, { useEffect, useState } from "react";
import axios from "axios";

const CheckoutPage: React.FC = () => {
  const [orderToken, setOrderToken] = useState<string | null>(null);

  useEffect(() => {
    const isSandbox = window.location.hostname.includes("sandbox");

    const createOrder = async () => {
      try {
        const response = await axios.post("/api/create-order", {
          amount: 500,
          currency: "EUR",
          sandbox: isSandbox,
        });
        setOrderToken(response.data.token);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };

    createOrder();
  }, []);

  useEffect(() => {
    if (orderToken) {
      (async () => {
        const { createCardField } = await (window as any).RevolutCheckout(orderToken);

        createCardField({
          target: document.getElementById("card-field"),
          onSuccess: () => alert("Paiement réussi !"),
          onError: (error: any) => alert(`Erreur: ${error.message}`),
        });
      })();
    }
  }, [orderToken]);

  return (
    <div>
      <h1>Paiement</h1>
      <div id="card-field"></div>
      <button
        onClick={() => {
          const instance = (window as any).RevolutCheckout.getInstance();
          instance.submit({ email: "client@test.com" });
        }}
      >
        Payer
      </button>
    </div>
  );
};

export default CheckoutPage;
