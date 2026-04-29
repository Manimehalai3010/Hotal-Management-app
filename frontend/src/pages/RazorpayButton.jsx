import { useState } from "react";
import toast from "react-hot-toast";

export default function RazorpayButton({ name, email }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        "https://hotel-management-with-responsive.onrender.com/api/payment/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: 5000 }),
        }
      );

      const order = await res.json();

      if (!res.ok || !order?.id) {
        throw new Error("Order creation failed");
      }

      const options = {
        key: "rzp_test_xxxxxxxx", // 🔴 replace this
        amount: order.amount,
        currency: "INR",
        name: "Majun Hotel",
        description: "Luxury Room Booking",
        order_id: order.id,

        handler: function () {
          toast.success("🎉 Payment Successful!");
        },

        modal: {
          ondismiss: function () {
            toast.error("Payment Cancelled");
          },
        },

        prefill: {
          name,
          email,
        },

        theme: {
          color: "#c9a96e",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("❌ Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-4 mt-4">
      
      {/* PAYMENT BUTTON */}
      <button
        type="button"
        onClick={handlePayment}
        disabled={loading}
        className={`w-full sm:w-auto px-8 py-4 rounded-md text-sm tracking-[0.2em] uppercase font-medium transition-all duration-300 flex items-center justify-center gap-3
          
          ${
            loading
              ? "bg-stone-700 cursor-not-allowed"
              : "bg-[#c9a96e] text-black hover:bg-amber-400 shadow-lg shadow-amber-500/20"
          }
        `}
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
        )}
        {loading ? "Processing..." : "Pay Securely"}
      </button>

      {/* TRUST TEXT */}
      <p className="text-xs text-stone-500 tracking-widest">
        Secured by Razorpay • 100% Safe Payment
      </p>
    </div>
  );
}