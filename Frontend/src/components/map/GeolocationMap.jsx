import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapPin, Navigation, Compass, SlidersHorizontal,
  Wrench, ShoppingBag, Star, Phone, CheckCircle2,
  RefreshCw, Search, ArrowRight, ShieldCheck, Crosshair,
  Layers, Map, Info, AlertCircle, Eye
} from "lucide-react";
import { useToast } from "../../hooks/useToast";

// Standard Default Village Center: Rampur Gram Panchayat (Gorakhpur Block, UP)
const DEFAULT_CUSTOMER_LOCATION = {
  lat: 26.7606,
  lng: 83.3732,
  label: "Rampur Gram Panchayat, Gorakhpur",
  isLive: false,
};

// Base Village Service Providers with relative geographic offsets (in degrees lat/lng)
const RAW_PROVIDERS = [
  {
    id: "p-ramesh",
    name: "Ramesh Kumar",
    role: "Verified Carpenter & Woodcrafter",
    trade: "Carpentry",
    category: "carpenter",
    type: "worker",
    village: "Sonipur Village",
    rating: 4.8,
    jobsCompleted: 127,
    price: 500,
    priceUnit: "day",
    experience: "8 yrs exp",
    photo: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=300&q=80",
    phone: "+91 98765 43210",
    latOffset: 0.016,
    lngOffset: 0.014,
    skills: ["Furniture Repair", "Door Fitting", "Grain Silo Woodwork"],
    verified: true,
  },
  {
    id: "p-sunita",
    name: "Sunita Devi",
    role: "Master Tailor & Rural Craft Lead",
    trade: "Tailoring",
    category: "tailor",
    type: "worker",
    village: "Rampura North",
    rating: 4.9,
    jobsCompleted: 203,
    price: 350,
    priceUnit: "piece",
    experience: "11 yrs exp",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    phone: "+91 94150 12890",
    latOffset: -0.008,
    lngOffset: 0.007,
    skills: ["School Uniforms", "Embroidery", "Blouse Stitching"],
    verified: true,
  },
  {
    id: "p-irfan",
    name: "Irfan Ali",
    role: "Certified Electrician & Motor Specialist",
    trade: "Electrical",
    category: "electrician",
    type: "worker",
    village: "Sonipur Chauraha",
    rating: 4.6,
    jobsCompleted: 94,
    price: 450,
    priceUnit: "day",
    experience: "6 yrs exp",
    photo: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=80",
    phone: "+91 98390 56781",
    latOffset: 0.025,
    lngOffset: -0.021,
    skills: ["Pump Starter Wiring", "House Wiring", "Solar Inverter"],
    verified: true,
  },
  {
    id: "p-geeta",
    name: "Geeta Yadav",
    role: "Community Cook & Festive Caterer",
    trade: "Catering",
    category: "catering",
    type: "worker",
    village: "Bhagwanpur",
    rating: 4.8,
    jobsCompleted: 156,
    price: 250,
    priceUnit: "plate",
    experience: "9 yrs exp",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    phone: "+91 91200 44512",
    latOffset: -0.028,
    lngOffset: 0.023,
    skills: ["Bulk Cooking", "Traditional Sweets", "Wedding Catering"],
    verified: true,
  },
  {
    id: "p-mahesh",
    name: "Mahesh Patil",
    role: "Farm Labourer & Irrigation Fitter",
    trade: "Farming",
    category: "farming",
    type: "worker",
    village: "Devgaon Fields",
    rating: 4.5,
    jobsCompleted: 68,
    price: 400,
    priceUnit: "day",
    experience: "14 yrs exp",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    phone: "+91 97920 33419",
    latOffset: -0.036,
    lngOffset: -0.031,
    skills: ["Drip Irrigation", "Harvesting", "Borewell Pipeline"],
    verified: true,
  },
  {
    id: "p-lata",
    name: "Lata More",
    role: "Bamboo Crafts & Pottery Artisan",
    trade: "Handicrafts",
    category: "artisan",
    type: "worker",
    village: "Rampura Hatia",
    rating: 4.9,
    jobsCompleted: 112,
    price: 600,
    priceUnit: "order",
    experience: "7 yrs exp",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    phone: "+91 94500 89123",
    latOffset: 0.012,
    lngOffset: -0.011,
    skills: ["Bamboo Baskets", "Clay Pots", "Terracotta Decor"],
    verified: true,
  },
  {
    id: "p-suresh",
    name: "Suresh Yadav",
    role: "Solar Pump & Inverter Technician",
    trade: "Electrical",
    category: "electrician",
    type: "worker",
    village: "Sadar Block",
    rating: 4.7,
    jobsCompleted: 88,
    price: 550,
    priceUnit: "day",
    experience: "8 yrs exp",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    phone: "+91 96160 77890",
    latOffset: 0.022,
    lngOffset: 0.017,
    skills: ["Solar Panel Cleaning", "Inverter Battery Overhaul", "Phase Balancer"],
    verified: true,
  },
  {
    id: "p-rajesh",
    name: "Rajesh Mistri",
    role: "Mason & Roof Leakage Specialist",
    trade: "Construction",
    category: "construction",
    type: "worker",
    village: "Pipraich Border",
    rating: 4.6,
    jobsCompleted: 74,
    price: 650,
    priceUnit: "day",
    experience: "12 yrs exp",
    photo: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=300&q=80",
    phone: "+91 98380 11234",
    latOffset: 0.046,
    lngOffset: 0.038,
    skills: ["Polymer Waterproofing", "Brick Masonry", "Floor Tile Seal"],
    verified: true,
  },
  // SHG Self Help Groups
  {
    id: "s-lakshmi",
    name: "Maa Lakshmi Women SHG",
    role: "Handcrafted Textiles & Tailoring Unit",
    trade: "SHG Enterprise",
    category: "shg",
    type: "shg",
    village: "Rampura Gramin Center",
    rating: 4.9,
    jobsCompleted: 127,
    price: 350,
    priceUnit: "unit",
    members: "18 Women Members",
    photo: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=300&q=80",
    phone: "+91 94150 99881",
    latOffset: -0.014,
    lngOffset: -0.012,
    skills: ["Handspun Towels", "Cotton Kurti", "Khadi Bags"],
    verified: true,
  },
  {
    id: "s-pragati",
    name: "Pragati Mahila SHG",
    role: "Handcrafted Terracotta Matka & Pottery",
    trade: "SHG Enterprise",
    category: "shg",
    type: "shg",
    village: "Gorakhpur Artisan Cluster",
    rating: 4.9,
    jobsCompleted: 184,
    price: 450,
    priceUnit: "item",
    members: "24 Rural Potters",
    photo: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=300&q=80",
    phone: "+91 94520 33211",
    latOffset: 0.021,
    lngOffset: -0.018,
    skills: ["10L Cooling Matka", "Clay Cookware", "Diya Collections"],
    verified: true,
  },
  {
    id: "s-annapurna",
    name: "Annapurna Kitchen SHG",
    role: "Cold-Pressed Pickles, Papad & Grains",
    trade: "SHG Enterprise",
    category: "shg",
    type: "shg",
    village: "Bhagwanpur Mandi",
    rating: 4.8,
    jobsCompleted: 96,
    price: 180,
    priceUnit: "pack",
    members: "14 Women Farmers",
    photo: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=300&q=80",
    phone: "+91 97930 44556",
    latOffset: 0.031,
    lngOffset: 0.027,
    skills: ["Mango Pickle", "Urad Dal Papad", "Organic Spices"],
    verified: true,
  },
  {
    id: "s-aarunya",
    name: "Aarunya Weaver Collective",
    role: "Natural Cane & Bamboo Weaving",
    trade: "SHG Enterprise",
    category: "shg",
    type: "shg",
    village: "Chauri Chaura Weavers",
    rating: 4.7,
    jobsCompleted: 65,
    price: 620,
    priceUnit: "set",
    members: "16 Bamboo Artisans",
    photo: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=300&q=80",
    phone: "+91 98390 12009",
    latOffset: -0.051,
    lngOffset: 0.043,
    skills: ["Storage Baskets", "Cane Stools", "Paddy Straw Hampers"],
    verified: true,
  },
  {
    id: "s-gramodaya",
    name: "Gramodaya Oil Federation",
    role: "Pure Kachi Ghani Mustard & Sesame",
    trade: "SHG Enterprise",
    category: "shg",
    type: "shg",
    village: "Kauriram Mill Gate",
    rating: 4.9,
    jobsCompleted: 142,
    price: 380,
    priceUnit: "bottle",
    members: "32 Farmer Members",
    photo: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=300&q=80",
    phone: "+91 94150 77665",
    latOffset: 0.064,
    lngOffset: -0.056,
    skills: ["Wood-Pressed Sarson Oil", "Sesame Oil", "Flaxseed Oil"],
    verified: true,
  },
];

// Haversine Distance Formula in Kilometers
function getHaversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export default function GeolocationMap({ onSelectWorker, onSelectSHG, onAddToCart }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const circleRef = useRef(null);
  const markersLayerRef = useRef(null);
  const customerMarkerRef = useRef(null);

  const [customerLocation, setCustomerLocation] = useState(DEFAULT_CUSTOMER_LOCATION);
  const [locating, setLocating] = useState(false);
  const [gpsError, setGpsError] = useState("");
  const [radiusKm, setRadiusKm] = useState(10); // Default 10km filter
  const [selectedTrade, setSelectedTrade] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeProvider, setActiveProvider] = useState(null);
  const toast = useToast();

  // Compute live coordinates and real distance for each provider
  const allProvidersWithDistance = RAW_PROVIDERS.map((p) => {
    const lat = customerLocation.lat + p.latOffset;
    const lng = customerLocation.lng + p.lngOffset;
    const distanceKm = getHaversineDistanceKm(customerLocation.lat, customerLocation.lng, lat, lng);
    return {
      ...p,
      lat,
      lng,
      distanceKm,
    };
  });

  // Filter providers according to Distance Slider & Trade Filter
  const filteredProviders = allProvidersWithDistance
    .filter((p) => {
      // Distance filter
      if (p.distanceKm > radiusKm) return false;

      // Trade/Category filter
      if (selectedTrade !== "all") {
        if (selectedTrade === "worker" && p.type !== "worker") return false;
        if (selectedTrade === "shg" && p.type !== "shg") return false;
        if (selectedTrade === "electrician" && p.category !== "electrician") return false;
        if (selectedTrade === "carpenter" && p.category !== "carpenter") return false;
        if (selectedTrade === "tailor" && p.category !== "tailor") return false;
      }

      // Search text query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchRole = p.role.toLowerCase().includes(q);
        const matchVillage = p.village.toLowerCase().includes(q);
        return matchName || matchRole || matchVillage;
      }
      return true;
    })
    .sort((a, b) => a.distanceKm - b.distanceKm); // Closest first

  // Fetch Live Customer Location via Geolocation API
  const fetchLiveLocation = () => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser");
      toast.show("GPS not supported. Using saved village coordinates.", "error");
      return;
    }

    setLocating(true);
    setGpsError("");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newLocation = {
          lat: latitude,
          lng: longitude,
          label: `Live GPS Location (${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E)`,
          isLive: true,
        };
        setCustomerLocation(newLocation);
        setLocating(false);
        toast.show("Location successfully fetched! OpenStreetMap recentered.", "success");

        // Pan map to new location
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 13, { duration: 1.5 });
        }
      },
      (err) => {
        console.warn("Geolocation access denied or failed:", err.message);
        setLocating(false);
        setGpsError(err.message || "Location access was denied");
        toast.show("GPS permission denied. Showing saved village center.", "info");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // 1. Initialize Leaflet Map on Mount
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Create Map
    const map = L.map(mapContainerRef.current, {
      center: [customerLocation.lat, customerLocation.lng],
      zoom: 13,
      zoomControl: false,
    });

    // Add OpenStreetMap Tile Layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Zoom control at bottom right
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Create a feature group for markers
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    // Automatically trigger live GPS detection once on mount
    fetchLiveLocation();

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Update Customer Marker & Distance Radius Circle on Location or Radius change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Customer Marker Pin using Leaflet DivIcon
    const customerDivIcon = L.divIcon({
      className: "custom-customer-icon",
      html: `
        <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
          <span class="absolute w-12 h-12 rounded-full bg-emerald-500/30 animate-ping pointer-events-none"></span>
          <div class="w-9 h-9 rounded-2xl bg-emerald-700 text-white border-2 border-white shadow-xl flex items-center justify-center shadow-emerald-700/40">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
          </div>
          <div class="absolute -bottom-6 px-2.5 py-0.5 rounded-full bg-charcoal/90 text-cream text-[10px] font-bold shadow-md whitespace-nowrap border border-white/20">
            Customer Location
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    if (customerMarkerRef.current) {
      customerMarkerRef.current.setLatLng([customerLocation.lat, customerLocation.lng]);
    } else {
      customerMarkerRef.current = L.marker([customerLocation.lat, customerLocation.lng], {
        icon: customerDivIcon,
        zIndexOffset: 1000,
      })
        .addTo(map)
        .bindPopup(`
          <div class="p-2 text-center">
            <p class="font-bold text-xs text-charcoal">Your Current Location</p>
            <p class="text-[11px] text-charcoal/60 mt-0.5">${customerLocation.label}</p>
            <span class="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
              ${customerLocation.isLive ? "Live GPS Active" : "Saved Village Hub"}
            </span>
          </div>
        `);
    }

    // Radius Circle around customer (radiusKm in meters = radiusKm * 1000)
    if (circleRef.current) {
      circleRef.current.setLatLng([customerLocation.lat, customerLocation.lng]);
      circleRef.current.setRadius(radiusKm * 1000);
    } else {
      circleRef.current = L.circle([customerLocation.lat, customerLocation.lng], {
        radius: radiusKm * 1000,
        color: "#4d7c0f",
        fillColor: "#84cc16",
        fillOpacity: 0.08,
        weight: 2,
        dashArray: "6, 8",
      }).addTo(map);
    }
  }, [customerLocation, radiusKm]);

  // 3. Render Service Providers on OpenStreetMap whenever filtered list updates
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    // Clear previous provider markers
    markersLayer.clearLayers();

    filteredProviders.forEach((provider) => {
      const isWorker = provider.type === "worker";

      // Custom Leaflet DivIcon for Worker or SHG
      const markerIcon = L.divIcon({
        className: "custom-provider-icon",
        html: `
          <div class="relative flex flex-col items-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
            <div class="w-10 h-10 rounded-2xl ${
              isWorker ? "bg-olive-700" : "bg-purple-800"
            } text-white border-2 border-white shadow-xl flex items-center justify-center p-0.5 group-hover:scale-110 transition-transform">
              <img src="${provider.photo}" class="w-full h-full rounded-[0.85rem] object-cover" alt="${provider.name}" />
            </div>
            <span class="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded-full ${
              isWorker ? "bg-amber-400 text-charcoal" : "bg-purple-200 text-purple-900"
            } font-bold text-[9px] shadow-xs border border-white">
              ${isWorker ? `★${provider.rating}` : "SHG"}
            </span>
            <div class="mt-1 px-2 py-0.5 rounded-lg bg-white/95 dark:bg-dark-card/95 backdrop-blur-xs border border-charcoal/10 dark:border-dark-border shadow-xs text-[10px] font-bold text-charcoal dark:text-dark-text whitespace-nowrap">
              ${provider.name.split(" ")[0]} · <span class="text-olive-700 font-bold">${provider.distanceKm}km</span>
            </div>
          </div>
        `,
        iconSize: [44, 52],
        iconAnchor: [22, 26],
        popupAnchor: [0, -28],
      });

      // Interactive Popup for each provider matching user's unified button structure
      const popupHtml = `
        <div class="p-3 max-w-[260px] text-charcoal font-sans">
          <div class="flex items-center gap-2.5">
            <img src="${provider.photo}" class="w-12 h-12 rounded-xl object-cover border border-charcoal/10 shrink-0 shadow-xs" alt="${provider.name}" />
            <div class="min-w-0">
              <span class="inline-block px-2 py-0.5 rounded-md ${
                isWorker ? "bg-olive-100 text-olive-800" : "bg-purple-100 text-purple-800"
              } text-[9px] font-bold uppercase">
                ${provider.trade}
              </span>
              <h4 class="font-bold text-xs truncate text-charcoal mt-0.5">${provider.name}</h4>
              <p class="text-[10px] text-charcoal/60 truncate">${provider.village}</p>
            </div>
          </div>

          <div class="flex items-center justify-between mt-2 pt-2 border-t border-charcoal/10 text-xs">
            <div class="flex items-center gap-1 font-bold text-amber-600">
              <span>★ ${provider.rating}</span>
              <span class="text-[10px] text-charcoal/50">(${provider.jobsCompleted})</span>
            </div>
            <div class="font-bold text-charcoal text-xs">
              ₹${provider.price}/${provider.priceUnit}
            </div>
          </div>

          <div class="mt-1 flex items-center gap-1 text-[11px] font-bold text-emerald-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>${provider.distanceKm} km from your location</span>
          </div>

          <div class="mt-2.5 pt-2 border-t border-charcoal/10">
            <a href="${isWorker ? '/services' : '/shgs'}" class="w-full inline-flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl font-bold text-xs bg-olive-700 hover:bg-olive-800 text-white shadow-sm transition-all border border-olive-800/20 text-center" style="color: white; text-decoration: none;">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
              <span>Book Service Now</span>
            </a>
          </div>
        </div>
      `;

      const marker = L.marker([provider.lat, provider.lng], { icon: markerIcon })
        .addTo(markersLayer)
        .bindPopup(popupHtml, { maxWidth: 280, className: "custom-leaflet-popup" });

      marker.on("click", () => {
        setActiveProvider(provider);
      });
    });
  }, [filteredProviders]);

  // Handler to pan to provider when clicked from list
  const focusOnProvider = (p) => {
    setActiveProvider(p);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([p.lat, p.lng], 15, { duration: 1.2 });
    }
  };

  return (
    <div className="bg-cream-card dark:bg-dark-card rounded-[2.5rem] border border-charcoal/10 dark:border-dark-border overflow-hidden shadow-elevation-2 flex flex-col">
      {/* Top Map Control Bar */}
      <div className="p-4 sm:p-5 bg-ivory/90 dark:bg-dark-surface border-b border-charcoal/10 dark:border-dark-border flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Title and Customer Location Status */}
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-olive-100 dark:bg-olive-900/50 text-olive-800 dark:text-olive-300 flex items-center justify-center shrink-0">
              <Compass size={18} />
            </span>
            <div>
              <h3 className="font-display text-base font-bold text-charcoal dark:text-dark-text flex items-center gap-2">
                OpenStreetMap Provider Radar
                <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                  Leaflet.js Live
                </span>
              </h3>
              <p className="text-xs text-charcoal/60 dark:text-dark-muted flex items-center gap-1 mt-0.5">
                <Navigation size={12} className="text-emerald-600 shrink-0" />
                <span className="truncate max-w-xs sm:max-w-md">{customerLocation.label}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls: Live GPS Locate Button & Recenter */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-between lg:justify-end">
          <button
            type="button"
            onClick={fetchLiveLocation}
            disabled={locating}
            className="inline-flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl font-bold text-xs bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white shadow-xs transition-all border border-emerald-800/20 cursor-pointer disabled:opacity-50"
            title="Detect your device GPS coordinates"
          >
            <Crosshair size={14} className={`shrink-0 ${locating ? "animate-spin" : ""}`} />
            <span>{locating ? "Locating..." : "Fetch Current Location"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (mapInstanceRef.current) {
                mapInstanceRef.current.flyTo([customerLocation.lat, customerLocation.lng], 13, { duration: 1.2 });
              }
            }}
            className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-semibold text-xs bg-white dark:bg-dark-card border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text hover:bg-charcoal/5 shadow-xs cursor-pointer"
            title="Center map on customer pin"
          >
            <Navigation size={13} className="text-olive-700 dark:text-olive-400" />
            <span>Recenter</span>
          </button>
        </div>
      </div>

      {/* Distance Filter Toolbar */}
      <div className="px-4 py-3 bg-white/70 dark:bg-dark-bg/50 border-b border-charcoal/10 dark:border-dark-border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Interactive Distance Slider */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-bold text-charcoal dark:text-dark-text flex items-center gap-1">
              <SlidersHorizontal size={13} className="text-olive-700 dark:text-olive-400" />
              <span>Distance Filter:</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-olive-100 dark:bg-olive-900/60 text-olive-900 dark:text-olive-200 font-bold text-xs">
              Within {radiusKm} km
            </span>
          </div>

          <input
            type="range"
            min={1}
            max={25}
            step={1}
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
            className="w-32 sm:w-44 accent-olive-700 h-2 bg-charcoal/15 dark:bg-dark-border rounded-lg cursor-pointer"
          />

          {/* Quick Distance Presets */}
          <div className="flex items-center gap-1">
            {[3, 5, 10, 15, 25].map((km) => (
              <button
                key={km}
                type="button"
                onClick={() => setRadiusKm(km)}
                className={`px-2 py-0.5 rounded-md font-semibold text-[11px] transition-all cursor-pointer ${
                  radiusKm === km
                    ? "bg-olive-700 text-white font-bold shadow-xs"
                    : "bg-charcoal/5 dark:bg-dark-surface text-charcoal/70 dark:text-dark-muted hover:text-charcoal"
                }`}
              >
                {km}km
              </button>
            ))}
          </div>
        </div>

        {/* Trade Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: "all", label: "All Nearby" },
            { id: "worker", label: "Specialists" },
            { id: "electrician", label: "Electricians" },
            { id: "carpenter", label: "Carpenters" },
            { id: "tailor", label: "Tailors" },
            { id: "shg", label: "SHG Units" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedTrade(tab.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedTrade === tab.id
                  ? "bg-olive-800 text-white font-bold shadow-xs"
                  : "bg-cream dark:bg-dark-surface border border-charcoal/10 dark:border-dark-border text-charcoal/70 dark:text-dark-muted hover:text-charcoal"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map & Interactive List Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 relative min-h-[480px]">
        {/* OpenStreetMap Canvas (8 cols on desktop) */}
        <div className="lg:col-span-8 relative h-[380px] sm:h-[480px] lg:h-[540px] w-full z-0">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Floating Map Legend Indicator */}
          <div className="absolute top-3 left-3 z-[400] bg-white/95 dark:bg-dark-card/95 backdrop-blur-sm p-2.5 rounded-2xl shadow-md border border-charcoal/10 dark:border-dark-border text-[11px] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-charcoal dark:text-dark-text">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>You (Customer Center)</span>
            </div>
            <div className="flex items-center gap-1.5 text-charcoal/70 dark:text-dark-muted">
              <span className="w-2.5 h-2.5 rounded-full bg-olive-700" />
              <span>Verified Trades ({filteredProviders.filter((p) => p.type === "worker").length})</span>
            </div>
            <div className="flex items-center gap-1.5 text-charcoal/70 dark:text-dark-muted">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-700" />
              <span>Village SHGs ({filteredProviders.filter((p) => p.type === "shg").length})</span>
            </div>
          </div>
        </div>

        {/* Live Filtered Provider List (4 cols on desktop) */}
        <div className="lg:col-span-4 bg-ivory/60 dark:bg-dark-surface/60 border-t lg:border-t-0 lg:border-l border-charcoal/10 dark:border-dark-border flex flex-col h-auto lg:h-[540px] overflow-hidden">
          {/* List Header */}
          <div className="p-4 border-b border-charcoal/10 dark:border-dark-border flex items-center justify-between bg-white dark:bg-dark-card">
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-charcoal dark:text-dark-text">
                Nearby Service Providers
              </h4>
              <p className="text-[11px] text-charcoal/55 dark:text-dark-muted">
                {filteredProviders.length} active within {radiusKm} km radius
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-olive-100 dark:bg-olive-900/60 text-olive-800 dark:text-olive-300 font-bold text-xs">
              Live Radius
            </span>
          </div>

          {/* Scrollable Provider Cards */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {filteredProviders.length === 0 ? (
              <div className="text-center py-10 px-4">
                <AlertCircle size={28} className="mx-auto text-charcoal/40 dark:text-dark-muted mb-2" />
                <p className="font-bold text-xs text-charcoal dark:text-dark-text">No providers within {radiusKm} km</p>
                <p className="text-[11px] text-charcoal/50 dark:text-dark-muted mt-1">
                  Try expanding the distance slider up to 25 km or selecting All Trades.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setRadiusKm(25);
                    setSelectedTrade("all");
                  }}
                  className="mt-3 px-3 py-1.5 rounded-xl bg-olive-700 text-white font-bold text-xs"
                >
                  Expand to 25 km
                </button>
              </div>
            ) : (
              filteredProviders.map((p) => {
                const isSelected = activeProvider?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => focusOnProvider(p)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? "bg-white dark:bg-dark-card border-olive-600 dark:border-olive-400 shadow-md ring-2 ring-olive-600/20"
                        : "bg-white/80 dark:bg-dark-card/80 border-charcoal/10 dark:border-dark-border hover:border-charcoal/30 hover:shadow-xs"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={p.photo}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover border border-charcoal/10 shrink-0 shadow-xs"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h5 className="font-bold text-xs text-charcoal dark:text-dark-text truncate">
                            {p.name}
                          </h5>
                          <span className="font-bold text-xs text-emerald-700 dark:text-emerald-400 shrink-0 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded-md">
                            {p.distanceKm} km
                          </span>
                        </div>
                        <p className="text-[11px] text-charcoal/60 dark:text-dark-muted truncate">
                          {p.role}
                        </p>
                        <p className="text-[10px] text-charcoal/50 dark:text-dark-muted truncate mt-0.5">
                          {p.village} • ₹{p.price}/{p.priceUnit}
                        </p>
                      </div>
                    </div>

                    {/* Card Action Button with unified structure: [iconlogo  Book Service Now] */}
                    <div className="pt-2 border-t border-charcoal/5 dark:border-dark-border flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600">
                        <span>★ {p.rating}</span>
                        <span className="text-charcoal/40 font-normal">({p.jobsCompleted})</span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (p.type === "worker" && onSelectWorker) onSelectWorker(p);
                          if (p.type === "shg" && onSelectSHG) onSelectSHG(p);
                        }}
                        className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl font-bold text-xs bg-olive-700 hover:bg-olive-800 active:scale-[0.98] text-white shadow-xs transition-all border border-olive-800/20 cursor-pointer"
                      >
                        <Wrench size={12} className="shrink-0" />
                        <span>Book Service Now</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
