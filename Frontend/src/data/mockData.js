// Central mock data. Shapes here mirror the intended backend models
// (User, Worker, SHG, Service, Job, Review) so this file can later be
// swapped for real API calls without touching component code.

export const heroStats = [
  { value: 2500, suffix: "+", label: "Workers connected" },
  { value: 350, suffix: "+", label: "SHGs supported" },
  { value: 12000, suffix: "+", label: "Jobs completed" },
  { value: 95, suffix: "%", label: "Customer satisfaction" },
];

export const serviceCategories = [
  {
    id: "individual",
    title: "Individual services",
    blurb: "Skilled workers for everyday household and site work.",
    services: [
      { id: "plumbing", name: "Plumbing", count: 214, icon: "Wrench", image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=600&q=80" },
      { id: "electrical", name: "Electrical", count: 189, icon: "Zap", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80" },
      { id: "carpentry", name: "Carpentry", count: 176, icon: "Hammer", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80" },
      { id: "cleaning", name: "Cleaning", count: 302, icon: "Sparkles", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80" },
      { id: "construction", name: "Construction", count: 98, icon: "HardHat", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80" },
      { id: "farming", name: "Farming help", count: 241, icon: "Wheat", image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80" },
      { id: "transportation", name: "Transportation", count: 133, icon: "Truck", image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80" },
      { id: "household", name: "Household work", count: 267, icon: "Home", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80" },
    ],
  },
  {
    id: "shg",
    title: "SHG services",
    blurb: "Products and group work from women-led Self-Help Groups.",
    services: [
      { id: "tailoring", name: "Tailoring", count: 87, icon: "Scissors", image: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=600&q=80" },
      { id: "handicrafts", name: "Handicrafts", count: 64, icon: "Palette", image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80" },
      { id: "catering", name: "Catering", count: 52, icon: "ChefHat", image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80" },
      { id: "pickles", name: "Pickles", count: 41, icon: "Soup", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80" },
      { id: "papad", name: "Papad", count: 33, icon: "Cookie", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80" },
      { id: "food-products", name: "Food products", count: 58, icon: "Package", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80" },
      { id: "local-products", name: "Local products", count: 47, icon: "ShoppingBag", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80" },
    ],
  },
  {
    id: "community",
    title: "Community services",
    blurb: "Seasonal and shared work that keeps the village running.",
    services: [
      { id: "agriculture-assist", name: "Agricultural assistance", count: 112, icon: "Sprout", image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80" },
      { id: "repair", name: "Repair services", count: 95, icon: "Settings", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80" },
      { id: "event-assist", name: "Event assistance", count: 61, icon: "PartyPopper", image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80" },
      { id: "logistics", name: "Local logistics", count: 44, icon: "Package2", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80" },
      { id: "seasonal", name: "Seasonal work", count: 79, icon: "CalendarDays", image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80" },
    ],
  },
];

export const allServices = serviceCategories.flatMap((c) =>
  c.services.map((s) => ({ ...s, category: c.id, categoryTitle: c.title }))
);

export const workers = [
  {
    id: "ramesh-kumar",
    name: "Ramesh Kumar",
    role: "Carpenter",
    village: "Sonipur",
    distanceKm: 2.5,
    rating: 4.7,
    completedJobs: 127,
    experienceYears: 8,
    price: 500,
    priceUnit: "day",
    availability: "Mon - Sat, 8 AM - 6 PM",
    skills: ["Furniture Repair", "Woodwork", "Door Repair", "Interior Work"],
    languages: ["Hindi", "English"],
    verified: { phone: true, skill: true, shg: false },
    shgId: null,
    photo: "carpenter portrait rural india",
    bio: "Eight years fixing and building furniture for homes across Sonipur block. Trained under a government carpentry programme in 2018.",
  },
  {
    id: "sunita-devi",
    name: "Sunita Devi",
    role: "Tailor",
    village: "Rampura",
    distanceKm: 1.2,
    rating: 4.9,
    completedJobs: 203,
    experienceYears: 11,
    price: 350,
    priceUnit: "piece",
    availability: "Mon - Sun, 9 AM - 7 PM",
    skills: ["Blouse Stitching", "Alterations", "Embroidery", "School Uniforms"],
    languages: ["Hindi", "Bhojpuri"],
    verified: { phone: true, skill: true, shg: true },
    shgId: "maa-lakshmi-shg",
    photo: "woman tailor rural india",
    bio: "Runs a small tailoring corner from home and takes bulk uniform orders through the Maa Lakshmi SHG.",
  },
  {
    id: "irfan-ali",
    name: "Irfan Ali",
    role: "Electrician",
    village: "Sonipur",
    distanceKm: 3.8,
    rating: 4.5,
    completedJobs: 94,
    experienceYears: 6,
    price: 450,
    priceUnit: "day",
    availability: "Mon - Sat, 7 AM - 5 PM",
    skills: ["Wiring", "Fan & Light Fitting", "Motor Repair", "Solar Panels"],
    languages: ["Hindi", "Urdu"],
    verified: { phone: true, skill: true, shg: false },
    shgId: null,
    photo: "electrician rural india",
    bio: "Certified for household and solar wiring, Irfan has worked on 90+ homes across three villages.",
  },
  {
    id: "geeta-yadav",
    name: "Geeta Yadav",
    role: "Cook & Caterer",
    village: "Bhagwanpur",
    distanceKm: 4.1,
    rating: 4.8,
    completedJobs: 156,
    experienceYears: 9,
    price: 250,
    priceUnit: "plate",
    availability: "Fri - Sun, 6 AM - 9 PM",
    skills: ["Bulk Cooking", "Festival Catering", "Local Sweets"],
    languages: ["Hindi"],
    verified: { phone: true, skill: false, shg: true },
    shgId: "annapurna-shg",
    photo: "woman cook rural india catering",
    bio: "Leads catering orders for weddings and community events through the Annapurna SHG kitchen.",
  },
  {
    id: "mahesh-patil",
    name: "Mahesh Patil",
    role: "Farm Labourer",
    village: "Devgaon",
    distanceKm: 5.4,
    rating: 4.4,
    completedJobs: 68,
    experienceYears: 14,
    price: 400,
    priceUnit: "day",
    availability: "Seasonal",
    skills: ["Harvesting", "Sowing", "Irrigation Setup"],
    languages: ["Marathi", "Hindi"],
    verified: { phone: true, skill: false, shg: false },
    shgId: null,
    photo: "farmer rural india field",
    bio: "Available for seasonal harvest and sowing work across Devgaon and nearby farms.",
  },
  {
    id: "lata-more",
    name: "Lata More",
    role: "Handicraft Artisan",
    village: "Rampura",
    distanceKm: 1.9,
    rating: 4.9,
    completedJobs: 112,
    experienceYears: 7,
    price: 600,
    priceUnit: "order",
    availability: "Mon - Sat, 10 AM - 5 PM",
    skills: ["Bamboo Craft", "Pottery", "Home Decor"],
    languages: ["Hindi", "Marathi"],
    verified: { phone: true, skill: true, shg: true },
    shgId: "maa-lakshmi-shg",
    photo: "woman artisan handicraft india",
    bio: "Makes bamboo and clay home decor pieces sold through local exhibitions and the SHG storefront.",
  },
];

export const shgs = [
  {
    id: "maa-lakshmi-shg",
    name: "Maa Lakshmi Women SHG",
    village: "Rampura",
    members: 18,
    earnings: 180000,
    orders: 127,
    rating: 4.9,
    services: ["Tailoring", "Catering", "Handicrafts", "Pickles", "Papad"],
    verified: true,
    description:
      "Formed in 2016, Maa Lakshmi SHG runs a shared tailoring and handicraft unit that supplies schools, local shops and exhibitions across the block.",
    photo: "women self help group india meeting",
  },
  {
    id: "annapurna-shg",
    name: "Annapurna Kitchen SHG",
    village: "Bhagwanpur",
    members: 12,
    earnings: 96000,
    orders: 84,
    rating: 4.8,
    services: ["Catering", "Food Products", "Pickles"],
    verified: true,
    description:
      "A community kitchen collective that caters weddings, festivals and school midday meals across four panchayats.",
    photo: "women cooking community kitchen india",
  },
  {
    id: "surya-shg",
    name: "Surya Handicrafts SHG",
    village: "Devgaon",
    members: 22,
    earnings: 145000,
    orders: 103,
    rating: 4.7,
    services: ["Handicrafts", "Local Products", "Home Decor"],
    verified: false,
    description:
      "Weaves bamboo and jute products, selling through local haats and an expanding online presence.",
    photo: "handicraft weaving women india",
  },
];

export const testimonials = [
  {
    quote:
      "Earlier customers only came through word of mouth. Karya helped people find our SHG's tailoring work much more easily.",
    name: "Sunita Devi",
    role: "SHG Member, Rampura",
  },
  {
    quote:
      "I can now find a nearby electrician without asking five people in the village first.",
    name: "Arvind Sharma",
    role: "Customer, Sonipur",
  },
  {
    quote:
      "The interface is simple enough that even the older workers in our group use it without help.",
    name: "Fatima Sheikh",
    role: "Community Partner",
  },
];

export const impactMetrics = [
  { value: "+247%", label: "Increase in local job opportunities" },
  { value: "3,120+", label: "New customer connections" },
  { value: "180%", label: "Growth in SHG orders" },
  { value: "2.6X", label: "Increase in worker earnings" },
];

export const resources = [
  {
    id: "understanding-shgs",
    category: "SHGs",
    title: "What is a Self-Help Group, really?",
    description: "A plain-language guide to how SHGs form, function and grow income for their members.",
    image: "women group meeting india",
  },
  {
    id: "digital-literacy-basics",
    category: "Digital Literacy",
    title: "Getting comfortable with a smartphone at work",
    description: "Simple habits that help first-time smartphone users trust and use apps like Karya.",
    image: "rural india smartphone learning",
  },
  {
    id: "rural-employment-schemes",
    category: "Rural Employment",
    title: "Government schemes worth knowing about",
    description: "A short overview of employment and skilling schemes available to rural workers.",
    image: "rural india worker documents",
  },
  {
    id: "pricing-your-work",
    category: "Financial Awareness",
    title: "How to price your work fairly",
    description: "A practical framework for setting rates that reflect skill, time and material cost.",
    image: "worker calculating india",
  },
  {
    id: "community-story-lata",
    category: "Community Stories",
    title: "From spare-time craft to steady income",
    description: "How one artisan turned a hobby into a dependable source of household income.",
    image: "artisan working india",
  },
  {
    id: "local-business-growth",
    category: "Local Business",
    title: "Growing a small local business without a shopfront",
    description: "Ways local sellers are reaching more customers without renting a physical shop.",
    image: "local market seller india",
  },
];

export const projects = [
  {
    id: "rampura-tailoring-unit",
    category: "SHG Growth",
    community: "Rampura",
    title: "A shared tailoring unit finds steady customers",
    challenge: "Maa Lakshmi SHG's tailoring work depended entirely on word of mouth within Rampura.",
    solution: "Listed their services on Karya with real turnaround times and sample work photos.",
    result: "Orders grew from neighbouring villages, adding roughly ₹40,000 in monthly group revenue.",
    image: "tailoring unit india women",
  },
  {
    id: "sonipur-worker-network",
    category: "Worker Income",
    community: "Sonipur",
    title: "Carpenters and electricians fill their off-season gaps",
    challenge: "Skilled workers in Sonipur often sat idle between the farming season's peak work windows.",
    solution: "Verified profiles let customers from three nearby villages find and book them directly.",
    result: "Average monthly bookings per worker rose noticeably during the off-season.",
    image: "carpenter workshop india",
  },
  {
    id: "bhagwanpur-catering",
    category: "Community Services",
    community: "Bhagwanpur",
    title: "A community kitchen scales up for festival season",
    challenge: "Annapurna SHG struggled to take group orders for weddings without a booking system.",
    solution: "Used Karya's group order and scheduling tools to manage overlapping requests.",
    result: "Handled a record number of festival-season bookings without missed dates.",
    image: "festival catering india",
  },
];

export const matchingWeights = {
  location: 0.3,
  skill: 0.3,
  availability: 0.2,
  rating: 0.1,
  price: 0.1,
};
