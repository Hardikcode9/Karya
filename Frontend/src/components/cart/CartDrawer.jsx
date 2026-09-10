import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Trash2, ShoppingBag, Plus, Minus, ArrowRight,
  CheckCircle2, ShieldCheck, Tag, CreditCard
} from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { useOffline } from "../../hooks/useOffline";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { processRazorpayPayment } from "../../utils/razorpay";
import Button from "../ui/Button";

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    clearCart,
    totalAmount,
  } = useCart();
  const { queueAction, isOnline } = useOffline();
  const { user } = useAuth();
  const toast = useToast();

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [checkedOut, setCheckedOut] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("online"); // 'online' | 'cash'

  if (!isCartOpen) return null;

  const platformFee = items.length > 0 ? 30 : 0;
  const finalTotal = Math.max(0, totalAmount + platformFee - discount);

  const applyCoupon = (e) => {
    e.preventDefault();
    if (coupon.trim().toUpperCase() === "KARYA50" || coupon.trim().toUpperCase() === "GRAMIN") {
      setDiscount(50);
      toast.success("Rural discount applied: ₹50 OFF");
    } else {
      setDiscount(0);
      toast.error("Invalid coupon code");
    }
  };

  const handleCheckout = async () => {
    if (paymentMethod === "cash") {
      const orderPayload = {
        type: "CART_CHECKOUT",
        items,
        subtotal: totalAmount,
        discount,
        total: finalTotal,
        paymentMethod: "cash",
        createdAt: new Date().toISOString(),
      };
      await queueAction(orderPayload);
      setCheckedOut(true);
      toast.success("Order placed with Pay on Service Delivery");
      return;
    }

    // Process via Razorpay Payment Gateway
    setProcessingPayment(true);
    // Use first item's id or generate transaction order ID
    const sampleBookingId = items[0]?.bookingId || items[0]?.id;

    processRazorpayPayment({
      bookingId: sampleBookingId,
      paymentMethod: "upi",
      user,
      onSuccess: async (verifiedData) => {
        setProcessingPayment(false);
        const orderPayload = {
          type: "CART_CHECKOUT",
          items,
          subtotal: totalAmount,
          discount,
          total: finalTotal,
          paymentMethod: "online",
          transactionId: verifiedData.payment?.transactionId,
          createdAt: new Date().toISOString(),
        };
        await queueAction(orderPayload);
        setCheckedOut(true);
        toast.success("Payment successful! Gateway transaction verified.");
      },
      onError: (errMessage) => {
        setProcessingPayment(false);
        toast.error(errMessage || "Payment cancelled or failed");
      },
    });
  };

  const handleClose = () => {
    if (checkedOut) {
      clearCart();
      setCheckedOut(false);
    }
    setIsCartOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-charcoal/40 dark:bg-black/60 backdrop-blur-xs transition-opacity"
        />

        {/* Drawer panel */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 350, damping: 32 }}
          className="relative w-full max-w-md bg-cream dark:bg-dark-bg h-full shadow-2xl border-l border-charcoal/10 dark:border-dark-border flex flex-col z-10"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 bg-cream-card dark:bg-dark-surface border-b border-charcoal/10 dark:border-dark-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-2xl bg-olive-100 dark:bg-olive-900/50 text-olive-800 dark:text-olive-300 flex items-center justify-center">
                <ShoppingBag size={20} />
              </span>
              <div>
                <h2 className="font-display text-lg text-charcoal dark:text-dark-text">Service & SHG Cart</h2>
                <p className="text-xs text-charcoal/60 dark:text-dark-muted">
                  {items.length} {items.length === 1 ? "item" : "items"} selected
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-charcoal/60 dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text rounded-full hover:bg-charcoal/5 dark:hover:bg-white/5 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {checkedOut ? (
              <div className="py-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-olive-100 dark:bg-olive-900/50 text-olive-700 dark:text-olive-300 flex items-center justify-center mb-4 animate-bounce">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="font-display text-2xl text-charcoal dark:text-dark-text mb-2">
                  Order Scheduled!
                </h3>
                <p className="text-sm text-charcoal/70 dark:text-dark-muted max-w-xs mb-6">
                  Your bookings & SHG products are dispatched.
                  {!isOnline && " Saved locally and will sync once online."}
                </p>
                <Button onClick={handleClose} className="w-full">
                  Continue Browsing
                </Button>
              </div>
            ) : items.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-cream-card dark:bg-dark-card flex items-center justify-center text-charcoal/40 dark:text-dark-muted">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="font-display text-lg text-charcoal dark:text-dark-text">Your cart is empty</h3>
                <p className="text-xs text-charcoal/60 dark:text-dark-muted max-w-xs mx-auto">
                  Browse verified local trade services and SHG handcrafted products to add them here.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {items.map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      className="bg-cream-card dark:bg-dark-card rounded-2xl p-4 border border-charcoal/5 dark:border-dark-border flex items-center justify-between gap-3 shadow-xs"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-charcoal/5"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-semibold text-sm text-charcoal dark:text-dark-text truncate">
                            {item.name}
                          </h4>
                          <span className="text-[10px] bg-olive-100 dark:bg-olive-900/40 text-olive-800 dark:text-olive-300 px-1.5 py-0.5 rounded-full uppercase font-bold shrink-0">
                            {item.category || "Service"}
                          </span>
                        </div>
                        <p className="text-xs text-charcoal/55 dark:text-dark-muted mt-0.5">
                          ₹{item.price} {item.priceUnit ? `/ ${item.priceUnit}` : ""}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center bg-cream dark:bg-dark-bg rounded-xl border border-charcoal/10 dark:border-dark-border px-1.5 py-1">
                          <button
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                            className="p-1 text-charcoal/60 dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="text-xs font-semibold px-2 text-charcoal dark:text-dark-text">
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                            className="p-1 text-charcoal/60 dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Coupon input */}
                <form onSubmit={applyCoupon} className="pt-2 flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 dark:text-dark-muted" />
                    <input
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="Coupon: try KARYA50"
                      className="w-full bg-cream-card dark:bg-dark-card border border-charcoal/15 dark:border-dark-border rounded-xl pl-9 pr-3 py-2 text-xs uppercase outline-none focus:border-olive-600 dark:text-dark-text"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-ivory dark:bg-dark-surface border border-charcoal/15 dark:border-dark-border rounded-xl text-xs font-semibold text-charcoal dark:text-dark-text hover:bg-olive-100 dark:hover:bg-olive-900/40 transition-colors"
                  >
                    Apply
                  </button>
                </form>

                {discount > 0 && (
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                    ✓ Rural Community discount ₹{discount} applied!
                  </p>
                )}
              </>
            )}
          </div>

          {/* Footer & Checkout button */}
          {!checkedOut && items.length > 0 && (
            <div className="p-5 sm:p-6 bg-cream-card dark:bg-dark-surface border-t border-charcoal/10 dark:border-dark-border space-y-3">
              {/* Payment Method Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal/60 dark:text-dark-muted">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("online")}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      paymentMethod === "online"
                        ? "bg-olive-700 text-cream border-olive-700 shadow-xs"
                        : "bg-cream dark:bg-dark-bg text-charcoal/70 dark:text-dark-muted border-charcoal/15 dark:border-dark-border"
                    }`}
                  >
                    <CreditCard size={14} /> Razorpay Gateway
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cash")}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      paymentMethod === "cash"
                        ? "bg-olive-700 text-cream border-olive-700 shadow-xs"
                        : "bg-cream dark:bg-dark-bg text-charcoal/70 dark:text-dark-muted border-charcoal/15 dark:border-dark-border"
                    }`}
                  >
                    Pay on Delivery
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-charcoal/70 dark:text-dark-muted">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span>₹{platformFee}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="border-t border-charcoal/10 dark:border-dark-border pt-2 flex justify-between font-bold text-base text-charcoal dark:text-dark-text">
                  <span>Total Amount</span>
                  <span className="text-olive-800 dark:text-olive-300">₹{finalTotal}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                loading={processingPayment}
                className="w-full py-3"
              >
                {paymentMethod === "online"
                  ? `Pay ₹${finalTotal} via Gateway`
                  : `Confirm Order (₹${finalTotal})`} <ArrowRight size={16} />
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-charcoal/50 dark:text-dark-muted text-center pt-1">
                <ShieldCheck size={13} className="text-olive-700 dark:text-olive-400" />
                256-bit encrypted Razorpay SSL Gateway & Village Guarantee
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
