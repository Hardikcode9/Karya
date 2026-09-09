import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Rating from "../ui/Rating";
import Button from "../ui/Button";
import SectionHeading from "../ui/SectionHeading";
import ImageTile from "../ui/ImageTile";
import { shgs } from "../../data/mockData";

export default function SHGEcosystemSection() {
  const featured = shgs[0];

  return (
    <section className="container-kare mt-24 sm:mt-32">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <SectionHeading
          eyebrow="SHG ecosystem"
          title="From individual skills to community strength."
          description="Self-Help Groups list shared services, take group orders and track their earnings — all from one profile."
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-cream-card rounded-3xl overflow-hidden border border-charcoal/5 flex flex-col sm:flex-row"
        >
          <div className="sm:w-2/5 aspect-[4/3] sm:aspect-auto">
            <ImageTile keywords="women self help group tailoring india" alt={featured.name} seed="500x500" className="w-full h-full" />
          </div>
          <div className="p-6 flex flex-col gap-3 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-xl">{featured.name}</h3>
              <Rating value={featured.rating} />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {featured.services.map((s) => (
                <span key={s} className="text-xs bg-olive-100 text-olive-800 rounded-full px-2.5 py-1">
                  {s}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2 text-center">
              <div>
                <p className="font-display text-lg">{featured.members}</p>
                <p className="text-xs text-charcoal/50">Members</p>
              </div>
              <div>
                <p className="font-display text-lg">₹{(featured.earnings / 1000).toFixed(1)}L</p>
                <p className="text-xs text-charcoal/50">Earnings</p>
              </div>
              <div>
                <p className="font-display text-lg">{featured.orders}</p>
                <p className="text-xs text-charcoal/50">Orders</p>
              </div>
            </div>
            <Button as={Link} to="/shgs" size="sm" variant="outline" icon className="self-start mt-2">
              Explore SHGs
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
