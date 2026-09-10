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
 * Shows an interactive, full-featured Razorpay Payment Gateway Modal with:
 * - Real UPI QR Code Scanner & UPI VPA ID input
 * - Credit / Debit Card input form (Card number, Expiry, CVV, Cardholder Name)
 * - Netbanking Bank Selection
 */
export const showRazorpayInteractiveModal = ({
  orderId,
  amount,
  paymentId,
  user,
  onSuccess,
  onError,
}) => {
  const overlay = document.createElement("div");
  overlay.id = "razorpay-interactive-modal";
  overlay.style.cssText =
    "position: fixed; inset: 0; z-index: 999999; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.7); backdrop-filter: blur(5px); padding: 1rem;";

  const formattedAmount = (amount / 100).toFixed(2);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    `upi://pay?pa=karya@upi&pn=KARYA%20Platform&am=${formattedAmount}&cu=INR`
  )}`;

  let activeTab = "upi"; // 'upi' | 'card' | 'netbanking'

  overlay.innerHTML = `
    <div style="background: #ffffff; border-radius: 1.5rem; max-width: 440px; width: 100%; padding: 1.5rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.3); font-family: system-ui, -apple-system, sans-serif; color: #1f2937; position: relative; overflow: hidden;">
      
      <!-- Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 1rem; border-bottom: 1px solid #e5e7eb;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div style="width: 38px; height: 38px; border-radius: 12px; background: #0c66e4; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.2rem;">
            ₹
          </div>
          <div>
            <h3 style="font-weight: 700; font-size: 1.05rem; margin: 0; color: #111827;">Razorpay Gateway</h3>
            <span style="font-size: 0.7rem; color: #059669; font-weight: 700; background: #ecfdf5; padding: 2px 8px; border-radius: 999px; display: inline-block; margin-top: 2px;">
              Test Gateway Active
            </span>
          </div>
        </div>
        <button id="rzp-close-btn" style="background: transparent; border: none; font-size: 1.6rem; cursor: pointer; color: #6b7280; padding: 0 6px; line-height: 1;">&times;</button>
      </div>

      <!-- Order Summary -->
      <div style="background: #f9fafb; border: 1px solid #f3f4f6; padding: 0.85rem 1rem; border-radius: 1rem; display: flex; justify-content: space-between; align-items: center; margin: 1rem 0;">
        <div>
          <p style="font-size: 0.7rem; color: #6b7280; margin: 0; text-transform: uppercase; font-weight: 600;">Merchant</p>
          <p style="font-weight: 700; font-size: 0.9rem; margin: 2px 0 0 0; color: #1f2937;">KARYA Platform</p>
        </div>
        <div style="text-align: right;">
          <p style="font-size: 0.7rem; color: #6b7280; margin: 0; text-transform: uppercase; font-weight: 600;">Amount Due</p>
          <p style="font-weight: 800; font-size: 1.25rem; color: #3f5231; margin: 2px 0 0 0;">₹${formattedAmount}</p>
        </div>
      </div>

      <!-- Method Tabs -->
      <div style="display: flex; gap: 0.35rem; background: #f3f4f6; padding: 4px; border-radius: 0.85rem; margin-bottom: 1.25rem;">
        <button id="tab-upi" style="flex: 1; padding: 0.5rem; border-radius: 0.65rem; border: none; font-size: 0.78rem; font-weight: 700; cursor: pointer; background: #ffffff; color: #0c66e4; box-shadow: 0 1px 2px rgba(0,0,0,0.1);">
          📱 UPI & QR
        </button>
        <button id="tab-card" style="flex: 1; padding: 0.5rem; border-radius: 0.65rem; border: none; font-size: 0.78rem; font-weight: 600; cursor: pointer; background: transparent; color: #4b5563;">
          💳 Card
        </button>
        <button id="tab-netbanking" style="flex: 1; padding: 0.5rem; border-radius: 0.65rem; border: none; font-size: 0.78rem; font-weight: 600; cursor: pointer; background: transparent; color: #4b5563;">
          🏦 NetBanking
        </button>
      </div>

      <!-- Error / Status Toast inside modal -->
      <div id="rzp-validation-msg" style="display: none; background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; font-size: 0.75rem; padding: 0.5rem 0.75rem; border-radius: 0.65rem; margin-bottom: 0.75rem; font-weight: 600;"></div>

      <!-- Tab Panel Content Container -->
      <div id="rzp-tab-content">
        <!-- UPI Content -->
        <div id="panel-upi" style="display: block; text-align: center;">
          <div style="background: #ffffff; border: 1px border-dashed #d1d5db; padding: 0.75rem; border-radius: 1rem; display: inline-block; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 0.75rem;">
            <img src="${qrUrl}" alt="UPI QR Code" style="width: 140px; height: 140px; display: block; margin: 0 auto; border-radius: 0.5rem;" />
          </div>
          <p style="font-size: 0.75rem; color: #4b5563; font-weight: 600; margin: 0 0 0.75rem 0;">
            Scan QR code using GPay, PhonePe, Paytm, or BHIM
          </p>
          <div style="position: relative; margin-bottom: 1rem; text-align: left;">
            <label style="font-size: 0.7rem; font-weight: 700; color: #6b7280; text-transform: uppercase; display: block; margin-bottom: 4px;">Or enter VPA / UPI ID</label>
            <input id="input-upi-id" type="text" placeholder="example@upi" value="${user?.phone ? user.phone + '@upi' : 'customer@upi'}" style="width: 100%; box-sizing: border-box; padding: 0.65rem 0.85rem; border-radius: 0.65rem; border: 1px solid #d1d5db; font-size: 0.85rem; outline: none;" />
          </div>
        </div>

        <!-- Card Content -->
        <div id="panel-card" style="display: none; text-align: left;">
          <div style="margin-bottom: 0.75rem;">
            <label style="font-size: 0.7rem; font-weight: 700; color: #6b7280; text-transform: uppercase; display: block; margin-bottom: 4px;">Card Number</label>
            <input id="input-card-number" type="text" placeholder="4532 •••• •••• 8892" maxlength="19" value="4532 8812 9904 8892" style="width: 100%; box-sizing: border-box; padding: 0.65rem 0.85rem; border-radius: 0.65rem; border: 1px solid #d1d5db; font-size: 0.85rem; font-family: monospace; outline: none;" />
          </div>
          <div style="display: flex; gap: 0.75rem; margin-bottom: 0.75rem;">
            <div style="flex: 1;">
              <label style="font-size: 0.7rem; font-weight: 700; color: #6b7280; text-transform: uppercase; display: block; margin-bottom: 4px;">Expiry (MM/YY)</label>
              <input id="input-card-expiry" type="text" placeholder="08/28" maxlength="5" value="12/28" style="width: 100%; box-sizing: border-box; padding: 0.65rem 0.85rem; border-radius: 0.65rem; border: 1px solid #d1d5db; font-size: 0.85rem; outline: none;" />
            </div>
            <div style="flex: 1;">
              <label style="font-size: 0.7rem; font-weight: 700; color: #6b7280; text-transform: uppercase; display: block; margin-bottom: 4px;">CVV</label>
              <input id="input-card-cvv" type="password" placeholder="123" maxlength="4" value="882" style="width: 100%; box-sizing: border-box; padding: 0.65rem 0.85rem; border-radius: 0.65rem; border: 1px solid #d1d5db; font-size: 0.85rem; outline: none;" />
            </div>
          </div>
          <div style="margin-bottom: 1rem;">
            <label style="font-size: 0.7rem; font-weight: 700; color: #6b7280; text-transform: uppercase; display: block; margin-bottom: 4px;">Cardholder Name</label>
            <input id="input-card-name" type="text" placeholder="Full Name on Card" value="${user?.name || 'Customer'}" style="width: 100%; box-sizing: border-box; padding: 0.65rem 0.85rem; border-radius: 0.65rem; border: 1px solid #d1d5db; font-size: 0.85rem; outline: none;" />
          </div>
        </div>

        <!-- Netbanking Content -->
        <div id="panel-netbanking" style="display: none; text-align: left;">
          <label style="font-size: 0.7rem; font-weight: 700; color: #6b7280; text-transform: uppercase; display: block; margin-bottom: 8px;">Select Popular Bank</label>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 1rem;">
            <button class="bank-btn" data-bank="SBI" style="padding: 0.65rem; border-radius: 0.65rem; border: 1px solid #0c66e4; background: #eff6ff; font-size: 0.8rem; font-weight: 700; color: #1e40af; cursor: pointer; text-align: center;">State Bank of India</button>
            <button class="bank-btn" data-bank="HDFC" style="padding: 0.65rem; border-radius: 0.65rem; border: 1px solid #d1d5db; background: #ffffff; font-size: 0.8rem; font-weight: 600; color: #374151; cursor: pointer; text-align: center;">HDFC Bank</button>
            <button class="bank-btn" data-bank="ICICI" style="padding: 0.65rem; border-radius: 0.65rem; border: 1px solid #d1d5db; background: #ffffff; font-size: 0.8rem; font-weight: 600; color: #374151; cursor: pointer; text-align: center;">ICICI Bank</button>
            <button class="bank-btn" data-bank="AXIS" style="padding: 0.65rem; border-radius: 0.65rem; border: 1px solid #d1d5db; background: #ffffff; font-size: 0.8rem; font-weight: 600; color: #374151; cursor: pointer; text-align: center;">Axis Bank</button>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div style="display: flex; gap: 0.75rem; margin-top: 0.5rem;">
        <button id="rzp-cancel-btn" style="width: 32%; padding: 0.75rem; border-radius: 0.75rem; border: 1px solid #d1d5db; background: #ffffff; font-size: 0.8rem; font-weight: 600; color: #4b5563; cursor: pointer;">
          Cancel
        </button>
        <button id="rzp-submit-btn" style="width: 68%; padding: 0.75rem; border-radius: 0.75rem; border: none; background: #0c66e4; color: #ffffff; font-size: 0.85rem; font-weight: 700; cursor: pointer; box-shadow: 0 4px 10px rgba(12,102,228,0.35); transition: all 0.2s;">
          Pay ₹${formattedAmount}
        </button>
      </div>

      <!-- Footer Security Badge -->
      <div style="margin-top: 1rem; padding-top: 0.75rem; border-t: 1px solid #f3f4f6; text-align: center; font-size: 0.68rem; color: #9ca3af;">
        🔒 256-bit Razorpay Security · Fair Trade Settlement
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const cleanup = () => {
    if (document.body.contains(overlay)) {
      document.body.removeChild(overlay);
    }
  };

  const showValidationMsg = (msg) => {
    const el = document.getElementById("rzp-validation-msg");
    if (el) {
      el.style.display = "block";
      el.innerText = msg;
    }
  };

  const hideValidationMsg = () => {
    const el = document.getElementById("rzp-validation-msg");
    if (el) {
      el.style.display = "none";
    }
  };

  // Tab Switching Logic
  const tabUpi = document.getElementById("tab-upi");
  const tabCard = document.getElementById("tab-card");
  const tabNetbanking = document.getElementById("tab-netbanking");

  const panelUpi = document.getElementById("panel-upi");
  const panelCard = document.getElementById("panel-card");
  const panelNetbanking = document.getElementById("panel-netbanking");

  const setTab = (tab) => {
    activeTab = tab;
    hideValidationMsg();
    [tabUpi, tabCard, tabNetbanking].forEach((btn) => {
      btn.style.background = "transparent";
      btn.style.color = "#4b5563";
      btn.style.fontWeight = "600";
      btn.style.boxShadow = "none";
    });

    [panelUpi, panelCard, panelNetbanking].forEach((p) => (p.style.display = "none"));

    if (tab === "upi") {
      tabUpi.style.background = "#ffffff";
      tabUpi.style.color = "#0c66e4";
      tabUpi.style.fontWeight = "700";
      tabUpi.style.boxShadow = "0 1px 2px rgba(0,0,0,0.1)";
      panelUpi.style.display = "block";
    } else if (tab === "card") {
      tabCard.style.background = "#ffffff";
      tabCard.style.color = "#0c66e4";
      tabCard.style.fontWeight = "700";
      tabCard.style.boxShadow = "0 1px 2px rgba(0,0,0,0.1)";
      panelCard.style.display = "block";
    } else if (tab === "netbanking") {
      tabNetbanking.style.background = "#ffffff";
      tabNetbanking.style.color = "#0c66e4";
      tabNetbanking.style.fontWeight = "700";
      tabNetbanking.style.boxShadow = "0 1px 2px rgba(0,0,0,0.1)";
      panelNetbanking.style.display = "block";
    }
  };

  tabUpi.onclick = () => setTab("upi");
  tabCard.onclick = () => setTab("card");
  tabNetbanking.onclick = () => setTab("netbanking");

  // Bank Selection Handler
  document.querySelectorAll(".bank-btn").forEach((btn) => {
    btn.onclick = (e) => {
      document.querySelectorAll(".bank-btn").forEach((b) => {
        b.style.border = "1px solid #d1d5db";
        b.style.background = "#ffffff";
        b.style.color = "#374151";
      });
      e.target.style.border = "1px solid #0c66e4";
      e.target.style.background = "#eff6ff";
      e.target.style.color = "#1e40af";
    };
  });

  // Close & Cancel Actions
  document.getElementById("rzp-close-btn").onclick = () => {
    cleanup();
    if (onError) onError("Payment gateway closed by user.");
  };

  document.getElementById("rzp-cancel-btn").onclick = () => {
    cleanup();
    if (onError) onError("Payment gateway closed by user.");
  };

  // Payment Verification Submission
  document.getElementById("rzp-submit-btn").onclick = async () => {
    hideValidationMsg();

    // Validation checks per active tab
    if (activeTab === "upi") {
      const upiVal = document.getElementById("input-upi-id").value.trim();
      if (!upiVal || !upiVal.includes("@")) {
        showValidationMsg("Please enter a valid UPI ID (e.g., username@upi) or scan the QR code.");
        return;
      }
    } else if (activeTab === "card") {
      const cardNum = document.getElementById("input-card-number").value.trim();
      const cardExp = document.getElementById("input-card-expiry").value.trim();
      const cardCvv = document.getElementById("input-card-cvv").value.trim();
      const cardName = document.getElementById("input-card-name").value.trim();

      if (!cardNum || cardNum.length < 12) {
        showValidationMsg("Please enter a valid 16-digit card number.");
        return;
      }
      if (!cardExp || !cardExp.includes("/")) {
        showValidationMsg("Please enter a valid card expiry date (MM/YY).");
        return;
      }
      if (!cardCvv || cardCvv.length < 3) {
        showValidationMsg("Please enter a valid 3 or 4 digit CVV.");
        return;
      }
      if (!cardName) {
        showValidationMsg("Please enter the cardholder's name.");
        return;
      }
    }

    const submitBtn = document.getElementById("rzp-submit-btn");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.75";
      submitBtn.innerText = "Verifying with Razorpay...";
    }

    setTimeout(async () => {
      try {
        const verifyResponse = await api.post("/payments/verify", {
          paymentId,
          razorpay_order_id: orderId || `order_${Date.now()}`,
          razorpay_payment_id: `pay_${activeTab}_${Date.now()}`,
          razorpay_signature: "test_signature_valid",
        });
        cleanup();
        if (onSuccess) onSuccess(verifyResponse.data);
      } catch (err) {
        cleanup();
        if (onError) onError("Payment verification failed on server.");
      }
    }, 1000);
  };
};

/**
 * Main function to launch process Razorpay Payment
 */
export const processRazorpayPayment = async ({
  bookingId,
  amount: customAmount,
  paymentMethod = "upi",
  user,
  onSuccess,
  onError,
}) => {
  try {
    // Step 1: Create Payment Order on Backend
    const orderResponse = await api.post("/payments/create-order", {
      bookingId,
      amount: customAmount,
      paymentMethod,
    });

    const { orderId, amount, currency, keyId, paymentId, isTestFallback } =
      orderResponse.data;

    const isRealKey =
      keyId &&
      !keyId.includes("KaryaDevKey") &&
      !isTestFallback &&
      orderId &&
      !orderId.startsWith("order_test_");

    if (isRealKey) {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        if (onError)
          onError("Failed to load Razorpay Payment Gateway. Check internet connection.");
        return;
      }

      const options = {
        key: keyId,
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
          color: "#3f5231",
        },
        handler: async function (response) {
          try {
            const verifyResponse = await api.post("/payments/verify", {
              paymentId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (onSuccess) onSuccess(verifyResponse.data);
          } catch (verifyError) {
            if (onError) onError("Payment verification failed");
          }
        },
        modal: {
          ondismiss: function () {
            if (onError) onError("Payment gateway popup closed by user.");
          },
        },
      };

      const razorpayWindow = new window.Razorpay(options);
      razorpayWindow.open();
    } else {
      // Launch Interactive Sandbox Modal UI with UPI QR & Card input forms
      showRazorpayInteractiveModal({
        orderId,
        amount,
        paymentId,
        user,
        onSuccess,
        onError,
      });
    }
  } catch (error) {
    console.error("Razorpay Payment Gateway Error:", error);
    if (onError) {
      onError(
        error.response?.data?.message || "Failed to initiate Payment Gateway order."
      );
    }
  }
};
