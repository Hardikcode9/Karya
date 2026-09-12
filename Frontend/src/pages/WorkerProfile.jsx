import { useState, useEffect } from "react";
import { Link, useParams, useOutletContext } from "react-router-dom";
import { ArrowLeft, MapPin, ShieldCheck, Clock, Share2, Phone } from "lucide-react";
import Rating from "../components/ui/Rating";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import ImageTile from "../components/ui/ImageTile";
import RatingAndReviewsSection from "../components/reviews/RatingAndReviewsSection";
import api from "../utils/api";

export default function WorkerProfile() {
  const { workerId } = useParams();
  const outletContext = useOutletContext();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWorker = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get(`/workers/${workerId}`);
        if (response.data && response.data.worker) {
          const w = response.data.worker;
          setWorker({
            id: w._id,
            serviceId: w.service?._id || null,
            name: w.user?.name || "Specialist Worker",
            role: w.service?.name || "Technician",
            village: w.village || "Local District",
            distanceKm: w.distanceInKm ?? 3.5,
            rating: w.rating || 4.5,
            skills: w.skills && w.skills.length > 0 ? w.skills : [w.service?.name || "Maintenance"],
            price: w.pricePerService || 400,
            priceUnit: "visit",
            matchPercent: 95,
            verified: { skill: true, phone: true, shg: false },
            completedJobs: w.totalReviews || 24,
            experienceYears: w.experience || 4,
            bio: w.bio || "Certified technician specializing in fast residential visits and quality repair work.",
            phone: w.user?.phone || "",
            shgId: null
          });
        } else {
          setError("Worker profile not found.");
        }
      } catch (err) {
        setError("Failed to load worker profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorker();
  }, [workerId]);

  if (loading) {
    return (
      <div className="pt-40 container-kare text-center py-20">
        <div className="inline-block w-8 h-8 border-3 border-olive-700 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm text-charcoal/60 dark:text-dark-muted">Loading worker profile...</p>
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="pt-40 container-kare text-center">
        <p className="text-charcoal/60 dark:text-dark-muted">We couldn't find that worker.</p>
        <Button as={Link} to="/workers" className="mt-4" variant="outline">Back to workers</Button>
      </div>
    );
  }

  const shg = null; // Removed mock data dependency
  const badges = [
    worker.verified?.phone && "Phone verified",
    worker.verified?.skill && "Skill verified",
    worker.verified?.shg && "SHG verified",
  ].filter(Boolean);

  const handleBookingClick = () => {
    if (outletContext?.openBooking) {
      outletContext.openBooking(worker);
    }
  };

  return (
    <div className="pt-32 sm:pt-40 pb-20">
      <div className="container-kare">
        <Link to="/workers" className="inline-flex items-center gap-1.5 text-sm text-charcoal/50 dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text mb-6">
          <ArrowLeft size={15} /> Back to workers
        </Link>

        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10">
          <div className="rounded-[2rem] overflow-hidden aspect-square">
            <ImageTile keywords={`${worker.role} india portrait`} alt={worker.name} seed="700x700" className="w-full h-full" />
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl text-charcoal dark:text-dark-text">{worker.name}</h1>
              <p className="text-charcoal/60 dark:text-dark-muted mt-1">{worker.role} · {worker.village}</p>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-charcoal/60 dark:text-dark-muted">
              <Rating value={worker.rating} />
              <span>{worker.completedJobs} jobs completed</span>
              <span>{worker.experienceYears} years experience</span>
              <span className="flex items-center gap-1"><MapPin size={14} />{worker.distanceKm} km away</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {badges.map((b) => (
                <Badge key={b} tone="olive"><ShieldCheck size={13} />{b}</Badge>
              ))}
            </div>

            <p className="text-charcoal/70 dark:text-dark-muted leading-relaxed">{worker.bio}</p>

            <div>
              <p className="text-sm text-charcoal/50 dark:text-dark-muted mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {worker.skills.map((s) => (
                  <span key={s} className="text-sm bg-cream-card dark:bg-dark-card border border-charcoal/10 dark:border-dark-border rounded-full px-3.5 py-1.5 text-charcoal dark:text-dark-text">{s}</span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-charcoal/60 dark:text-dark-muted">
              <Clock size={15} /> {worker.availability || "Mon-Sat: 09:00 - 18:00"}
            </div>

            <div className="flex items-center justify-between bg-cream-card dark:bg-dark-card rounded-2xl px-5 py-4 border border-charcoal/5 dark:border-dark-border">
              <span className="font-display text-2xl text-charcoal dark:text-dark-text">₹{worker.price}<span className="text-sm text-charcoal/50 dark:text-dark-muted">/{worker.priceUnit}</span></span>
              {shg && (
                <Link to={`/shgs/${shg.id}`} className="text-sm text-olive-700 dark:text-olive-400 hover:underline">
                  Part of {shg.name}
                </Link>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button icon onClick={handleBookingClick}>Request service</Button>
              <Button variant="outline" onClick={handleBookingClick}><Phone size={16} />Direct Book</Button>
              <Button variant="ghost" onClick={() => navigator.clipboard?.writeText(window.location.href)}>
                <Share2 size={16} />Share profile
              </Button>
            </div>
          </div>
        </div>

        {/* Rating & Reviews Section with Rate and Query/Suggestion Actions */}
        <RatingAndReviewsSection
          targetType="worker"
          targetId={worker.id}
          targetName={worker.name}
          targetCategory={worker.role}
          initialRating={worker.rating}
          initialReviewsCount={worker.completedJobs}
        />
      </div>
    </div>
  );
}

