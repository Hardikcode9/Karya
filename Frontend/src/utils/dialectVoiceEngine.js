// Comprehensive Dialect & Multilingual NLU Engine for Karya AI
// Supports: English, Hindi, Bengali, Mewadi, Malayalam, Bihari / Bhojpuri

export const DIALECTS = [
  {
    code: "en",
    label: "English",
    flag: "🇬🇧",
    speechCode: "en-IN",
    welcome: "Namaste! I am Karya AI Voice & Compare Companion. You can speak or compare workers in English, Hindi, Bengali, Mewadi, Malayalam, or Bihari.",
    chips: [
      "Compare top electricians",
      "Emergency plumber needed",
      "What are standard carpentry rates?",
      "Compare nearby SHG food products",
    ],
  },
  {
    code: "hi",
    label: "हिन्दी (Hindi)",
    flag: "🇮🇳",
    speechCode: "hi-IN",
    welcome: "नमस्ते! मैं कार्य एआई वॉइस और कंपेयर साथी हूँ। आप मुझसे बोलकर इलेक्ट्रीशियन, प्लंबर या स्वयं सहायता समूह खोज सकते हैं और तुलना कर सकते हैं।",
    chips: [
      "दो सबसे अच्छे इलेक्ट्रीशियन की तुलना करो",
      "तुरंत प्लंबर भेजो (आपातकालीन)",
      "बढ़ई का सही दैनिक रेट क्या है?",
      "महिला स्वयं सहायता समूह के उत्पाद दिखाओ",
    ],
  },
  {
    code: "bn",
    label: "বাংলা (Bengali)",
    flag: "🇧🇩",
    speechCode: "bn-IN",
    welcome: "নমস্কার! আমি কার্য এআই ভয়েস এবং তুলনা সহকারী। আপনি বাংলাতে কথা বলে টেকনিশিয়ান ও সেলফ-হেল্প গ্রুপের কাজের তুলনা ও বুকিং করতে পারেন।",
    chips: [
      "সেরা ইলেকট্রিশিয়ানদের তুলনা করুন",
      "জরুরি প্লাম্বার প্রয়োজন",
      "ছুতোর কাজের ন্যায্য মজুরি কত?",
      "কাছের স্বনির্ভর দলের খাদ্যপণ্য দেখান",
    ],
  },
  {
    code: "mew",
    label: "मेवाड़ी (Mewadi)",
    flag: "🚩",
    speechCode: "hi-IN",
    welcome: "खम्मा घणी! हूँ कार्य मेवाड़ी एआई साथी हूँ। थारे गाँव रा बिजली मिस्त्री, खाती, नल वालो ने महिला मंडल रा सामान री तुलना करवा वास्ते म्हाने बोलो।",
    chips: [
      "म्हाने दो बिजली मिस्त्री री तुलना करावो",
      "मोटर बिगड़ गी है, तुरंत मिस्त्री चावे",
      "खाती रो एक दिन रो कतरो पिसो लागेला?",
      "महिला मंडल रा शुद्ध पापड़ ने खाखरा बताओ",
    ],
  },
  {
    code: "ml",
    label: "മലയാളം (Malayalam)",
    flag: "🌴",
    speechCode: "ml-IN",
    welcome: "നമസ്കാരം! ഞാൻ കാര്യ എഐ വോയ്സ് അസിസ്റ്റന്റാണ്. നിങ്ങളുടെ ഗ്രാമത്തിലെ വിദഗ്ദ്ധ തൊഴിലാളികളെ താരതമ്യം ചെയ്യാനും ബുക്ക് ചെയ്യാനും സംസാരിക്കുക.",
    chips: [
      "മികച്ച ഇലക്ട്രീഷ്യൻമാരെ താരതമ്യം ചെയ്യുക",
      "അടിയന്തര പ്ലംബർ സേവനം വേണം",
      "ആശാരിപ്പണിയുടെ ന്യായമായ കൂലി എത്രയാണ്?",
      "കുടുംബശ്രീ ഉൽപന്നങ്ങൾ കാണിക്കുക",
    ],
  },
  {
    code: "bho",
    label: "बिहारी / भोजपुरी (Bihari)",
    flag: "🌾",
    speechCode: "hi-IN",
    welcome: "प्रणाम! हम कार्य एआई साथी हईं। रउआ भोजपुरिया बोली में बोल के कवनो बढ़िया मिस्त्री, बढ़ई चाहे महिला समूह के समान के तुलना कऽ सकिला।",
    chips: [
      "दु गो बढ़िया इलेक्ट्रीशियन के तुलना करावऽ",
      "हमार बोरिंग के मोटर बिगड़ गइल बा, मिस्त्री चाहीं",
      "बढ़ई के एक दिन के कतना पईसा लागी?",
      "गाँव के महिला समूह के का का सामान बा?",
    ],
  },
];

// NLU Intent Keyword Matchers
const intentKeywords = {
  compare: [
    "compare", "comparison", "difference", "vs", "versus", "better", "tulan",
    "तुलना", "मुकाबला", "फर्क",
    "তুলনা", "পার্থক্য",
    "तुलना करावो", "कतरो फर्क", "भाव कतरो", "कोण चोखो है",
    "താരതമ്യം", "വ്യത്യാസം", "ഏതാണ് നല്ലത്",
    "तुलना कराव", "कवन ठीक बा", "कतना फर्क बा", "कवन बढ़िया",
  ],
  electrician: [
    "electric", "wire", "current", "fuse", "meter", "line",
    "बिजली", "इलेक्ट्रीशियन", "वायरिंग", "करंट",
    "ইলেকট্রিক", "বিদ্যুৎ", "তার", "ফিউজ",
    "बिजली वालो", "करंट", "वायरिंग",
    "വൈദ്യുതി", "ഇലക്ട്രീഷ്യൻ", "വയറിംഗ്",
    "इलेक्ट्रीशियन", "बिजली", "करंट", "तार", "फ्यूज",
  ],
  plumber: [
    "plumb", "pipe", "water", "leak", "tap", "motor", "pump",
    "नल", "पाइप", "पानी", "लीक", "प्लम्बर",
    "প্লাম্বার", "পাইপ", "জল", "কল", "লিক",
    "नल वालो", "पाणी रो पाइप", "मोटर जल गी",
    "പ്ലംബർ", "പൈപ്പ്", "വെള്ളം", "ടാപ്പ്",
    "नलका", "पाइप", "पानी चुअता", "बोरिंग", "मोटर बिगड़ गइल",
  ],
  carpenter: [
    "carpenter", "wood", "furniture", "door", "table",
    "बढ़ई", "लकड़ी", "फर्नीचर", "दरवाजा",
    "ছুতোর", "কাঠ", "দরজা", "টেবিল",
    "खाती", "लाकड़ी", "किवाड़",
    "ആശാരി", "മരം", "ഫർണിച്ചർ", "വാതിൽ",
    "बढ़ई", "काठ", "केवाड़", "फर्नीचर",
  ],
  shg: [
    "shg", "group", "women", "craft", "food", "papad", "pickle", "saree", "handloom",
    "महिला", "समूह", "पापड़", "अचार", "हथकरघा", "स्वयं सहायता",
    "স্বনির্ভর দল", "মহিলা দল", "পাপড়", "আচার", "হস্তশিল্প",
    "महिला मंडल", "पापड़", "खाखरा", "समूह",
    "കുടുംബശ്രീ", "സ്ത്രീ കൂട്ടായ്മ", "കരകൗശല", "ഭക്ഷണം",
    "महिला समूह", "अचार", "पापड़", "हथकरघा", "दीदी लोग",
  ],
  rates: [
    "rate", "price", "cost", "wage", "fees", "how much",
    "रेट", "भाव", "दाम", "मजदूरी", "कीमत",
    "রেট", "মজুরি", "দাম", "খরচ",
    "कतरो पिसो", "भाव कतरो", "मजूरी",
    "കൂലി", "നിരക്ക്", "വില", "ചെലവ്",
    "कतना पईसा", "दर", "मजूरी", "लागी",
  ],
  emergency: [
    "emergency", "sos", "urgent", "hazard", "fire", "danger", "burst",
    "तुरंत", "आपातकालीन", "खतरा", "जल्दी",
    "জরুরি", "বিপদ", "তাড়াতাড়ি",
    "तुरंत", "बेगो", "बत्ती गुल", "संकट",
    "അടിയന്തര", "അപകടം", "ഉടൻ",
    "तुरंते", "बिपत", "जल्दी भेजि", "आपातकाल",
  ],
};

export function parseDialectQuery(query, _dialectCode = "en") {
  const qLower = query.toLowerCase();

  let detectedIntent = "general";
  for (const [intent, keywords] of Object.entries(intentKeywords)) {
    if (keywords.some((kw) => qLower.includes(kw.toLowerCase()))) {
      detectedIntent = intent;
      break;
    }
  }

  return detectedIntent;
}

export function generateDialectResponse(intent, dialectCode, _workersList = []) {
  const responses = {
    compare: {
      en: {
        text: "Here is a side-by-side comparison of the top 3 verified village specialists. I've highlighted the best value, closest location, and highest rated.",
        compareMode: true,
      },
      hi: {
        text: "मैंने आपके क्षेत्र के 3 शीर्ष सत्यापित कारीगरों की दरों, रेटिंग और दूरी की तुलना तैयार की है:",
        compareMode: true,
      },
      bn: {
        text: "আমি আপনার জন্য এলাকার সেরা ৩ জন কারিগরের মজুরি, দূরত্ব ও রেটিংয়ের বিস্তারিত তুলনা তৈরি করেছি:",
        compareMode: true,
      },
      mew: {
        text: "म्हे थारे वास्ते गाँव रा 3 चोखा मिस्त्रियाँ रा भाव, दूरी ने रेटिंग री तुलना त्यार कीधी है। देख लो कोण थारे वास्ते चोखो है:",
        compareMode: true,
      },
      ml: {
        text: "നിങ്ങളുടെ പ്രദേശത്തെ മുൻനിര 3 തൊഴിലാളികളുടെ നിരക്കുകളും റേറ്റിംഗുകളും താരതമ്യം താഴെ നൽകുന്നു:",
        compareMode: true,
      },
      bho: {
        text: "रउआ खातिर गाँव के 3 गो सबसे बढ़िया मिस्त्री लोग के रेट, दूरी अउर रेटिंग के तुलना तइयार कऽ दिहले बानी:",
        compareMode: true,
      },
    },
    electrician: {
      en: {
        text: "Found top-rated village electricians with verified Aadhaar & skill certifications:",
        roleFilter: "Electrician",
      },
      hi: {
        text: "आपके निकटतम सत्यापित बिजली मिस्त्री उपलब्ध हैं। आप तुरंत कॉल या बुक कर सकते हैं:",
        roleFilter: "Electrician",
      },
      bn: {
        text: "আপনার নিকটবর্তী যাচাইকৃত ইলেকট্রিশিয়ান পাওয়া গেছে। এখনই বুক করতে পারেন:",
        roleFilter: "Electrician",
      },
      mew: {
        text: "थारे गाँव कने बिजली वालो मिस्त्री हाज़र है, आधार से सत्यापित है। तुरंत बुकिंग कर लो:",
        roleFilter: "Electrician",
      },
      ml: {
        text: "നിങ്ങളുടെ സമീപത്ത് പരിശോധിച്ചുറപ്പിച്ച ഇലക്ട്രീഷ്യൻമാർ ലഭ്യമാണ്:",
        roleFilter: "Electrician",
      },
      bho: {
        text: "रउआ गाँव के लगे बढ़िया बिजली मिस्त्री मौजूद बाड़े, एकदम आधार से जाँचल:",
        roleFilter: "Electrician",
      },
    },
    plumber: {
      en: {
        text: "Identified certified plumbers for pipe leakages, water pumps, and tube-well repairs:",
        roleFilter: "Plumber",
      },
      hi: {
        text: "नल रिपेयरिंग, पानी मोटर और बोरिंग सुधार हेतु नजदीकी प्लंबर उपलब्ध हैं:",
        roleFilter: "Plumber",
      },
      bn: {
        text: "পানির পাইপ, মোটর ও কল মেরামতের জন্য প্রশিক্ষিত প্লাম্বার প্রস্তুত রয়েছে:",
        roleFilter: "Plumber",
      },
      mew: {
        text: "नल, पाणी री मोटर ने बोरिंग सुधारवा वास्ते गाँव रा पक्का नल मिस्त्री तैयार है:",
        roleFilter: "Plumber",
      },
      ml: {
        text: "പൈപ്പ് ലീക്ക്, വാട്ടർ മോട്ടോർ അറ്റകുറ്റപ്പണികൾക്കായി പ്ലംബർമാർ ലഭ്യമാണ്:",
        roleFilter: "Plumber",
      },
      bho: {
        text: "नलका, बोरिंग अउर मोटर बिगड़ल बा त ई जाँचल प्लंबर लोग के तुरंत बोलवाईं:",
        roleFilter: "Plumber",
      },
    },
    carpenter: {
      en: {
        text: "Showing certified carpenters specialized in farm tool handles, furniture, and roof framing:",
        roleFilter: "Carpenter",
      },
      hi: {
        text: "दरवाजे, फर्नीचर और कृषि औजार सुधारने वाले कुशल बढ़ई उपलब्ध हैं:",
        roleFilter: "Carpenter",
      },
      bn: {
        text: "কাঠের কাজ, আসবাবপত্র ও দরজার কাজের জন্য দক্ষ ছুতোর প্রস্তুত আছে:",
        roleFilter: "Carpenter",
      },
      mew: {
        text: "किवाड़, हल ने लाकड़ी रा फर्नीचर बनावा वास्ते गाँव रा होशियार खाती मौजूद है:",
        roleFilter: "Carpenter",
      },
      ml: {
        text: "തടിപ്പണികൾക്കും ഫർണിച്ചറുകൾക്കുമായി പരിചയസമ്പന്നരായ ആശാരിമാർ ലഭ്യമാണ്:",
        roleFilter: "Carpenter",
      },
      bho: {
        text: "काठ के काम, केवाड़ अउर हल-जुआर बनावे वाला बढ़ई लोग के लिस्ट हाजिर बा:",
        roleFilter: "Carpenter",
      },
    },
    shg: {
      en: {
        text: "Direct connection with local Women's Self-Help Groups (SHGs) producing certified foods & handloom:",
        roleFilter: "SHG",
      },
      hi: {
        text: "गाँव की महिला स्वयं सहायता समूहों (SHG) के शुद्ध जैविक उत्पाद, अचार और हस्तशिल्प:",
        roleFilter: "SHG",
      },
      bn: {
        text: "গ্রামীণ মহিলা স্বনির্ভর দলের তৈরি খাঁটি জৈব খাদ্যপণ্য, আচার ও হস্তশিল্পের সংগ্রহ:",
        roleFilter: "SHG",
      },
      mew: {
        text: "महिला स्वयं सहायता समूह रा शुद्ध घरगुती पापड़, राबड़ी, खाखरा ने कपड़ा रा सामान:",
        roleFilter: "SHG",
      },
      ml: {
        text: "കുടുംബശ്രീ യൂണിറ്റുകളുടെ പരിശുദ്ധ നാടൻ ഉൽപന്നങ്ങളും ഭക്ഷണ സാധനങ്ങളും:",
        roleFilter: "SHG",
      },
      bho: {
        text: "गाँव के दीदी लोगन के महिला समूह के बनल शुद्ध अचार, पापड़ अउर देसी सामान:",
        roleFilter: "SHG",
      },
    },
    rates: {
      en: {
        text: "Panchayat Standard Benchmark Rates: Electrician (₹350-450/day), Plumber (₹300-400/day), Carpenter (₹450-550/day). Karya enforces ZERO broker cut.",
        showRates: true,
      },
      hi: {
        text: "पंचायत मानक दरें: इलेक्ट्रीशियन (₹350-450/दिन), प्लंबर (₹300-400/दिन), बढ़ई (₹450-550/दिन)। कार्य पर शून्य बिचौलिया कमीशन है।",
        showRates: true,
      },
      bn: {
        text: "ন্যায্য পঞ্চায়েত রেট: ইলেকট্রিশিয়ান (₹৩৫০-৪৫০/দিন), প্লাম্বার (₹৩০০-৪০০/দিন), ছুতোর (₹৪৫০-৫৫০/দিন)। সম্পূর্ণ দালালমুক্ত।",
        showRates: true,
      },
      mew: {
        text: "गाँव रो सही भाव: बिजली मिस्त्री (₹350-450/दिन), नल वालो (₹300-400/दिन), खाती (₹450-550/दिन)। बिचोलिया रो एक भी रुपियो नी कटे।",
        showRates: true,
      },
      ml: {
        text: "പഞ്ചായത്ത് അംഗീകൃത നിരക്കുകൾ: ഇലക്ട്രീഷ്യൻ (₹350-450), പ്ലംബർ (₹300-400), ആശാരി (₹450-550). കമ്മീഷൻ ഇല്ലാതെ.",
        showRates: true,
      },
      bho: {
        text: "गाँव के सही मजूरी: बिजली मिस्त्री (₹350-450/दिन), नलका वाला (₹300-400/दिन), बढ़ई (₹450-550/दिन)। कौनों दलाली नाहीं कटी।",
        showRates: true,
      },
    },
    emergency: {
      en: {
        text: "EMERGENCY SOS ACTIVATED: Dispatching alert to 4 nearest on-call technicians within 8 km radius. Expected response: under 12 mins.",
        isEmergency: true,
      },
      hi: {
        text: "आपातकालीन एसओएस सक्रिय: 8 किमी के दायरे में 4 निकटतम ऑन-कॉल मिस्त्रियों को तुरंत अलर्ट भेजा गया है।",
        isEmergency: true,
      },
      bn: {
        text: "জরুরি এসওএস সক্রিয়: ৮ কিমি এলাকার মধ্যে ৪ জন অন-কল কারিগরকে অ্যালার্ট পাঠানো হয়েছে।",
        isEmergency: true,
      },
      mew: {
        text: "संकटकालीन एसओएस चालू! 8 किमी कने रा 4 मिस्त्रियाँ ने संदेश गयो है, 12 मिनट में मदद पहुँचेगी।",
        isEmergency: true,
      },
      ml: {
        text: "എമർജൻസി എസ്ഒഎസ് സജീവമാക്കി: 8 കിലോമീറ്റർ ചുറ്റളവിലുള്ള 4 തൊഴിലാളികൾക്ക് അടിയന്തര സന്ദേശം അയച്ചു.",
        isEmergency: true,
      },
      bho: {
        text: "आपातकालीन एसओएस अलर्ट भेज दिहल गइल बा! 8 किमी के अंदर 4 गो मिस्त्री लोगन के सोझा सूचना पहुँच गइल।",
        isEmergency: true,
      },
    },
    general: {
      en: {
        text: "I analyzed your request. Here are the top verified local specialists matching your search:",
      },
      hi: {
        text: "मैंने आपकी आवश्यकता को समझ लिया है। आपके लिए सबसे उपयुक्त सत्यापित कारीगर:",
      },
      bn: {
        text: "আপনার অনুরোধ অনুযায়ী উপযুক্ত যাচাইকৃত গ্রামীণ কারিগরদের তালিকা দেওয়া হলো:",
      },
      mew: {
        text: "थारी बात म्हारै समझ में आगी। थारे वास्ते गाँव रा चोखा कारीगर हाज़र है:",
      },
      ml: {
        text: "നിങ്ങളുടെ ആവശ്യത്തിനനുയോജ്യമായ പരിശോധിച്ചുറപ്പിച്ച പ്രാദേശിക തൊഴിലാളികൾ:",
      },
      bho: {
        text: "रउआ बात हम समझ गइनी। रउआ खातिर गाँव के सबसे बढ़िया जाँचल कारीगर हाजिर बाड़े:",
      },
    },
  };

  const dialectEntry = responses[intent] || responses.general;
  const match = dialectEntry[dialectCode] || dialectEntry.en;
  return match;
}

// Web Speech Synthesis wrapper
export function speakText(text, speechCode = "en-IN") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = speechCode;
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  // Try to pick an Indian voice if available
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find((v) => v.lang === speechCode || v.lang.startsWith(speechCode.slice(0, 2)));
  if (voice) utterance.voice = voice;

  window.speechSynthesis.speak(utterance);
}
