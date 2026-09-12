import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users, Users2, UserCheck, Settings2, Package, Lightbulb,
  MessageSquare, IndianRupee, PhoneCall, ShieldCheck, CheckCircle2,
  XCircle, Clock, AlertTriangle, TrendingUp, ArrowRight, Sparkles,
  RefreshCw, Download, Filter, MapPin, Activity, Award, Search,
  X, ChevronDown, Check, Phone, Eye, Building2, ExternalLink
} from "lucide-react";
import { useToast } from "../hooks/useToast";
import AdminModal from "../components/ui/AdminModal";
import {
  INDIA_STATES,
  INDIA_UNION_TERRITORIES,
  INDIA_STATES_AND_UTS,
  INDIA_DISTRICTS_BY_STATE,
  CURATED_ZONES_AND_VILLAGES,
  getDistrictsForState,
  getZonesForDistrict,
  getVillagesForZone,
} from "../data/indiaGeoData";

// Seed dataset for search and geographic calculations across various Indian states
const ALL_DIRECTORY = [
  // Maharashtra
  { id: "w-1", name: "Ramesh Kumar", type: "Worker", role: "Carpenter", phone: "+91 98765 43210", state: "Maharashtra", district: "Chhatrapati Sambhajinagar (Aurangabad)", zone: "Sonipur Block", village: "Sonipur Farm Belt", rating: 4.7, status: "Active", kyc: "Verified", earnings: 45000 },
  { id: "w-2", name: "Sunita Devi", type: "Worker", role: "Master Tailor", phone: "+91 98765 43211", state: "Maharashtra", district: "Nashik", zone: "Rampur Block", village: "Rampura Market", rating: 4.9, status: "Active", kyc: "Verified", earnings: 58000 },
  { id: "w-3", name: "Irfan Ali", type: "Worker", role: "Electrician", phone: "+91 98765 43212", state: "Maharashtra", district: "Chhatrapati Sambhajinagar (Aurangabad)", zone: "Sonipur Block", village: "Sonipur Gaon", rating: 4.5, status: "Active", kyc: "Verified", earnings: 38000 },
  { id: "w-4", name: "Mahesh Patil", type: "Worker", role: "Solar Electrician", phone: "+91 98765 43213", state: "Maharashtra", district: "Nashik", zone: "Rampur Block", village: "Rampur East", rating: 4.8, status: "Active", kyc: "Pending Audit", earnings: 52000 },
  { id: "w-5", name: "Lata More", type: "Worker", role: "Handicraft Artisan", phone: "+91 98765 43214", state: "Maharashtra", district: "Nashik", zone: "Rampur Block", village: "Rampura Market", rating: 4.9, status: "Active", kyc: "Verified", earnings: 32000 },
  { id: "w-6", name: "Pooja Sharma", type: "Worker", role: "Stitching Artisan", phone: "+91 98765 43215", state: "Maharashtra", district: "Pune", zone: "Devgaon Cluster", village: "Devgaon East", rating: 4.9, status: "Active", kyc: "Pending Audit", earnings: 28000 },
  { id: "w-7", name: "Balu Shinde", type: "Worker", role: "Agri Technician", phone: "+91 98765 43216", state: "Maharashtra", district: "Pune", zone: "Devgaon Cluster", village: "Devgaon Main", rating: 4.6, status: "Active", kyc: "Verified", earnings: 41000 },
  { id: "w-8", name: "Govind Rathod", type: "Worker", role: "Mason / Mistri", phone: "+91 98765 43217", state: "Maharashtra", district: "Amravati", zone: "Bhagwanpur Tehsil", village: "Bhagwanpur Gaon", rating: 4.4, status: "Active", kyc: "Verified", earnings: 36000 },
  { id: "w-9", name: "Dnyaneshwar Gaikwad", type: "Worker", role: "Plumber", phone: "+91 98765 43218", state: "Maharashtra", district: "Nagpur", zone: "Ramtek Block", village: "Ramtek Gaon", rating: 4.7, status: "Active", kyc: "Verified", earnings: 42000 },

  // Uttar Pradesh
  { id: "w-10", name: "Kanhaiya Lal Maurya", type: "Worker", role: "Weaver / Handloom", phone: "+91 94150 11223", state: "Uttar Pradesh", district: "Varanasi", zone: "Kashi Rural", village: "Rameshwar Gram", rating: 4.8, status: "Active", kyc: "Verified", earnings: 51000 },
  { id: "w-11", name: "Shivprasad Yadav", type: "Worker", role: "Electrician", phone: "+91 94150 11224", state: "Uttar Pradesh", district: "Gorakhpur", zone: "Pipraich Zone", village: "Pipraich Gaon", rating: 4.6, status: "Active", kyc: "Verified", earnings: 39000 },
  { id: "w-12", name: "Ram Chandra Verma", type: "Worker", role: "Tractor & Pump Repair", phone: "+91 94150 11225", state: "Uttar Pradesh", district: "Varanasi", zone: "Pindra Block", village: "Pindra Gaon", rating: 4.7, status: "Active", kyc: "Pending Audit", earnings: 44000 },

  // Bihar
  { id: "w-13", name: "Manoj Paswan", type: "Worker", role: "Mason / Mistri", phone: "+91 99340 77881", state: "Bihar", district: "Patna", zone: "Danapur Block", village: "Danapur Cantt Rural", rating: 4.6, status: "Active", kyc: "Verified", earnings: 37000 },
  { id: "w-14", name: "Rakesh Ranjan", type: "Worker", role: "Welder / Fabricator", phone: "+91 99340 77882", state: "Bihar", district: "Patna", zone: "Bihta Block", village: "Bihta Gram", rating: 4.8, status: "Active", kyc: "Verified", earnings: 48000 },

  // Madhya Pradesh
  { id: "w-15", name: "Kamal Kishore Dangi", type: "Worker", role: "Dairy Equipment Tech", phone: "+91 98260 55441", state: "Madhya Pradesh", district: "Bhopal", zone: "Berasia Block", village: "Berasia Gaon", rating: 4.5, status: "Active", kyc: "Verified", earnings: 35000 },
  { id: "w-16", name: "Shyamlal Meena", type: "Worker", role: "Carpenter", phone: "+91 98260 55442", state: "Madhya Pradesh", district: "Bhopal", zone: "Phanda Block", village: "Phanda Rural", rating: 4.7, status: "Active", kyc: "Verified", earnings: 41000 },

  // Gujarat
  { id: "w-17", name: "Bhavesh Patel", type: "Worker", role: "Solar Pump Technician", phone: "+91 98250 33221", state: "Gujarat", district: "Anand", zone: "Petlad Block", village: "Sunav", rating: 4.9, status: "Active", kyc: "Verified", earnings: 62000 },
  { id: "w-18", name: "Dharmendra Solanki", type: "Worker", role: "Motor Rewinding", phone: "+91 98250 33222", state: "Gujarat", district: "Anand", zone: "Borsad Block", village: "Borsad Rural", rating: 4.7, status: "Active", kyc: "Verified", earnings: 46000 },

  // Rajasthan
  { id: "w-19", name: "Bhanwar Singh Shekhawat", type: "Worker", role: "Stone Carving Artisan", phone: "+91 94140 88991", state: "Rajasthan", district: "Jaipur", zone: "Amer Block", village: "Amer Gaon", rating: 4.9, status: "Active", kyc: "Verified", earnings: 56000 },
  { id: "w-20", name: "Santosh Meena", type: "Worker", role: "Borewell Technician", phone: "+91 94140 88992", state: "Rajasthan", district: "Jaipur", zone: "Sanganer Block", village: "Sanganer Rural", rating: 4.6, status: "Active", kyc: "Verified", earnings: 43000 },

  // Karnataka
  { id: "w-21", name: "Manjunath Gowda", type: "Worker", role: "Silk Weaver & Artisan", phone: "+91 98450 11441", state: "Karnataka", district: "Bengaluru Rural", zone: "Devanahalli Block", village: "Devanahalli Gaothan", rating: 4.8, status: "Active", kyc: "Verified", earnings: 53000 },

  // Tamil Nadu
  { id: "w-22", name: "K. Murugan", type: "Worker", role: "Coir & Loom Craftsman", phone: "+91 94430 22331", state: "Tamil Nadu", district: "Coimbatore", zone: "Pollachi North", village: "Achipatti", rating: 4.9, status: "Active", kyc: "Verified", earnings: 50000 },

  // West Bengal
  { id: "w-23", name: "Bikram Tamang", type: "Worker", role: "Tea Plantation Carpenter", phone: "+91 94340 66771", state: "West Bengal", district: "Darjeeling", zone: "Kurseong Block", village: "Tindharia", rating: 4.7, status: "Active", kyc: "Verified", earnings: 42000 },

  // Jammu and Kashmir
  { id: "w-24", name: "Ghulam Hassan Lone", type: "Worker", role: "Pashmina & Woodcraft", phone: "+91 94190 44551", state: "Jammu and Kashmir", district: "Srinagar", zone: "Dal Rural Cluster", village: "Harwan Gram", rating: 4.9, status: "Active", kyc: "Verified", earnings: 65000 },

  // SHGs
  { id: "shg-1", name: "Maa Lakshmi Women SHG", type: "SHG Group", leader: "Radha Devi", phone: "+91 94230 81000", state: "Maharashtra", district: "Nashik", zone: "Rampur Block", village: "Rampura Market", members: 18, revenue: 180000, trade: "Tailoring, Pickles & Handloom", kyc: "Verified" },
  { id: "shg-2", name: "Annapurna Kitchen SHG", type: "SHG Group", leader: "Meena Bai", phone: "+91 94230 81001", state: "Maharashtra", district: "Amravati", zone: "Bhagwanpur Tehsil", village: "Bhagwanpur Gaon", members: 12, revenue: 96000, trade: "Catering & Millet Products", kyc: "Verified" },
  { id: "shg-3", name: "Surya Handicrafts Collective", type: "SHG Group", leader: "Geeta Tai Gaikwad", phone: "+91 98812 34509", state: "Maharashtra", district: "Pune", zone: "Devgaon Cluster", village: "Devgaon Main", members: 22, revenue: 245000, trade: "Terracotta & Bamboo Crafts", kyc: "Pending Audit" },
  { id: "shg-4", name: "Gramin Shramik Federation", type: "SHG Group", leader: "Laxmi Bai Shinde", phone: "+91 97654 99012", state: "Maharashtra", district: "Chhatrapati Sambhajinagar (Aurangabad)", zone: "Sonipur Block", village: "Sonipur Gaon", members: 16, revenue: 162000, trade: "Amla Pickles & Millets", kyc: "Pending Audit" },
  { id: "shg-5", name: "Ganga Kaveri Mahila Samiti", type: "SHG Group", leader: "Kunti Devi", phone: "+91 94150 99881", state: "Uttar Pradesh", district: "Varanasi", zone: "Kashi Rural", village: "Rameshwar Gram", members: 20, revenue: 210000, trade: "Banarasi Zari & Organic Jaggery", kyc: "Verified" },
  { id: "shg-6", name: "Magadh Pragati SHG", type: "SHG Group", leader: "Shanti Devi", phone: "+91 99340 11229", state: "Bihar", district: "Patna", zone: "Bihta Block", village: "Bihta Gram", members: 14, revenue: 145000, trade: "Sikki Grass Crafts & Papads", kyc: "Verified" },
  { id: "shg-7", name: "Narmada Vikas SHG Mandali", type: "SHG Group", leader: "Kokila Ben", phone: "+91 98250 88771", state: "Gujarat", district: "Anand", zone: "Petlad Block", village: "Sunav", members: 15, revenue: 195000, trade: "Dairy Processing & Khakhra", kyc: "Verified" },
  { id: "shg-8", name: "Marwar Gramin Mahila Mandal", type: "SHG Group", leader: "Kaushalya Kanwar", phone: "+91 94140 33441", state: "Rajasthan", district: "Jaipur", zone: "Amer Block", village: "Amer Gaon", members: 24, revenue: 270000, trade: "Block Printing & Blue Pottery", kyc: "Verified" },

  // Customers
  { id: "cust-1", name: "Vikram Deshmukh", type: "Customer", phone: "+91 98220 44512", email: "vikram.d@gmail.com", state: "Maharashtra", district: "Pune", zone: "Devgaon Cluster", village: "Devgaon Main", bookings: 14, spent: 12450, status: "Active" },
  { id: "cust-2", name: "Anita Kumari Roy", type: "Customer", phone: "+91 97110 33490", email: "anita.roy@villagepost.in", state: "Maharashtra", district: "Nashik", zone: "Rampur Block", village: "Rampur Block 2", bookings: 8, spent: 4800, status: "Active" },
  { id: "cust-3", name: "Gramin Shala Vidyalaya (Headmaster Sharma)", type: "Customer", phone: "+91 94140 22001", email: "shala.devgaon@edu.gov.in", state: "Maharashtra", district: "Pune", zone: "Devgaon Cluster", village: "Devgaon Main", bookings: 26, spent: 48200, status: "Active" },
  { id: "cust-4", name: "Sanjay Borse", type: "Customer", phone: "+91 98901 77218", email: "borse.agri@outlook.com", state: "Maharashtra", district: "Chhatrapati Sambhajinagar (Aurangabad)", zone: "Sonipur Block", village: "Sonipur Farm Belt", bookings: 19, spent: 16800, status: "Active" },
  { id: "cust-5", name: "Kashi Rural Health Clinic (Dr. Pandey)", type: "Customer", phone: "+91 94150 44332", email: "clinic.kashi@health.up.gov.in", state: "Uttar Pradesh", district: "Varanasi", zone: "Kashi Rural", village: "Rameshwar Gram", bookings: 31, spent: 54000, status: "Active" },
  { id: "cust-6", name: "Bihta Agro Industries Ltd", type: "Customer", phone: "+91 99340 66554", email: "procure@bihtaagro.com", state: "Bihar", district: "Patna", zone: "Bihta Block", village: "Bihta Gram", bookings: 42, spent: 89000, status: "Active" },
  { id: "cust-7", name: "Sunav Cooperative Dairy Society", type: "Customer", phone: "+91 98250 99112", email: "contact@sunavdairy.coop", state: "Gujarat", district: "Anand", zone: "Petlad Block", village: "Sunav", bookings: 38, spent: 76000, status: "Active" },
  { id: "cust-8", name: "Amer Heritage Rural Homestay", type: "Customer", phone: "+91 94140 55667", email: "stay@amerheritage.in", state: "Rajasthan", district: "Jaipur", zone: "Amer Block", village: "Amer Gaon", bookings: 22, spent: 39500, status: "Active" },
];

export default function AdminDashboard() {
  const toast = useToast();

  // Location Filter State: State/UT -> District -> Zone/Block -> Village/Gram Panchayat
  const [selectedState, setSelectedState] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedZone, setSelectedZone] = useState("all");
  const [selectedVillage, setSelectedVillage] = useState("all");

  // Free-form Village / Panchayat Direct Search State
  const [villageSearchInput, setVillageSearchInput] = useState("");

  // Universal Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedProfileModal, setSelectedProfileModal] = useState(null);
  const searchContainerRef = useRef(null);

  // Close search popover on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // System Gateways
  const [toggles, setToggles] = useState({
    emergencySMS: true,
    autoMatching: true,
    offlineCache: true,
    zeroCommissionPledge: true,
  });

  // Verification Desk Queue (spans multiple states)
  const [verifications, setVerifications] = useState([
    { id: "v1", name: "Surya Handicrafts Collective", type: "SHG Group", state: "Maharashtra", district: "Pune", zone: "Devgaon Cluster", village: "Devgaon Main", doc: "Cluster Reg #MH-881", status: "pending", time: "10 mins ago" },
    { id: "v2", name: "Mahesh Patil", type: "Electrician / Solar", state: "Maharashtra", district: "Nashik", zone: "Rampur Block", village: "Rampur East", doc: "ITI Wireman Certificate", status: "pending", time: "25 mins ago" },
    { id: "v3", name: "Pooja Sharma", type: "Master Tailoring Artisan", state: "Maharashtra", district: "Pune", zone: "Devgaon Cluster", village: "Devgaon East", doc: "PMKVY Level 3 Skill Card", status: "pending", time: "1 hour ago" },
    { id: "v4", name: "Gramin Shramik Federation", type: "SHG Group", state: "Maharashtra", district: "Chhatrapati Sambhajinagar (Aurangabad)", zone: "Sonipur Block", village: "Sonipur Gaon", doc: "NABARD Cooperative Link", status: "pending", time: "3 hours ago" },
    { id: "v5", name: "Ram Chandra Verma", type: "Tractor & Pump Repair", state: "Uttar Pradesh", district: "Varanasi", zone: "Pindra Block", village: "Pindra Gaon", doc: "National Apprenticeship Cert", status: "pending", time: "4 hours ago" },
    { id: "v6", name: "Marwar Gramin Mahila Mandal", type: "SHG Group", state: "Rajasthan", district: "Jaipur", zone: "Amer Block", village: "Amer Gaon", doc: "Rajasthan State NRLM Registry", status: "pending", time: "5 hours ago" },
  ]);

  // Derived Location Options using the complete India geographic dataset
  const stateOptions = INDIA_STATES_AND_UTS;

  const districtOptions = useMemo(() => {
    if (selectedState === "all") return [];
    return getDistrictsForState(selectedState);
  }, [selectedState]);

  const zoneOptions = useMemo(() => {
    if (selectedDistrict === "all") return [];
    return getZonesForDistrict(selectedDistrict);
  }, [selectedDistrict]);

  const villageOptions = useMemo(() => {
    if (selectedDistrict === "all") return [];
    return getVillagesForZone(selectedDistrict, selectedZone);
  }, [selectedDistrict, selectedZone]);

  // Handle Location Cascade Changes
  const handleStateChange = (val) => {
    setSelectedState(val);
    setSelectedDistrict("all");
    setSelectedZone("all");
    setSelectedVillage("all");
    setVillageSearchInput("");
    if (val !== "all") {
      const isUT = INDIA_UNION_TERRITORIES.includes(val);
      toast.info(`Filtered view by ${isUT ? "Union Territory" : "State"}: ${val}`);
    }
  };

  const handleDistrictChange = (val) => {
    setSelectedDistrict(val);
    setSelectedZone("all");
    setSelectedVillage("all");
    setVillageSearchInput("");
    if (val !== "all") toast.info(`Filtered view by District: ${val}`);
  };

  const handleZoneChange = (val) => {
    setSelectedZone(val);
    setSelectedVillage("all");
    setVillageSearchInput("");
    if (val !== "all") toast.info(`Filtered view by Block / Zone: ${val}`);
  };

  const handleVillageChange = (val) => {
    setSelectedVillage(val);
    setVillageSearchInput(val === "all" ? "" : val);
    if (val !== "all") toast.info(`Filtered view by Village: ${val}`);
  };

  const handleDirectVillageSearch = (customVal) => {
    setVillageSearchInput(customVal);
    if (customVal.trim().length > 0) {
      setSelectedVillage(customVal.trim());
    } else {
      setSelectedVillage("all");
    }
  };

  const handleResetLocation = () => {
    setSelectedState("all");
    setSelectedDistrict("all");
    setSelectedZone("all");
    setSelectedVillage("all");
    setVillageSearchInput("");
    toast.info("Location filters reset to All India (36 States & UTs)");
  };

  // Filter Directory by Location
  const locationFilteredDirectory = useMemo(() => {
    return ALL_DIRECTORY.filter((item) => {
      if (selectedState !== "all") {
        const itemStateMatch = item.state === selectedState || item.state.includes(selectedState) || selectedState.includes(item.state);
        if (!itemStateMatch) return false;
      }
      if (selectedDistrict !== "all") {
        const itemDistMatch = item.district === selectedDistrict || item.district.includes(selectedDistrict) || selectedDistrict.includes(item.district);
        if (!itemDistMatch) return false;
      }
      if (selectedZone !== "all") {
        const itemZoneMatch = item.zone === selectedZone || item.zone.toLowerCase().includes(selectedZone.toLowerCase());
        if (!itemZoneMatch) return false;
      }
      if (selectedVillage !== "all") {
        const itemVillageMatch = item.village.toLowerCase().includes(selectedVillage.toLowerCase()) || selectedVillage.toLowerCase().includes(item.village.toLowerCase());
        if (!itemVillageMatch) return false;
      }
      return true;
    });
  }, [selectedState, selectedDistrict, selectedZone, selectedVillage]);

  // Dynamic Metrics Calculation according to the selected geographic scope
  const locationMetrics = useMemo(() => {
    const isFiltered = selectedState !== "all" || selectedDistrict !== "all" || selectedZone !== "all" || selectedVillage !== "all";

    if (!isFiltered) {
      return {
        workersCount: "2,548",
        verifiedRate: "94.2%",
        shgCount: "354",
        shgPanchayats: "Across 780+ Districts & All 36 States/UTs",
        customersCount: "18,420",
        payoutsVolume: "₹42.8 Lakh",
      };
    }

    const workers = locationFilteredDirectory.filter((i) => i.type === "Worker");
    const shgs = locationFilteredDirectory.filter((i) => i.type === "SHG Group");
    const customers = locationFilteredDirectory.filter((i) => i.type === "Customer");

    // Dynamic scaling based on geographic depth
    let workerCount = 0;
    let shgGroupCount = 0;
    let customerCount = 0;
    let payoutsNum = 0;
    let sublabel = "";

    if (selectedVillage !== "all") {
      // Village level
      workerCount = Math.max(workers.length * 4, 18);
      shgGroupCount = Math.max(shgs.length * 2, 3);
      customerCount = Math.max(customers.length * 15, 84);
      payoutsNum = 1.6 + (workers.length * 0.4);
      sublabel = `Gram Panchayat: ${selectedVillage}`;
    } else if (selectedZone !== "all") {
      // Zone / Block level
      workerCount = Math.max(workers.length * 12, 46);
      shgGroupCount = Math.max(shgs.length * 4, 9);
      customerCount = Math.max(customers.length * 45, 290);
      payoutsNum = 3.8 + (workers.length * 0.8);
      sublabel = `${villageOptions.length || 5} Gram Panchayats in ${selectedZone}`;
    } else if (selectedDistrict !== "all") {
      // District level
      workerCount = Math.max(workers.length * 28, 142);
      shgGroupCount = Math.max(shgs.length * 8, 24);
      customerCount = Math.max(customers.length * 110, 890);
      payoutsNum = 8.4 + (workers.length * 1.5);
      sublabel = `${zoneOptions.length || 5} Blocks in ${selectedDistrict}`;
    } else {
      // State / UT level
      const isUT = INDIA_UNION_TERRITORIES.includes(selectedState);
      workerCount = isUT ? 120 : Math.max(workers.length * 65, 520);
      shgGroupCount = isUT ? 18 : Math.max(shgs.length * 16, 78);
      customerCount = isUT ? 780 : Math.max(customers.length * 260, 3650);
      payoutsNum = isUT ? 4.2 : 16.5 + (workers.length * 2.2);
      sublabel = `${districtOptions.length} Official Districts in ${selectedState}`;
    }

    return {
      workersCount: workerCount.toLocaleString("en-IN"),
      verifiedRate: "96.4%",
      shgCount: shgGroupCount.toLocaleString("en-IN"),
      shgPanchayats: sublabel,
      customersCount: customerCount.toLocaleString("en-IN"),
      payoutsVolume: `₹${payoutsNum.toFixed(1)} Lakh`,
    };
  }, [locationFilteredDirectory, selectedState, selectedDistrict, selectedZone, selectedVillage, districtOptions, zoneOptions, villageOptions]);

  // Filter Verification Queue by Location
  const filteredVerifications = useMemo(() => {
    return verifications.filter((v) => {
      if (selectedState !== "all") {
        const match = v.state === selectedState || v.state.includes(selectedState) || selectedState.includes(v.state);
        if (!match) return false;
      }
      if (selectedDistrict !== "all") {
        const match = v.district === selectedDistrict || v.district.includes(selectedDistrict) || selectedDistrict.includes(v.district);
        if (!match) return false;
      }
      if (selectedZone !== "all") {
        const match = v.zone === selectedZone || v.zone.toLowerCase().includes(selectedZone.toLowerCase());
        if (!match) return false;
      }
      if (selectedVillage !== "all") {
        const match = v.village.toLowerCase().includes(selectedVillage.toLowerCase()) || selectedVillage.toLowerCase().includes(v.village.toLowerCase());
        if (!match) return false;
      }
      return true;
    });
  }, [verifications, selectedState, selectedDistrict, selectedZone, selectedVillage]);

  // Universal Search Matches
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return [];
    const q = searchQuery.toLowerCase().trim();

    return ALL_DIRECTORY.filter((item) => {
      return (
        item.name.toLowerCase().includes(q) ||
        item.phone?.includes(q) ||
        item.role?.toLowerCase().includes(q) ||
        item.trade?.toLowerCase().includes(q) ||
        item.village?.toLowerCase().includes(q) ||
        item.zone?.toLowerCase().includes(q) ||
        item.district?.toLowerCase().includes(q) ||
        item.state?.toLowerCase().includes(q) ||
        item.type?.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  const handleVerify = (id, newStatus, name) => {
    setVerifications((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: newStatus } : v))
    );
    if (newStatus === "approved") {
      toast.success(`${name} verified & approved!`);
    } else {
      toast.info(`${name} application marked as rejected.`);
    }
  };

  const toggleSwitch = (key) => {
    setToggles((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      toast.info(`System setting "${key}" updated`);
      return next;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* 1. Universal Search Bar - Search Directly for Anyone */}
      <div className="relative" ref={searchContainerRef}>
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-olive-700 dark:text-olive-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            placeholder="🔍 Universal Directory Search: Find anyone directly (Workers, SHGs, Customers, Trade, Phone, Village, State)..."
            className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white dark:bg-dark-card border-2 border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text placeholder:text-charcoal/45 dark:placeholder:text-dark-muted text-xs sm:text-sm font-medium shadow-xs focus:outline-none focus:border-olive-600 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSearchOpen(false);
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal dark:hover:text-dark-text p-1"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Live Search Instant Results Popover */}
        {searchOpen && searchQuery.trim().length >= 2 && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-dark-card rounded-2xl border border-charcoal/15 dark:border-dark-border shadow-2xl z-50 overflow-hidden max-h-96 overflow-y-auto">
            <div className="p-3 bg-charcoal/5 dark:bg-dark-bg/60 border-b border-charcoal/10 dark:border-dark-border flex items-center justify-between text-xs">
              <span className="font-bold text-charcoal dark:text-dark-text">
                Universal Directory Matches ({searchResults.length})
              </span>
              <span className="text-[11px] text-charcoal/50 dark:text-dark-muted">
                Press Esc or click outside to close
              </span>
            </div>

            {searchResults.length === 0 ? (
              <div className="p-6 text-center text-xs text-charcoal/50 dark:text-dark-muted">
                No matching records found for "{searchQuery}".
              </div>
            ) : (
              <div className="divide-y divide-charcoal/5 dark:divide-dark-border text-xs">
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedProfileModal(item);
                      setSearchOpen(false);
                    }}
                    className="p-3.5 hover:bg-olive-50/50 dark:hover:bg-dark-bg/40 flex items-center justify-between gap-3 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                          item.type === "Worker"
                            ? "bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300"
                            : item.type === "SHG Group"
                            ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                            : "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
                        }`}
                      >
                        {item.type === "Worker" ? "👷" : item.type === "SHG Group" ? "👥" : "🧑"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-charcoal dark:text-dark-text sm:text-sm">
                            {item.name}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-charcoal/5 dark:bg-dark-bg text-charcoal/70 dark:text-dark-muted">
                            {item.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-charcoal/60 dark:text-dark-muted mt-0.5">
                          {item.role || item.trade || "Customer"} · 📍 {item.village}, {item.district} ({item.state}) · 📞 {item.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-olive-700 dark:text-olive-400 font-bold text-xs flex items-center gap-1">
                        <span>Profile</span>
                        <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Geographic Filter: State, District, Zone, Village & Search bar */}
      <div className="bg-cream-card dark:bg-dark-card p-4 sm:p-5 rounded-2xl border border-charcoal/10 dark:border-dark-border shadow-xs space-y-3">
        {/* 4 Dropdowns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-xs font-semibold text-charcoal/70 dark:text-dark-muted mb-1">
              State
            </label>
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text font-medium focus:outline-none focus:border-olive-600 text-xs cursor-pointer"
            >
              <option value="all">All States</option>
              {INDIA_STATES_AND_UTS.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal/70 dark:text-dark-muted mb-1">
              District
            </label>
            <select
              value={selectedDistrict}
              disabled={selectedState === "all"}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text font-medium focus:outline-none focus:border-olive-600 disabled:opacity-50 text-xs cursor-pointer"
            >
              <option value="all">All Districts</option>
              {districtOptions.map((dt) => (
                <option key={dt} value={dt}>
                  {dt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal/70 dark:text-dark-muted mb-1">
              Zone
            </label>
            <select
              value={selectedZone}
              disabled={selectedDistrict === "all"}
              onChange={(e) => handleZoneChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text font-medium focus:outline-none focus:border-olive-600 disabled:opacity-50 text-xs cursor-pointer"
            >
              <option value="all">All Zones</option>
              {zoneOptions.map((zn) => (
                <option key={zn} value={zn}>
                  {zn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal/70 dark:text-dark-muted mb-1">
              Village
            </label>
            <select
              value={selectedVillage}
              disabled={selectedZone === "all" && !villageSearchInput}
              onChange={(e) => handleVillageChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text font-medium focus:outline-none focus:border-olive-600 disabled:opacity-50 text-xs cursor-pointer"
            >
              <option value="all">All Villages</option>
              {villageOptions.map((vg) => (
                <option key={vg} value={vg}>
                  {vg}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 dark:text-dark-muted pointer-events-none" />
            <input
              type="text"
              list="pan-india-villages-list"
              value={villageSearchInput}
              onChange={(e) => handleDirectVillageSearch(e.target.value)}
              placeholder="Search..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border text-charcoal dark:text-dark-text placeholder:text-charcoal/40 text-xs font-medium focus:outline-none focus:border-olive-600"
            />
            {villageSearchInput && (
              <button
                type="button"
                onClick={() => handleDirectVillageSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal p-0.5 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
            <datalist id="pan-india-villages-list">
              {villageOptions.map((v, i) => (
                <option key={`opt-${i}`} value={v} />
              ))}
              <option value="Devgaon Main" />
              <option value="Rampura Market" />
              <option value="Sonipur Gaon" />
              <option value="Bhagwanpur Gaon" />
              <option value="Rameshwar Gram" />
              <option value="Bihta Gram" />
              <option value="Sunav" />
              <option value="Amer Gaon" />
              <option value="Harwan Gram" />
              <option value="Achipatti" />
            </datalist>
          </div>

          {(selectedState !== "all" || selectedDistrict !== "all" || selectedZone !== "all" || selectedVillage !== "all") && (
            <button
              type="button"
              onClick={handleResetLocation}
              className="p-2 rounded-xl text-charcoal/60 hover:text-rose-600 dark:text-dark-muted dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
              title="Reset"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* 3. Dynamic Location-Adjusted Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-cream-card dark:bg-dark-card p-4 sm:p-5 rounded-2xl border border-charcoal/10 dark:border-dark-border shadow-xs">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-bold mb-1">
            <span>Rural Workers</span>
            <Users size={16} className="text-olive-700 dark:text-olive-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-extrabold text-charcoal dark:text-dark-text">
            {locationMetrics.workersCount}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            <ShieldCheck size={12} />
            <span>{locationMetrics.verifiedRate} Aadhaar Verified</span>
          </div>
        </div>

        <div className="bg-cream-card dark:bg-dark-card p-4 sm:p-5 rounded-2xl border border-charcoal/10 dark:border-dark-border shadow-xs">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-bold mb-1">
            <span>SHG Groups Active</span>
            <Users2 size={16} className="text-olive-700 dark:text-olive-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-extrabold text-charcoal dark:text-dark-text">
            {locationMetrics.shgCount}
          </div>
          <div className="text-[11px] text-olive-800 dark:text-olive-300 font-semibold mt-1 truncate">
            {locationMetrics.shgPanchayats}
          </div>
        </div>

        <div className="bg-cream-card dark:bg-dark-card p-4 sm:p-5 rounded-2xl border border-charcoal/10 dark:border-dark-border shadow-xs">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-bold mb-1">
            <span>Registered Customers</span>
            <UserCheck size={16} className="text-olive-700 dark:text-olive-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-extrabold text-charcoal dark:text-dark-text">
            {locationMetrics.customersCount}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            Active local buyers
          </div>
        </div>

        <div className="bg-cream-card dark:bg-dark-card p-4 sm:p-5 rounded-2xl border border-charcoal/10 dark:border-dark-border shadow-xs">
          <div className="flex items-center justify-between text-charcoal/60 dark:text-dark-muted text-xs font-bold mb-1">
            <span>Direct Village Payouts</span>
            <IndianRupee size={16} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-extrabold text-olive-900 dark:text-olive-300">
            {locationMetrics.payoutsVolume}
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold mt-1">
            100% Direct (Zero Commission)
          </div>
        </div>
      </div>

      {/* 4. Quick Action Hub / Module Jump Grid */}
      <div className="space-y-3">
        <h2 className="font-display text-lg font-bold text-charcoal dark:text-dark-text">
          Management Modules
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { to: "/workers", label: "Workers Desk", count: `${locationMetrics.workersCount} Workers`, icon: Users, color: "text-blue-600" },
            { to: "/shgs", label: "SHG Groups", count: `${locationMetrics.shgCount} Collectives`, icon: Users2, color: "text-emerald-600" },
            { to: "/customers", label: "Customers", count: `${locationMetrics.customersCount} Users`, icon: UserCheck, color: "text-amber-600" },
            { to: "/services", label: "Trade Services", count: "48 Categories", icon: Settings2, color: "text-purple-600" },
            { to: "/products", label: "SHG Catalog", count: "186 Products", icon: Package, color: "text-rose-600" },
            { to: "/suggestions", label: "Suggestions", count: "24 Open", icon: Lightbulb, color: "text-amber-500" },
            { to: "/queries", label: "Grievance Desk", count: "3 Pending", icon: MessageSquare, color: "text-red-500" },
            { to: "/sales", label: "Sales Ledger", count: `${locationMetrics.payoutsVolume} Volume`, icon: IndianRupee, color: "text-emerald-600" },
            { to: "/contact", label: "Contact Tickets", count: "8 Inquiries", icon: PhoneCall, color: "text-indigo-600" },
            { to: "/others", label: "System Controls", count: "Online & Synced", icon: Activity, color: "text-teal-600" },
          ].map((mod, idx) => (
            <Link
              key={idx}
              to={mod.to}
              className="bg-cream-card dark:bg-dark-card rounded-2xl p-4 border border-charcoal/10 dark:border-dark-border hover:border-olive-600 dark:hover:border-olive-400 shadow-2xs hover:shadow-xs transition-all group flex flex-col justify-between cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-white dark:bg-dark-surface flex items-center justify-center border border-charcoal/5 shadow-2xs">
                  <mod.icon size={16} className={mod.color} />
                </div>
                <ArrowRight size={13} className="text-charcoal/30 group-hover:text-olive-700 transition-colors" />
              </div>
              <div>
                <span className="font-bold text-xs sm:text-sm text-charcoal dark:text-dark-text block group-hover:text-olive-800 transition-colors">
                  {mod.label}
                </span>
                <span className="text-[11px] text-charcoal/55 dark:text-dark-muted font-medium block mt-0.5">
                  {mod.count}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 5. Two Column Operational Split: Verification Queue & System Controls */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Verification Queue (Takes 2 Columns) - Filtered by Location */}
        <div className="lg:col-span-2 bg-cream-card dark:bg-dark-card rounded-3xl p-5 sm:p-6 border border-charcoal/10 dark:border-dark-border shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-charcoal/10 dark:border-dark-border">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-olive-700 dark:text-olive-400" />
              <h3 className="font-display text-base sm:text-lg font-bold text-charcoal dark:text-dark-text">
                Pending KYC &amp; Trade Skill Verification ({filteredVerifications.length})
              </h3>
            </div>
            <Link
              to="/workers"
              className="text-xs font-bold text-olive-800 dark:text-olive-300 hover:underline flex items-center gap-1"
            >
              <span>Manage Workers</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="divide-y divide-charcoal/5 dark:divide-dark-border">
            {filteredVerifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-charcoal/50 dark:text-dark-muted">
                No pending verifications in selected location ({selectedVillage !== "all" ? selectedVillage : selectedDistrict !== "all" ? selectedDistrict : selectedState !== "all" ? selectedState : "All India"}).
              </div>
            ) : (
              filteredVerifications.map((item) => (
                <div key={item.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs sm:text-sm text-charcoal dark:text-dark-text">
                        {item.name}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.2 rounded-md bg-olive-100 dark:bg-olive-950 text-olive-800 dark:text-olive-300">
                        {item.type}
                      </span>
                      <span className="text-[10px] text-charcoal/50 dark:text-dark-muted">
                        • {item.time}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal/65 dark:text-dark-muted mt-0.5">
                      📍 {item.village}, {item.district} ({item.state}) · Document: <span className="font-semibold text-charcoal dark:text-dark-text">{item.doc}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    {item.status === "approved" ? (
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-xl">
                        <CheckCircle2 size={14} /> Approved
                      </span>
                    ) : item.status === "rejected" ? (
                      <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 bg-rose-50 dark:bg-rose-950/60 px-3 py-1 rounded-xl">
                        <XCircle size={14} /> Rejected
                      </span>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleVerify(item.id, "rejected", item.name)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200 dark:border-rose-900 cursor-pointer"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => handleVerify(item.id, "approved", item.name)}
                          className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs cursor-pointer"
                        >
                          <CheckCircle2 size={13} />
                          <span>Approve KYC</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* System Policies & Platform Controls (1 Column) */}
        <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-5 sm:p-6 border border-charcoal/10 dark:border-dark-border shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-charcoal/10 dark:border-dark-border">
            <Activity size={18} className="text-olive-700 dark:text-olive-400" />
            <h3 className="font-display text-base sm:text-lg font-bold text-charcoal dark:text-dark-text">
              Platform Gateways
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-dark-surface border border-charcoal/5">
              <div>
                <span className="text-xs font-bold text-charcoal dark:text-dark-text block">
                  Emergency SOS SMS Dispatch
                </span>
                <span className="text-[11px] text-charcoal/60 dark:text-dark-muted">
                  SMS alerts to village workers
                </span>
              </div>
              <button
                type="button"
                onClick={() => toggleSwitch("emergencySMS")}
                className={`w-10 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                  toggles.emergencySMS ? "bg-emerald-600" : "bg-charcoal/30"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    toggles.emergencySMS ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-dark-surface border border-charcoal/5">
              <div>
                <span className="text-xs font-bold text-charcoal dark:text-dark-text block">
                  AI Radius Proximity Matcher
                </span>
                <span className="text-[11px] text-charcoal/60 dark:text-dark-muted">
                  Automatic 10km worker dispatch
                </span>
              </div>
              <button
                type="button"
                onClick={() => toggleSwitch("autoMatching")}
                className={`w-10 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                  toggles.autoMatching ? "bg-emerald-600" : "bg-charcoal/30"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    toggles.autoMatching ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-dark-surface border border-charcoal/5">
              <div>
                <span className="text-xs font-bold text-charcoal dark:text-dark-text block">
                  Offline Kiosk Cache Sync
                </span>
                <span className="text-[11px] text-charcoal/60 dark:text-dark-muted">
                  IndexedDB village caching
                </span>
              </div>
              <button
                type="button"
                onClick={() => toggleSwitch("offlineCache")}
                className={`w-10 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                  toggles.offlineCache ? "bg-emerald-600" : "bg-charcoal/30"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    toggles.offlineCache ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 text-xs space-y-1">
              <span className="font-bold text-emerald-800 dark:text-emerald-300 block">
                ✓ 100% Direct Payout Pledge
              </span>
              <p className="text-[11px] text-emerald-700/90 dark:text-emerald-400">
                0% platform commission actively enforced across all 780+ districts and villages.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Quick Profile Modal from Universal Search */}
      <AdminModal isOpen={!!selectedProfileModal} onClose={() => setSelectedProfileModal(null)}>
        {selectedProfileModal && (
          <>
            <div className="px-6 sm:px-8 py-5 border-b border-charcoal/10 dark:border-dark-border flex items-center justify-between shrink-0 bg-cream/40 dark:bg-dark-surface/50">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {selectedProfileModal.type === "Worker" ? "👷" : selectedProfileModal.type === "SHG Group" ? "👥" : "🧑"}
                </span>
                <div>
                  <h3 className="font-display font-bold text-xl text-charcoal dark:text-dark-text">
                    {selectedProfileModal.type} Directory Record
                  </h3>
                  <p className="text-xs text-charcoal/60 dark:text-dark-muted mt-0.5">
                    Universal registry details and verified rural entity record.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProfileModal(null)}
                className="p-2 rounded-xl text-charcoal/50 hover:text-charcoal hover:bg-charcoal/10 dark:text-dark-muted dark:hover:text-dark-text dark:hover:bg-dark-border transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
              <div className="p-5 rounded-2xl bg-cream/60 dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="font-bold text-xl text-charcoal dark:text-dark-text block">{selectedProfileModal.name}</span>
                  <p className="text-sm text-charcoal/70 dark:text-dark-muted mt-1">
                    {selectedProfileModal.role || selectedProfileModal.trade || "Registered Customer"}
                  </p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-bold uppercase tracking-wider">
                  {selectedProfileModal.status || selectedProfileModal.kyc || "Verified"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-4 rounded-2xl bg-cream/60 dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border">
                  <span className="text-xs text-charcoal/50 dark:text-dark-muted block">Direct Contact Phone</span>
                  <span className="font-semibold text-charcoal dark:text-dark-text text-sm font-mono mt-1 block">{selectedProfileModal.phone}</span>
                </div>
                <div className="p-4 rounded-2xl bg-cream/60 dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border">
                  <span className="text-xs text-charcoal/50 dark:text-dark-muted block">Village &amp; District</span>
                  <span className="font-semibold text-charcoal dark:text-dark-text text-sm mt-1 block">{selectedProfileModal.village}, {selectedProfileModal.district}</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-cream/60 dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-charcoal/50 dark:text-dark-muted block">State &amp; Administrative Zone</span>
                  <span className="font-medium text-charcoal dark:text-dark-text text-sm mt-1 block">{selectedProfileModal.zone} ({selectedProfileModal.state})</span>
                </div>
                {selectedProfileModal.type === "Worker" && (
                  <Link
                    to="/workers"
                    onClick={() => setSelectedProfileModal(null)}
                    className="px-5 py-2.5 rounded-xl bg-olive-700 hover:bg-olive-800 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    Open in Workers Desk →
                  </Link>
                )}
                {selectedProfileModal.type === "SHG Group" && (
                  <Link
                    to="/shgs"
                    onClick={() => setSelectedProfileModal(null)}
                    className="px-5 py-2.5 rounded-xl bg-olive-700 hover:bg-olive-800 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    Open in SHG Registry →
                  </Link>
                )}
                {selectedProfileModal.type === "Customer" && (
                  <Link
                    to="/customers"
                    onClick={() => setSelectedProfileModal(null)}
                    className="px-5 py-2.5 rounded-xl bg-olive-700 hover:bg-olive-800 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    Open in Customer Directory →
                  </Link>
                )}
              </div>
            </div>

            <div className="px-6 sm:px-8 py-4 border-t border-charcoal/10 dark:border-dark-border flex items-center justify-end shrink-0 bg-cream/40 dark:bg-dark-surface/50">
              <button
                type="button"
                onClick={() => setSelectedProfileModal(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-charcoal/10 hover:bg-charcoal/15 dark:bg-dark-border dark:hover:bg-dark-border/80 text-charcoal dark:text-dark-text transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </>
        )}
      </AdminModal>
    </div>
  );
}
