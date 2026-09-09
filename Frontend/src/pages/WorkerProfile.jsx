import { Link, useParams, useOutletContext } from "react-router-dom";
import { ArrowLeft, MapPin, ShieldCheck, Clock, Share2, Phone } from "lucide-react";
import { workers, shgs } from "../data/mockData";
import Rating from "../components/ui/Rating";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import ImageTile from "../components/ui/ImageTile";

export default function WorkerProfile() {
  const { workerId } = useParams();
  const outletContext = useOutletContext();
  const worker = workers.find((w) => w.id === workerId);

  if (!worker) {
    return (
      <div className="pt-40 container-kare text-center">
        <p className="text-charcoal/60">We couldn't find that worker.</p>
        <Button as={Link} to="/workers" className="mt-4" variant="outline">Back to workers</Button>
      </div>
    );
  }

  const shg = worker.shgId ? shgs.find((s) => s.id === worker.shgId) : null;
  const badges = [
    worker.verified.phone && "Phone verified",
    worker.verified.skill && "Skill verified",
    worker.verified.shg && "SHG verified",
  ].filter(Boolean);

  const handleBookingClick = () => {
    if (outletContext?.openBooking) {
      outletContext.openBooking(worker);
    }
  };

  return (
    <div className="pt-32 sm:pt-40 pb-20">
      <div className="container-kare">
        <Link to="/workers" className="inline-flex items-center gap-1.5 text-sm text-charcoal/50 hover:text-charcoal mb-6">
          <ArrowLeft size={15} /> Back to workers
        </Link>

        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10">
          <div className="rounded-[2rem] overflow-hidden aspect-square">
            <ImageTile keywords={`${worker.role} india portrait`} alt={worker.name} seed="700x700" className="w-full h-full" />
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl">{worker.name}</h1>
              <p className="text-charcoal/60 mt-1">{worker.role} · {worker.village}</p>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <Rating value={worker.rating} />
              <span className="text-charcoal/60">{worker.completedJobs} jobs completed</span>
              <span className="text-charcoal/60">{worker.experienceYears} years experience</span>
              <span className="flex items-center gap-1 text-charcoal/60"><MapPin size={14} />{worker.distanceKm} km away</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {badges.map((b) => (
                <Badge key={b} tone="olive"><ShieldCheck size={13} />{b}</Badge>
              ))}
            </div>

            <p className="text-charcoal/70 leading-relaxed">{worker.bio}</p>

            <div>
              <p className="text-sm text-charcoal/50 mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {worker.skills.map((s) => (
                  <span key={s} className="text-sm bg-cream-card border border-charcoal/10 rounded-full px-3.5 py-1.5">{s}</span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-charcoal/60">
              <Clock size={15} /> {worker.availability}
            </div>

            <div className="flex items-center justify-between bg-cream-card rounded-2xl px-5 py-4 border border-charcoal/5">
              <span className="font-display text-2xl">₹{worker.price}<span className="text-sm text-charcoal/50">/{worker.priceUnit}</span></span>
              {shg && (
                <Link to={`/shgs/${shg.id}`} className="text-sm text-olive-700 hover:underline">
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
      </div>
    </div>
  );
}
