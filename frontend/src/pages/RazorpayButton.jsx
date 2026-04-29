import toast from "react-hot-toast";

export default function RazorpayButton({ name, email }) {

  const handlePayment = async () => {
    try {
      const res = await fetch("https://hotel-management-with-responsive.onrender.com/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: 5000 }),
      });

      const order = await res.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY, // ✅ use env
        amount: order.amount,
        currency: "INR",
        name: "Majun Hotel",
        description: "Room Booking",
        order_id: order.id,
        handler: function () {
          toast.success("Payment Successful 🎉");
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
      toast.error("Payment failed");
    }
  };

  return (
    <button
      type="button"
      onClick={handlePayment}
      className="jost text-xs tracking-[0.2em] uppercase border border-[#c9a96e] text-[#c9a96e] px-6 py-3 hover:bg-white hover:text-black transition-all duration-300"
    >
      Pay Now
    </button>
  );
}