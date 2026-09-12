import { ShoppingBag, Users, IndianRupee, TrendingUp } from "lucide-react";
import DashStat from "../../components/ui/DashStat";

const recentOrders = [];

export default function SHGDashboard() {
  const shg = {
    name: "SHG Dashboard",
    village: "Your Village",
    members: 0,
    earnings: 0
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl">{shg.name}</h1>
        <p className="text-charcoal/55 text-sm mt-1">{shg.village} · {shg.members} members</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashStat label="Active orders" value="5" icon={ShoppingBag} />
        <DashStat label="Members" value={shg.members} icon={Users} />
        <DashStat label="Total earnings" value={`₹${(shg.earnings / 1000).toFixed(1)}L`} icon={IndianRupee} />
        <DashStat label="Customer growth" value="+18%" sub="This quarter" icon={TrendingUp} />
      </div>

      <div>
        <h2 className="font-display text-xl mb-4">Recent orders</h2>
        {recentOrders.length === 0 ? (
          <div className="bg-cream-card rounded-2xl p-8 text-center border border-charcoal/10">
            <p className="text-charcoal/60 dark:text-dark-muted">No recent orders found.</p>
          </div>
        ) : (
          <div className="bg-cream-card rounded-2xl border border-charcoal/5 divide-y divide-charcoal/5 overflow-hidden">
            {recentOrders.map((o) => (
              <div key={o.customer} className="flex items-center justify-between px-5 py-4 gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{o.customer}</p>
                  <p className="text-xs text-charcoal/55 truncate">{o.service}</p>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full shrink-0 ${
                    o.status === "Completed"
                      ? "bg-olive-100 text-olive-800"
                      : o.status === "Confirmed"
                      ? "bg-clay-100 text-clay-800"
                      : "bg-cream text-charcoal/60 border border-charcoal/10"
                  }`}
                >
                  {o.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
