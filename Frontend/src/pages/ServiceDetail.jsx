import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, AlertCircle } from "lucide-react";
import { allServices, workers } from "../data/mockData";
import { rankWorkers } from "../utils/matching";
import Icon from "../components/ui/Icon";
import Rating from "../components/ui/Rating";
import Button from "../components/ui/Button";
import ImageTile from "../components/ui/ImageTile";
import api from "../utils/api";

export default function ServiceDetail() {
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get(`/services/${serviceId}`);
        if (response.data && response.data.service) {
          setService(response.data.service);
        } else {
          // Fallback to mock data if ID matches mock ID
          const mockMatch = allServices.find((s) => s.id === serviceId);
          if (mockMatch) {
            setService(mockMatch);
          } else {
            setError("Service not found.");
          }
        }
      } catch (err) {
        // Fallback check
        const mockMatch = allServices.find((s) => s.id === serviceId);
        if (mockMatch) {
          setService(mockMatch);
        } else {
          setError("Failed to load service details.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchService();
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

  const matches = rankWorkers(workers, { skill: service.name }).slice(0, 4);

  return (
    <div className="pt-32 sm:pt-40 pb-20">
      <section className="container-kare">
        <Link to="/services" className="inline-flex items-center gap-1.5 text-sm text-charcoal/50 dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text mb-6">
          <ArrowLeft size={15} /> Back to services
        </Link>
        <div className="flex items-center gap-4">
          <span className="w-14 h-14 rounded-2xl bg-olive-100 dark:bg-olive-950/60 text-olive-700 dark:text-olive-300 flex items-center justify-center">
            <Icon name={service.icon || "Briefcase"} size={24} />
          </span>
          <div>
            <h1 className="font-display text-3xl sm:text-4xl text-charcoal dark:text-dark-text">{service.name}</h1>
            <p className="text-charcoal/55 dark:text-dark-muted text-sm mt-1">{service.description || "Verified local trade specialists available"}</p>
          </div>
        </div>
      </section>

      <section className="container-kare mt-12">
        <h2 className="font-display text-xl mb-5 text-charcoal dark:text-dark-text">Best matches for {service.name.toLowerCase()}</h2>
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
                <Button as={Link} to={`/workers/${w.id}`} size="sm" variant="outline" className="mt-2 self-start">
                  View profile
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

