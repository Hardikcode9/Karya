import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";
import { allServices, workers } from "../data/mockData";
import { rankWorkers } from "../utils/matching";
import Icon from "../components/ui/Icon";
import Rating from "../components/ui/Rating";
import Button from "../components/ui/Button";
import ImageTile from "../components/ui/ImageTile";

export default function ServiceDetail() {
  const { serviceId } = useParams();
  const service = allServices.find((s) => s.id === serviceId);

  if (!service) {
    return (
      <div className="pt-40 container-kare text-center">
        <p className="text-charcoal/60">We couldn't find that service.</p>
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
        <Link to="/services" className="inline-flex items-center gap-1.5 text-sm text-charcoal/50 hover:text-charcoal mb-6">
          <ArrowLeft size={15} /> Back to services
        </Link>
        <div className="flex items-center gap-4">
          <span className="w-14 h-14 rounded-2xl bg-olive-100 text-olive-700 flex items-center justify-center">
            <Icon name={service.icon} size={24} />
          </span>
          <div>
            <h1 className="font-display text-3xl sm:text-4xl">{service.name}</h1>
            <p className="text-charcoal/55 text-sm mt-1">{service.count} workers listed near you</p>
          </div>
        </div>
      </section>

      <section className="container-kare mt-12">
        <h2 className="font-display text-xl mb-5">Best matches for {service.name.toLowerCase()}</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {matches.map((w) => (
            <div key={w.id} className="bg-cream-card rounded-3xl overflow-hidden border border-charcoal/5 flex">
              <div className="w-32 shrink-0">
                <ImageTile keywords={`${w.role} india portrait`} alt={w.name} seed="300x300" className="w-full h-full" />
              </div>
              <div className="p-5 flex-1 flex flex-col gap-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-lg">{w.name}</h3>
                    <p className="text-sm text-charcoal/55">{w.role}</p>
                  </div>
                  <span className="text-xs font-medium bg-olive-100 text-olive-800 rounded-full px-2.5 py-1 shrink-0">
                    {w.matchPercent}%
                  </span>
                </div>
                <p className="text-sm text-charcoal/55 flex items-center gap-1">
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
