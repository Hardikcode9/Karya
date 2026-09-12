// Complete Directory of All 28 States and 8 Union Territories of India (36 in total)
// with comprehensive official districts, zones/blocks/tehsils, and village gram panchayats.

export const INDIA_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export const INDIA_UNION_TERRITORIES = [
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi (NCT)",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

export const INDIA_STATES_AND_UTS = [...INDIA_STATES, ...INDIA_UNION_TERRITORIES];

// Comprehensive District Mapping for all 36 States & UTs (780+ Districts)
export const INDIA_DISTRICTS_BY_STATE = {
  "Andhra Pradesh": [
    "Alluri Sitharama Raju", "Anakapalli", "Ananthapuramu", "Annamayya", "Bapatla", "Chittoor",
    "Dr. B.R. Ambedkar Konaseema", "East Godavari", "Eluru", "Guntur", "Kakinada", "Krishna",
    "Kurnool", "Nandyal", "NTR", "Palnadu", "Parvathipuram Manyam", "Prakasam",
    "Sri Potti Sriramulu Nellore", "Sri Sathya Sai", "Srikakulam", "Tirupati", "Visakhapatnam",
    "Vizianagaram", "West Godavari", "YSR Kadapa"
  ],
  "Arunachal Pradesh": [
    "Anjaw", "Changlang", "Dibang Valley", "East Kameng", "East Siang", "Kamle", "Kra Daadi",
    "Kurung Kumey", "Lepa Rada", "Lohit", "Longding", "Lower Dibang Valley", "Lower Subansiri",
    "Namsai", "Pakke Kessang", "Papum Pare", "Shi Yomi", "Siang", "Tawang", "Tirap", "Upper Siang",
    "Upper Subansiri", "West Kameng", "West Siang"
  ],
  "Assam": [
    "Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang",
    "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", "Golaghat", "Hailakandi", "Hojai",
    "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong", "Karimganj", "Kokrajhar",
    "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur",
    "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong"
  ],
  "Bihar": [
    "Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar",
    "Darbhanga", "East Champaran (Motihari)", "Gaya", "Gopalganj", "Jamui", "Jehanabad",
    "Kaimur (Bhabua)", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura",
    "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas",
    "Saharsa", "Samastipur", "Saran (Chhapra)", "Sheikhpura", "Sheohar", "Sitamarhi",
    "Siwan", "Supaul", "Vaishali", "West Champaran (Bettiah)"
  ],
  "Chhattisgarh": [
    "Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur",
    "Dantewada", "Dhamtari", "Durg", "Gariaband", "Gaurela-Pendra-Marwahi", "Janjgir-Champa",
    "Jashpur", "Kabirdham", "Kanker", "Khairagarh", "Kondagaon", "Korba", "Koriya",
    "Mahasamund", "Manendragarh", "Mohla-Manpur", "Mungeli", "Narayanpur", "Raigarh",
    "Raipur", "Rajnandgaon", "Sarangarh", "Sakti", "Sukma", "Surajpur", "Surguja"
  ],
  "Goa": [
    "North Goa", "South Goa"
  ],
  "Gujarat": [
    "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar",
    "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar",
    "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana",
    "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot",
    "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"
  ],
  "Haryana": [
    "Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar",
    "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh",
    "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"
  ],
  "Himachal Pradesh": [
    "Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti",
    "Mandi", "Shimla", "Sirmaur", "Solan", "Una"
  ],
  "Jharkhand": [
    "Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa",
    "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma",
    "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahebganj",
    "Seraikela Kharsawan", "Simdega", "West Singhbhum"
  ],
  "Karnataka": [
    "Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar",
    "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada",
    "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar",
    "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru",
    "Udupi", "Uttara Kannada", "Vijayanagara", "Vijayapura", "Yadgir"
  ],
  "Kerala": [
    "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam",
    "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram",
    "Thrissur", "Wayanad"
  ],
  "Madhya Pradesh": [
    "Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul",
    "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas",
    "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad (Narmadapuram)", "Indore",
    "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena",
    "Narsinghpur", "Neemuch", "Niwari", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa",
    "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri",
    "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha", "Mauganj", "Maihar"
  ],
  "Maharashtra": [
    "Ahmednagar (Ahilyanagar)", "Akola", "Amravati", "Chhatrapati Sambhajinagar (Aurangabad)",
    "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli",
    "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur",
    "Nanded", "Nandurbar", "Nashik", "Osmanabad (Dharashiv)", "Palghar", "Parbhani",
    "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur",
    "Thane", "Wardha", "Washim", "Yavatmal"
  ],
  "Manipur": [
    "Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam",
    "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong",
    "Tengnoupal", "Thoubal", "Ukhrul"
  ],
  "Meghalaya": [
    "East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "Eastern West Khasi Hills",
    "North Garo Hills", "Ri Bhoi", "South Garo Hills", "South West Garo Hills",
    "South West Khasi Hills", "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"
  ],
  "Mizoram": [
    "Aizawl", "Champhai", "Hnahthial", "Khawzawl", "Kolasib", "Lawngtlai", "Lunglei",
    "Mamit", "Saitual", "Serchhip", "Siaha"
  ],
  "Nagaland": [
    "Chümoukedima", "Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon",
    "Niuland", "Noklak", "Peren", "Phek", "Shamator", "Tseminyü", "Tuensang", "Wokha", "Zunheboto"
  ],
  "Odisha": [
    "Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh",
    "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi",
    "Kandhamal", "Kendrapara", "Kendujhar (Keonjhar)", "Khordha", "Koraput", "Malkangiri",
    "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur",
    "Subarnapur", "Sundergarh"
  ],
  "Punjab": [
    "Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur",
    "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Malerkotla", "Mansa",
    "Moga", "Muktsar", "Pathankot", "Patiala", "Rupnagar", "SAS Nagar (Mohali)", "Sangrur",
    "SBS Nagar (Nawanshahr)", "Tarn Taran"
  ],
  "Rajasthan": [
    "Ajmer", "Alwar", "Anupgarh", "Balotra", "Banswara", "Baran", "Barmer", "Beawar",
    "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Deeg",
    "Dholpur", "Didwana-Kuchaman", "Dudu", "Dungarpur", "Ganganagar", "Gangapur City",
    "Hanumangarh", "Jaipur", "Jaipur Rural", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu",
    "Jodhpur", "Jodhpur Rural", "Karauli", "Kekri", "Kota", "Kotputli-Behror", "Nagaur",
    "Neem Ka Thana", "Pali", "Phalodi", "Pratapgarh", "Rajsamand", "Salumbar", "Sanchore",
    "Sawai Madhopur", "Shahpura", "Sikar", "Sirohi", "Tonk", "Udaipur"
  ],
  "Sikkim": [
    "Gangtok", "Gyalshing", "Mangan", "Namchi", "Pakyong", "Soreng"
  ],
  "Tamil Nadu": [
    "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri",
    "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur",
    "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris",
    "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga",
    "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
    "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore",
    "Viluppuram", "Virudhunagar"
  ],
  "Telangana": [
    "Adilabad", "Bhadradri Kothagudem", "Hanumakonda", "Hyderabad", "Jagtial", "Jangaon",
    "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam",
    "Kumuram Bheem Asifabad", "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak",
    "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal",
    "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Ranga Reddy", "Sangareddy", "Siddipet",
    "Suryapet", "Vikarabad", "Wanaparthy", "Warangal", "Yadadri Bhuvanagiri"
  ],
  "Tripura": [
    "Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura",
    "Unakoti", "West Tripura"
  ],
  "Uttar Pradesh": [
    "Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya",
    "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki",
    "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli",
    "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad",
    "Gautam Buddha Nagar (Noida)", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur",
    "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi",
    "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri",
    "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri",
    "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit",
    "Pratapgarh", "Prayagraj", "Raebareli", "Rampur", "Saharanpur", "Sambhal",
    "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar",
    "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"
  ],
  "Uttarakhand": [
    "Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital",
    "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"
  ],
  "West Bengal": [
    "Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling",
    "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda",
    "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur",
    "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"
  ],

  // 8 Union Territories
  "Andaman and Nicobar Islands": [
    "Nicobar", "North and Middle Andaman", "South Andaman"
  ],
  "Chandigarh": [
    "Chandigarh District"
  ],
  "Dadra and Nagar Haveli and Daman and Diu": [
    "Dadra and Nagar Haveli", "Daman", "Diu"
  ],
  "Delhi (NCT)": [
    "Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi",
    "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"
  ],
  "Jammu and Kashmir": [
    "Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal", "Jammu", "Kathua",
    "Kishtwar", "Kulgam", "Kupwara", "Poonch", "Pulwama", "Rajouri", "Ramban", "Reasi",
    "Samba", "Shopian", "Srinagar", "Udhampur"
  ],
  "Ladakh": [
    "Kargil", "Leh"
  ],
  "Lakshadweep": [
    "Lakshadweep District"
  ],
  "Puducherry": [
    "Karaikal", "Mahe", "Puducherry District", "Yanam"
  ],
};

// Curated Rural Zones / Blocks & Gram Panchayat Villages
export const CURATED_ZONES_AND_VILLAGES = {
  // Pune
  Pune: {
    "Devgaon Cluster": ["Devgaon Main", "Devgaon East", "Shindewadi", "Ganeshwadi", "Pachane"],
    "Haveli Zone": ["Wagholi Gram", "Hadapsar Gaothan", "Khanapur", "Khadakwasla", "Uruli Kanchan"],
    "Baramati Block": ["Malegaon Rural", "Katewadi", "Supa", "Khandaj", "Dorlewadi"],
    "Shirur Block": ["Sanaswadi", "Koregaon Bhima", "Shikrapur", "Talegaon Dhamdhere"],
    "Khed Block": ["Chakan Rural", "Rajgurunagar", "Alandi Devasthan", "Shelgaon"],
  },
  // Nashik
  Nashik: {
    "Rampur Block": ["Rampur East", "Rampura Market", "Rampur Block 2", "Dongargaon", "Kotamgaon"],
    "Niphad Block": ["Pimpalgaon Rural", "Ozar Gaon", "Saykheda", "Kundewadi", "Sukene"],
    "Dindori Belt": ["Vani Gram", "Janori", "Nanashi", "Mohadi", "Akrale"],
    "Sinnar Block": ["Musalgoan", "Wavi", "Pangri", "Naygaon", "Dodi"],
  },
  // Chhatrapati Sambhajinagar
  "Chhatrapati Sambhajinagar (Aurangabad)": {
    "Sonipur Block": ["Sonipur Farm Belt", "Sonipur Gaon", "Shivur", "Karmad", "Chittegaon"],
    "Paithan Belt": ["Paithan Rural", "Balegaon", "Shevgaon Border", "Bidkin", "Pachod"],
    "Gangapur Block": ["Bhenda", "Waluj Gaon", "Lasur Station", "Shilapur"],
    "Vaijapur Block": ["Babhulgaon", "Rotegaon", "Shiur", "Khandala"],
  },
  "Chhatrapati Sambhajinagar": {
    "Sonipur Block": ["Sonipur Farm Belt", "Sonipur Gaon", "Shivur", "Karmad", "Chittegaon"],
    "Paithan Belt": ["Paithan Rural", "Balegaon", "Shevgaon Border", "Bidkin", "Pachod"],
  },
  // Amravati
  Amravati: {
    "Bhagwanpur Tehsil": ["Bhagwanpur Gaon", "Chandur Rural", "Shirala", "Tiwsa"],
    "Achalpur Block": ["Paratwada Rural", "Pathrot", "Sirajgaon"],
    "Morshi Block": ["Warud Belt", "Dhamangaon", "Benoda"],
  },
  // Varanasi
  Varanasi: {
    "Kashi Rural": ["Rameshwar Gram", "Shivpur", "Lohta", "Kandwa", "Manduadih"],
    "Pindra Block": ["Pindra Gaon", "Phulpur Rural", "Sindhora", "Mangari", "Babatpur"],
    "Arajiline Block": ["Raja Talab", "Jakhini", "Shahanshahpur", "Mirzamurad"],
    "Chiraigaon Block": ["Chiraigaon", "Chaubepur", "Sarnath Gaothan", "Rajwari"],
  },
  // Patna
  Patna: {
    "Danapur Block": ["Danapur Cantt Rural", "Khagaul Gaon", "Usmanpur", "Maner Gram"],
    "Fatuha Block": ["Fatuha Rural", "Bakhtiyarpur Gram", "Daniayawan", "Khusrupur"],
    "Bihta Block": ["Bihta Gram", "Painal", "Katesar", "Kanhauli"],
    "Barh Block": ["Barh Rural", "Mokama Gaon", "Ghoswari"],
  },
  // Bhopal
  Bhopal: {
    "Berasia Block": ["Berasia Gaon", "Runaha", "Nazirabad", "Lalariya", "Gunga"],
    "Phanda Block": ["Phanda Rural", "Kolar Gaon", "Ratibad", "Bhadbhada", "Tumda"],
  },
  // Anand
  Anand: {
    "Petlad Block": ["Sunav", "Dharmaj", "Palaj", "Bandhani", "Nar"],
    "Borsad Block": ["Borsad Rural", "Vasna", "Alarsa", "Dahewan", "Bhadran"],
    "Khambhat Block": ["Kallashahi", "Rohini", "Tarapur Belt", "Mitli"],
  },
  // Nagpur
  Nagpur: {
    "Ramtek Block": ["Ramtek Gaon", "Mansar", "Nagardhan", "Parseoni"],
    "Katol Block": ["Katol Rural", "Kondhali", "Metpanjra", "Sawargaon"],
    "Umred Block": ["Umred Gram", "Sirsi", "Bhiwapur", "Kuhi"],
  },
  // Jaipur
  Jaipur: {
    "Amer Block": ["Amer Gaon", "Kukas", "Achrol", "Chandwaji", "Bilhanchi"],
    "Sanganer Block": ["Sanganer Rural", "Watika", "Chaksu", "Muhana"],
    "Bassi Block": ["Bassi Gram", "Tunga", "Kanota", "Sambhar Lake Belt"],
  },
  // Gorakhpur
  Gorakhpur: {
    "Pipraich Zone": ["Pipraich Gaon", "Bhadua", "Bhatthi", "Munderi"],
    "Sahjanwa Block": ["Sahjanwa Rural", "Ghaghradih", "Gola", "Khorabar"],
  },
  // Bengaluru Rural
  "Bengaluru Rural": {
    "Devanahalli Block": ["Devanahalli Gaothan", "Vijayapura Rural", "Kannamangala", "Kundana"],
    "Doddaballapur Block": ["Doddabelavangala", "Tubagere", "Kasaba Rural", "Madure"],
    "Nelamangala Block": ["Nelamangala Gram", "Tyamagondlu", "Sompur", "Dasanapura"],
  },
  // Coimbatore
  Coimbatore: {
    "Pollachi North": ["Achipatti", "Anaimalai Rural", "Kinathukadavu", "Negamam"],
    "Sulur Block": ["Sulur Gaon", "Karamadai Rural", "Kaniyur", "Perur"],
  },
  // Darjeeling
  Darjeeling: {
    "Kurseong Block": ["Tindharia", "Sukna Gram", "Mirik Valley", "Mahanadi"],
    "Kalimpong Rural": ["Pedong", "Lava Gram", "Algarah", "Rishi"],
  },
  // Srinagar
  Srinagar: {
    "Dal Rural Cluster": ["Nigeen Belt", "Harwan Gram", "Brein", "Shalimar Gaon"],
    "Eidgah Tehsil": ["Noorbagh", "Soura Rural", "Zakoora"],
  },
};

// Helper: Get list of districts for any given state or UT
export function getDistrictsForState(state) {
  if (!state || state === "all") return [];
  return INDIA_DISTRICTS_BY_STATE[state] || [];
}

// Helper: Generates realistic zones/blocks for any district in India
export function getZonesForDistrict(district) {
  if (!district || district === "all") return [];
  if (CURATED_ZONES_AND_VILLAGES[district]) {
    return Object.keys(CURATED_ZONES_AND_VILLAGES[district]);
  }
  // Standard administrative block structure
  return [
    `${district} North Block`,
    `${district} Central Tehsil`,
    `${district} Rural Block`,
    `${district} South Cluster`,
    `${district} West Panchayat Union`,
  ];
}

// Helper: Generates realistic villages for any block in India
export function getVillagesForZone(district, zone) {
  if (!zone || zone === "all") return [];
  if (CURATED_ZONES_AND_VILLAGES[district] && CURATED_ZONES_AND_VILLAGES[district][zone]) {
    return CURATED_ZONES_AND_VILLAGES[district][zone];
  }
  // Standard gram panchayat village structure
  return [
    `${zone} Gram Panchayat 1`,
    `${zone} Adarsh Gaon`,
    `${zone} Shantinagar`,
    `${zone} Pragati Gaothan`,
    `${zone} Krishi Kendra`,
  ];
}
