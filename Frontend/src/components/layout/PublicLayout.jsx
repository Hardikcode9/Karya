import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BottomNav from "./BottomNav";
import FloatingAppDock from "./FloatingAppDock";
import FloatingEmergencyButton from "./FloatingEmergencyButton";
import CompanionAssistantModal from "../modals/CompanionAssistantModal";
import BookingModal from "../modals/BookingModal";
import EmergencyModal from "../modals/EmergencyModal";
import ReviewModal from "../modals/ReviewModal";
import CartDrawer from "../cart/CartDrawer";
import OfflineIndicator from "./OfflineIndicator";
import PageTransition from "./PageTransition";
import ScrollToTopButton from "./ScrollToTopButton";
import { useAuth } from "../../hooks/useAuth";

export default function PublicLayout() {
  const { user } = useAuth();
  const [companionOpen, setCompanionOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [bookingTarget, setBookingTarget] = useState(null);
  const [reviewTarget, setReviewTarget] = useState(null);

  return (
    <div className="min-h-screen flex flex-col pb-16 lg:pb-0 bg-cream dark:bg-dark-bg text-charcoal dark:text-dark-text transition-colors">
      <Navbar onOpenEmergency={() => setEmergencyOpen(true)} />
      
      <PageTransition>
        <div className="flex-1">
          <Outlet
            context={{
              openBooking: (item) => setBookingTarget(item),
              openReview: (item) => setReviewTarget(item),
              openEmergency: () => setEmergencyOpen(true),
              openCompanion: () => setCompanionOpen(true),
            }}
          />
        </div>
      </PageTransition>
      
      <Footer />
      
      {/* Right Down Side Floating Actions (SOS & Companion AI) */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-2.5 pointer-events-none">
        {user && (
          <FloatingAppDock
            standalone={false}
            onOpenCompanion={() => setCompanionOpen(true)}
          />
        )}
        <FloatingEmergencyButton
          onOpenEmergency={() => setEmergencyOpen(true)}
        />
      </div>

      {/* Floating Scroll Up Button with Black Border */}
      <ScrollToTopButton />
      
      {/* Interactive App Modals */}
      <CompanionAssistantModal
        isOpen={companionOpen}
        onClose={() => setCompanionOpen(false)}
        onOpenBooking={(worker) => setBookingTarget(worker)}
      />
      
      <BookingModal
        isOpen={Boolean(bookingTarget)}
        onClose={() => setBookingTarget(null)}
        targetItem={bookingTarget}
      />

      <EmergencyModal
        isOpen={emergencyOpen}
        onClose={() => setEmergencyOpen(false)}
      />

      <ReviewModal
        isOpen={Boolean(reviewTarget)}
        onClose={() => setReviewTarget(null)}
        targetItem={reviewTarget}
      />

      {/* Cart & Checkout Slideout */}
      <CartDrawer />

      <OfflineIndicator />
    </div>
  );
}
