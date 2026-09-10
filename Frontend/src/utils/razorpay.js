import api from "./api";

/**
 * Loads the external Razorpay Checkout SDK script dynamically
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Launches Razorpay Payment Modal for a booking transaction
 * @param {Object} params
 * @param {string} params.bookingId - ID of the booking to pay for
 * @param {string} params.paymentMethod - 'upi' | 'card' | 'cash'
 * @param {Object} params.user - Logged in customer profile
 * @param {Function} params.onSuccess - Success callback
 * @param {Function} params.onError - Error callback
 */
export const processRazorpayPayment = async ({
  bookingId,
  paymentMethod = "upi",
  user,
  onSuccess,
  onError,
}) => {
  try {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      if (onError) onError("Failed to load Razorpay Payment Gateway. Check internet connection.");
      return;
    }

    // Step 1: Create Payment Order on Backend
    const orderResponse = await api.post("/payments/create-order", {
      bookingId,
      paymentMethod,
    });

    const { orderId, amount, currency, keyId, paymentId } = orderResponse.data;

    // Step 2: Configure Razorpay Options
    const options = {
      key: keyId || "rzp_test_KaryaDevKey2026",
      amount: amount,
      currency: currency || "INR",
      name: "KARYA Fair Trade Platform",
      description: "Direct Village Worker & Service Settlement",
      order_id: orderId,
      prefill: {
        name: user?.name || "Customer",
        email: user?.email || "customer@karya.org",
        contact: user?.phone || "9876543210",
      },
      theme: {
        color: "#3f5231", // Karya Olive brand color
      },
      handler: async function (response) {
        try {
          // Step 3: Verify Payment Signature on Backend
          const verifyResponse = await api.post("/payments/verify", {
            paymentId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (onSuccess) onSuccess(verifyResponse.data);
        } catch (verifyError) {
          console.error("Razorpay verification error:", verifyError);
          if (onError)
            onError(
              verifyError.response?.data?.message || "Payment verification failed"
            );
        }
      },
      modal: {
        ondismiss: function () {
          if (onError) onError("Payment modal closed by user.");
        },
      },
    };

    // Step 4: Open Razorpay Gateway Popup
    const razorpayWindow = new window.Razorpay(options);
    razorpayWindow.open();
  } catch (error) {
    console.error("Razorpay Payment Gateway Error:", error);
    if (onError) {
      onError(
        error.response?.data?.message || "Failed to initiate Payment Gateway order."
      );
    }
  }
};
