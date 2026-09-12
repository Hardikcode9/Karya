import { Link, useParams, useOutletContext } from "react-router-dom";
import { ArrowLeft, ShieldCheck, MapPin } from "lucide-react";
import { shgs, workers } from "../data/mockData";
import Rating from "../components/ui/Rating";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import ImageTile from "../components/ui/ImageTile";
import RatingAndReviewsSection from "../components/reviews/RatingAndReviewsSection";

export default function SHGProfile() {
  const { shgId } = useParams();
  const outletContext = useOutletContext();
  const shg = shgs.find((s) => s.id === shgId);
  const members = workers.filter((w) => w.shgId === shgId);

  if (!shg) {
    return (
      <div className="pt-40 container-kare text-center">
        <p className="text-charcoal/60">We couldn't find that SHG.</p>
        <Button as={Link} to="/shgs" className="mt-4" variant="outline">Back to SHGs</Button>
      </div>
    );
  }

  const handleGroupOrder = () => {
    if (outletContext?.openBooking) {
      outletContext.openBooking({
        id: shg.id,
        name: shg.name,
        role: "Self-Help Group Batch Order",
        village: shg.village,
        price: 1200,
        priceUnit: "bulk order",
      });
    }
  };

  return (
    <div className="pt-32 sm:pt-40 pb-20">
      <div className="container-kare">
        <Link to="/shgs" className="inline-flex items-center gap-1.5 text-sm text-charcoal/50 hover:text-charcoal mb-6">
          <ArrowLeft size={15} /> Back to SHGs
        </Link>

        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10">
          <div className="rounded-[2rem] overflow-hidden aspect-square">
            <ImageTile keywords="women self help group india" alt={shg.name} seed="700x700" className="w-full h-full" />
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="font-display text-3xl sm:text-4xl">{shg.name}</h1>
                <p className="text-charcoal/60 mt-1 flex items-center gap-1"><MapPin size={14} />{shg.village}</p>
              </div>
              <Rating value={shg.rating} />
            </div>

            {shg.verified && <Badge tone="olive" className="self-start"><ShieldCheck size={13} />Verified SHG</Badge>}

            <p className="text-charcoal/70 leading-relaxed">{shg.description}</p>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-cream-card rounded-2xl p-4 text-center border border-charcoal/5">
                <p className="font-display text-xl">{shg.members}</p>
                <p className="text-xs text-charcoal/50 mt-1">Members</p>
              </div>
              <div className="bg-cream-card rounded-2xl p-4 text-center border border-charcoal/5">
                <p className="font-display text-xl">₹{(shg.earnings / 1000).toFixed(1)}L</p>
                <p className="text-xs text-charcoal/50 mt-1">Earnings</p>
              </div>
              <div className="bg-cream-card rounded-2xl p-4 text-center border border-charcoal/5">
                <p className="font-display text-xl">{shg.orders}</p>
                <p className="text-xs text-charcoal/50 mt-1">Orders</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-charcoal/50 mb-2">Services & Products</p>
              <div className="flex flex-wrap gap-2">
                {shg.services.map((s) => (
                  <span key={s} className="text-sm bg-cream-card border border-charcoal/10 rounded-full px-3.5 py-1.5">{s}</span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button icon onClick={handleGroupOrder}>Request a group order</Button>
              <Button variant="outline" onClick={handleGroupOrder}>Contact SHG</Button>
            </div>
          </div>
        </div>

        {members.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl mb-5">Members on Karya</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {members.map((m) => (
                <Link key={m.id} to={`/workers/${m.id}`} className="bg-cream-card rounded-3xl overflow-hidden border border-charcoal/5 flex">
                  <div className="w-28 shrink-0">
                    <ImageTile keywords={`${m.role} india portrait`} alt={m.name} seed="250x250" className="w-full h-full" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-base">{m.name}</h3>
                    <p className="text-sm text-charcoal/55">{m.role}</p>
                    <Rating value={m.rating} />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Rating & Reviews Section for SHG Collective */}
        <RatingAndReviewsSection
          targetType="shg"
          targetId={shg.id}
          targetName={shg.name}
          targetCategory="Self-Help Group Cooperative"
          initialRating={shg.rating}
          initialReviewsCount={shg.orders || 18}
        />
      </div>
    </div>
  );
}
