// RazorpayButton.jsx
import { useState } from "react";
import toast from "react-hot-toast";

const ROOM_PRICES = {
  "The Obsidian Suite": 480,
  "Garden Terrace Room": 290,
  "The Ivory Penthouse": 1200,
};

export default function RazorpayButton({ name, email, room, checkIn, checkOut }) {
  const [loading, setLoading] = useState(false);

  // Calculate nights & total in INR
  const nights =
    checkIn && checkOut
      ? Math.max(
          1,
          Math.round(
            (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
          )
        )
      : 1;
  const priceUSD = ROOM_PRICES[room] ?? 480;
  const amountINR = priceUSD * 84 * nights; // approx USD→INR
  const amountPaise = amountINR * 100; // Razorpay uses paise

  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates first.");
      return;
    }

    setLoading(true);

    const sdkLoaded = await loadRazorpay();
    if (!sdkLoaded) {
      toast.error("Failed to load payment gateway. Check your connection.");
      setLoading(false);
      return;
    }

    try {
      // 1. Create order on your backend
      const res = await fetch(
        "https://hotel-management-with-responsive.onrender.com/api/payment/create-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: amountPaise }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Order creation failed");
      }

      const order = await res.json();

      if (!order?.id) {
        toast.error("Server is waking up — please try again in 30 seconds.");
        setLoading(false);
        return;
      }

      // 2. Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, //  use env variable
        amount: order.amount,
        currency: order.currency || "INR",
        name: "Majun Hotel & Spa",
        description: `${room} · ${nights} night${nights > 1 ? "s" : ""}`,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&q=80",
        order_id: order.id,

        handler: async function (response) {
          // 3. Verify payment on backend (IMPORTANT for security)
          try {
            const verifyRes = await fetch(
              "https://hotel-management-with-responsive.onrender.com/api/payment/verify",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              }
            );
            if (verifyRes.ok) {
              toast.success("🎉 Payment confirmed! Check your email.");
            } else {
              toast.error("Payment received but verification failed. Contact support.");
            }
          } catch {
            toast.error("Verification error. Please contact support.");
          }
        },

        modal: {
          ondismiss: () => {
            toast("Payment cancelled.", { icon: "ℹ️" });
            setLoading(false);
          },
        },

        prefill: { name, email },

        notes: { room, checkIn, checkOut },

        theme: { color: "#c9a96e" },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (response) => {
        toast.error(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-3 mt-2">
      <button
        type="button"
        onClick={handlePayment}
        disabled={loading}
        className={`w-full py-4 text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300 flex items-center justify-center gap-3
          ${loading
            ? "bg-stone-700 text-stone-400 cursor-not-allowed"
            : "bg-[#c9a96e] text-stone-950 hover:bg-amber-400"
          }`}
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          <>Pay ₹{amountINR.toLocaleString("en-IN")} Securely</>
        )}
      </button>
      <p className="text-[11px] text-stone-500 tracking-widest text-center">
        Secured by Razorpay · UPI · Cards · Net Banking
      </p>
    </div>
  );
}