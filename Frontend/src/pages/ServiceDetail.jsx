import { useState, useEffect } from "react";
import { Link, useParams, useOutletContext } from "react-router-dom";
import { ArrowLeft, MapPin, AlertCircle } from "lucide-react";
import Icon from "../components/ui/Icon";
import Rating from "../components/ui/Rating";
import Button from "../components/ui/Button";
import ImageTile from "../components/ui/ImageTile";
import RatingAndReviewsSection from "../components/reviews/RatingAndReviewsSection";
import api from "../utils/api";
import { getServiceImage } from "../utils/serviceImages";

export default function ServiceDetail() {
  const { serviceId } = useParams();
  const outletContext = useOutletContext();
  const [service, setService] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServiceAndWorkers = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch the service
        const response = await api.get(`/services/${serviceId}`);
        let fetchedService = null;

        if (response.data && response.data.service) {
          fetchedService = response.data.service;
        } else {
          setError("Service not found.");
          setLoading(false);
          return;
        }

        setService(fetchedService);

        // Fetch real workers for this service from the backend
        try {
          const workersResponse = await api.get("/workers", {
            params: { service: fetchedService._id, limit: 50 },
          });

          if (workersResponse.data?.workers?.length > 0) {
            const backendWorkers = workersResponse.data.workers.map((w) => ({
              id: w._id,
              serviceId: w.service?._id || fetchedService._id,
              name: w.user?.name || "Specialist Worker",
              role: w.service?.name || fetchedService.name || "Technician",
              village: w.village || "Local District",
              distanceKm: w.distanceInKm ?? 3.5,
              rating: w.rating || 4.5,
              skills: w.skills?.length > 0 ? w.skills : [fetchedService.name],
              price: w.pricePerService || 400,
              priceUnit: "visit",
              matchPercent: w.matchScore ? Math.round(w.matchScore) : 92,
              completedJobs: w.totalReviews || 18,
              experienceYears: w.experience || 4,
              bio: w.bio || "Experienced local trade specialist.",
              phone: w.user?.phone || "",
            }));
            setMatches(backendWorkers.slice(0, 4));
          } else {
            // Fallback: try to get all workers if service filter returned empty
            const allWorkersResponse = await api.get("/workers", { params: { limit: 50 } });
            if (allWorkersResponse.data?.workers?.length > 0) {
              const backendWorkers = allWorkersResponse.data.workers.map((w) => ({
                id: w._id,
                serviceId: w.service?._id || null,
                name: w.user?.name || "Specialist Worker",
                role: w.service?.name || "Technician",
                village: w.village || "Local District",
                distanceKm: w.distanceInKm ?? 3.5,
                rating: w.rating || 4.5,
                skills: w.skills?.length > 0 ? w.skills : [w.service?.name || "Maintenance"],
                price: w.pricePerService || 400,
                priceUnit: "visit",
                matchPercent: 85,
                completedJobs: w.totalReviews || 18,
                experienceYears: w.experience || 4,
                bio: w.bio || "Experienced local trade specialist.",
                phone: w.user?.phone || "",
              }));
              setMatches(backendWorkers.slice(0, 4));
            } else {
              setMatches([]);
            }
          }
        } catch {
          setMatches([]);
        }
      } catch (err) {
        setError("Failed to load service details.");
      } finally {
        setLoading(false);
      }
    };

    fetchServiceAndWorkers();
  }, [serviceId]);

  if (loading) {
    return (
      <div className="pt-40 container-kare text-center py-20">
        <div className="inline-block w-8 h-8 border-3 border-olive-700 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm text-charcoal/60 dark:text-dark-muted">Loading service details...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="pt-40 container-kare text-center">
        <p className="text-charcoal/60 dark:text-dark-muted">We couldn't find that service.</p>
        <Button as={Link} to="/services" className="mt-4" variant="outline">
          Back to services
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-32 sm:pt-40 pb-20">
      <section className="container-kare">
        <Link to="/services" className="inline-flex items-center gap-1.5 text-sm text-charcoal/50 dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text mb-6">
          <ArrowLeft size={15} /> Back to services
        </Link>
        {/* Service Hero Banner with relevant service image */}
        <div className="relative w-full h-56 sm:h-72 rounded-3xl overflow-hidden border border-charcoal/10 dark:border-dark-border shadow-elevation-1">
          <img
            src={getServiceImage(service)}
            alt={service.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="w-14 h-14 rounded-2xl bg-white/90 dark:bg-dark-card/90 backdrop-blur-md text-olive-700 dark:text-olive-300 flex items-center justify-center shadow-md">
                <Icon name={service.icon || "Briefcase"} size={26} />
              </span>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-olive-700 text-white mb-1.5 inline-block">
                  {service.category || "Village Service"}
                </span>
                <h1 className="font-display text-2xl sm:text-4xl text-white font-bold">{service.name}</h1>
                <p className="text-white/85 text-xs sm:text-sm mt-0.5 max-w-xl">
                  {service.description || "Verified local trade specialists and equipment available"}
                </p>
              </div>
            </div>
            <div className="bg-white/95 dark:bg-dark-card/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 shadow-md shrink-0 flex items-center gap-3 self-start sm:self-auto">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-charcoal/50 dark:text-dark-muted font-medium">Standard Rate</span>
                <p className="text-base font-bold text-charcoal dark:text-dark-text font-display">
                  ₹{service.price || service.basePrice || 350}
                  <span className="text-xs font-normal text-charcoal/50 dark:text-dark-muted">/{service.priceUnit || "visit"}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-kare mt-12">
        <h2 className="font-display text-xl mb-5 text-charcoal dark:text-dark-text">Best matches for {service.name.toLowerCase()}</h2>
        {matches.length === 0 ? (
          <div className="text-center py-12 bg-cream-card dark:bg-dark-card rounded-3xl border border-charcoal/10 dark:border-dark-border p-8">
            <p className="text-charcoal/60 dark:text-dark-muted text-sm font-medium">
              No specialists found for this service yet.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {matches.map((w) => (
              <div key={w.id} className="bg-cream-card dark:bg-dark-card rounded-3xl overflow-hidden border border-charcoal/5 dark:border-dark-border flex">
                <div className="w-32 shrink-0">
                  <ImageTile keywords={`${w.role} india portrait`} alt={w.name} seed="300x300" className="w-full h-full" />
                </div>
                <div className="p-5 flex-1 flex flex-col gap-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display text-lg text-charcoal dark:text-dark-text">{w.name}</h3>
                      <p className="text-sm text-charcoal/55 dark:text-dark-muted">{w.role}</p>
                    </div>
                    <span className="text-xs font-medium bg-olive-100 dark:bg-olive-900/50 text-olive-800 dark:text-olive-300 rounded-full px-2.5 py-1 shrink-0">
                      {w.matchPercent}%
                    </span>
                  </div>
                  <p className="text-sm text-charcoal/55 dark:text-dark-muted flex items-center gap-1">
                    <MapPin size={13} /> {w.distanceKm} km · ₹{w.price}/{w.priceUnit}
                  </p>
                  <Rating value={w.rating} />
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      as={Link}
                      to={`/workers/${w.id}`}
                      className="self-start"
                    >
                      View profile
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        if (outletContext?.openBooking) outletContext.openBooking(w);
                      }}
                      className="self-start"
                    >
                      Book now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Ratings, Reviews & Query/Suggestion Section for Service */}
      <section className="container-kare">
        <RatingAndReviewsSection
          targetType="service"
          targetId={service.id || service._id}
          targetName={service.name}
          targetCategory={service.category || "Village Service"}
          initialRating={service.rating || 4.8}
          initialReviewsCount={service.totalBookings || 32}
        />
      </section>
    </div>
  );
}
