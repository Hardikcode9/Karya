/**
 * Voice Call Automation Service
 * Handles confirmation call script generation, Twilio/Voice Gateway triggers,
 * and speech synthesis payloads for customer order and service arrival verification.
 *
 * Multilingual: scripts are generated in every supported language so the caller
 * (browser speech synthesis or Twilio) can speak the customer's preferred one.
 */

// ---------------------------------------------------------------------------
// Supported call languages. `code` is the app/i18n code, `twilioLang` is the
// SSML xml:lang used by <Say>, and `voice` is a Twilio/Polly voice that speaks
// that language.
// ---------------------------------------------------------------------------
const CALL_LANGUAGES = {
  en: {
    label: "English",
    twilioLang: "en-IN",
    voice: "Polly.Aditi",
  },
  hi: {
    label: "हिन्दी (Hindi)",
    twilioLang: "hi-IN",
    voice: "Polly.Aditi", // Aditi speaks Hinglish/Hindi-capable Indian English; hi-IN voices listed for gateway fallback
  },
  bn: {
    label: "বাংলা (Bengali)",
    twilioLang: "bn-IN",
    voice: "Polly.Aditi",
  },
  mr: {
    label: "मराठी (Marathi)",
    twilioLang: "mr-IN",
    voice: "Polly.Aditi",
  },
  mai: {
    label: "मैथिली (Maithili)",
    // No dedicated Twilio/Polly voice for Maithili; Hindi voice is the closest
    // phonetic match and is widely understood by Maithili speakers.
    twilioLang: "hi-IN",
    voice: "Polly.Aditi",
  },
};

const DEFAULT_CALL_LANGUAGE = "en";

const normalizeLanguage = (code) => {
  if (!code) return DEFAULT_CALL_LANGUAGE;
  const key = String(code).toLowerCase();
  if (CALL_LANGUAGES[key]) return key;
  // Tolerate "en-IN"/"hi-IN" style inputs and regional aliases
  const base = key.split("-")[0];
  if (CALL_LANGUAGES[base]) return base;
  if (base === "mai" || base === "mt" || base === "maithili") return "mai";
  return DEFAULT_CALL_LANGUAGE;
};

// Number-to-words so amounts are spoken as words ("rupees five hundred fifty"),
// which every TTS engine pronounces correctly, unlike "550.00".
const ONES = [
  "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
  "seventeen", "eighteen", "nineteen",
];
const TENS = [
  "", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety",
];

const twoDigits = (n) => {
  if (n < 20) return ONES[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return TENS[t] + (o ? ` ${ONES[o]}` : "");
};

const numberToWords = (num) => {
  const n = Math.round(Number(num) || 0);
  if (n === 0) return "zero";
  const parts = [];
  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const hundred = Math.floor((n % 1000) / 100);
  const rest = n % 100;
  if (crore) parts.push(`${numberToWords(crore)} crore`);
  if (lakh) parts.push(`${twoDigits(lakh)} lakh`);
  if (thousand) parts.push(`${twoDigits(thousand)} thousand`);
  if (hundred) parts.push(`${ONES[hundred]} hundred`);
  if (rest) parts.push(twoDigits(rest));
  return parts.join(" ");
};

// Localized currency/unit words and fragments per language.
const L = {
  en: {
    rupees: "rupees",
    and: "and",
    hello: (name) => `Namaste ${name}!`,
    intro: "This is the Karya Automated Dispatch Service calling to confirm your recent booking.",
    ordered: (items) => `You have ordered ${items}.`,
    paid: (amt) => `The total verified payment is rupees ${amt}.`,
    receipt: "Your official digital receipt and thank-you note have been delivered to your email.",
    serviceNamed: (p) => `Your verified service specialist, ${p}, is assigned and scheduled to arrive at your location: {addr}, {win}.`,
    serviceGeneric: "Your local service specialist has been notified and will arrive at your scheduled address today.",
    product: "Your handcrafted rural artisan order is packaged and will be delivered to your registered doorstep.",
    help: "If you have questions, press 1 or visit the Karya Community Desk.",
    close: "Thank you for empowering local livelihoods. Have a wonderful day!",
    fallbackAddress: "your registered address",
    fallbackWindow: "within 45 to 60 minutes",
  },
  hi: {
    rupees: "रुपये",
    and: "और",
    hello: (name) => `नमस्ते ${name}!`,
    intro: "यह कार्य स्वचालित डिस्पैच सेवा है जो आपकी हालिया बुकिंग की पुष्टि के लिए कॉल कर रही है।",
    ordered: (items) => `आपने ${items} ऑर्डर किया है।`,
    paid: (amt) => `कुल सत्यापित भुगतान ${amt} रुपये हुआ है।`,
    receipt: "आपकी आधिकारिक डिजिटल रसीद और धन्यवाद नोट आपके ईमेल पर भेज दिए गए हैं।",
    serviceNamed: (p) => `आपके सत्यापित सेवा विशेषज्ञ ${p} को नियुक्त किया गया है और वे {addr}, {win} आपके स्थान पर पहुंचेंगे।`,
    serviceGeneric: "आपके स्थानीय सेवा विशेषज्ञ को सूचित कर दिया गया है और वे आज आपके निर्धारित पते पर पहुंचेंगे।",
    product: "आपका हस्तनिर्मित ग्रामीण शिल्प आदेश पैक होकर आपके पंजीकृत पते पर वितरित किया जाएगा।",
    help: "यदि आपके कोई प्रश्न हैं तो 1 दबाएं या कार्य कम्युनिटी डेस्क पर जाएं।",
    close: "स्थानीय आजीविकाओं को सशक्त बनाने के लिए धन्यवाद। आपका दिन शुभ हो!",
    fallbackAddress: "आपके पंजीकृत पते पर",
    fallbackWindow: "45 से 60 मिनट के भीतर",
  },
  bn: {
    rupees: "টাকা",
    and: "এবং",
    hello: (name) => `নমস্কার ${name}!`,
    intro: "এটি কার্য স্বয়ংক্রিয় ডিসপ্যাচ সার্ভিস, আপনার সাম্প্রতিক বুকিং নিশ্চিত করতে কল করছে।",
    ordered: (items) => `আপনি ${items} অর্ডার করেছেন।`,
    paid: (amt) => `মোট যাচাইকৃত পেমেন্ট ${amt} টাকা।`,
    receipt: "আপনার অফিসিয়াল ডিজিটাল রসিদ এবং ধন্যবাদ নোট আপনার ইমেলে পাঠানো হয়েছে।",
    serviceNamed: (p) => `আপনার যাচাইকৃত সেবা বিশেষজ্ঞ ${p} নিযুক্ত হয়েছেন এবং {addr}, {win} আপনার স্থানে পৌঁছাবেন।`,
    serviceGeneric: "আপনার স্থানীয় সেবা বিশেষজ্ঞকে জানানো হয়েছে এবং তিনি আজ আপনার নির্ধারিত ঠিকানায় পৌঁছাবেন।",
    product: "আপনার হস্তশিল্প অর্ডার প্যাক হয়ে আপনার নিবন্ধিত ঠিকানায় পৌঁছে যাবে।",
    help: "কোনো প্রশ্ন থাকলে ১ চাপুন বা কার্য কমিউনিটি ডেস্কে যান।",
    close: "স্থানীয় জীবিকাকে শক্তিশালী করার জন্য ধন্যবাদ। আপনার দিন শুভ হোক!",
    fallbackAddress: "আপনার নিবন্ধিত ঠিকানায়",
    fallbackWindow: "৪৫ থেকে ৬০ মিনিটের মধ্যে",
  },
  mr: {
    rupees: "रुपये",
    and: "आणि",
    hello: (name) => `नमस्कार ${name}!`,
    intro: "ही कार्य स्वयंचलित डिस्पॅच सेवा आहे, ती तुमच्या अलीकडील बुकिंगची पुष्टी करण्यासाठी कॉल करत आहे.",
    ordered: (items) => `तुम्ही ${items} ऑर्डर केले आहे.`,
    paid: (amt) => `एकूण सत्यापित देयक ${amt} रुपये आहे.`,
    receipt: "तुमची अधिकृत डिजिटल पावती आणि धन्यवाद टिप तुमच्या ईमेलवर पाठवली आहे.",
    serviceNamed: (p) => `तुमचे सत्यापित सेवा तज्ज्ञ ${p} यांची नियुक्ती झाली आहे आणि ते {addr}, {win} तुमच्या ठिकाणी येतील.`,
    serviceGeneric: "तुमच्या स्थानिक सेवा तज्ज्ञाला कळवण्यात आले आहे आणि ते आज तुमच्या निश्चित पत्त्यावर येतील.",
    product: "तुमची हस्तनिर्मित ग्रामीण शिल्प ऑर्डर पॅक होऊन तुमच्या नोंदणीकृत पत्त्यावर वितरित होईल.",
    help: "काही प्रश्न असल्यास १ दाबा किंवा कार्य कम्युनिटी डेस्कला भेट द्या.",
    close: "स्थानिक उपजीविकांना बळ दिल्याबद्दल धन्यवाद. तुमचा दिवस शुभ असो!",
    fallbackAddress: "तुमच्या नोंदणीकृत पत्त्यावर",
    fallbackWindow: "४५ ते ६० मिनिटांत",
  },
  mai: {
    rupees: "रुपया",
    and: "आओर",
    hello: (name) => `प्रणाम ${name} जी!`,
    intro: "ई कार्य स्वचालित डिस्पैच सेवा छै, अहाँक हालक बुकिंगक पुष्टि क'लै कॉल क' रहल छै।",
    ordered: (items) => `अहाँ ${items} ऑर्डर कएने छी।`,
    paid: (amt) => `कुल सत्यापित भुगतान ${amt} रुपया भ' गेल।`,
    receipt: "अहाँक आधिकारिक डिजिटल रसीद आओर धन्यवाद पत्र अहाँक ईमेल पर पठा दल गेल अछि।",
    serviceNamed: (p) => `अहाँक सत्यापित सेवा विशेषज्ञ ${p} केँ नियुक्त कएल गेल अछि आ {addr}, {win} अहाँक ठाम पर आएब।`,
    serviceGeneric: "अहाँक स्थानीय सेवा विशेषज्ञकेँ सूचित क दल गेल अछि आ ओ आई अहाँक निर्धारित ठेगाना पर आएब।",
    product: "अहाँक हस्तनिर्मित ग्रामीण शिल्प ऑर्डर पैक भ' क अहाँक दर्ता ठेगाना पर पहुँच जएत।",
    help: "कोनो प्रश्न भ गेल त 1 दाबी या कार्य कम्युनिटी डेस्क पर जाइए।",
    close: "स्थानीय आजीविकाक सशक्तिकरणक लेल धन्यवाद। अहाँक दिन मंगल हओ।",
    fallbackAddress: "अहाँक दर्ता ठेगाना पर",
    fallbackWindow: "४५ सँ ६० मिनट के भीतर",
  },
};

const fillTemplate = (tpl, { address, window: win }) =>
  tpl.replace("{addr}", address).replace("{win}", win);

/**
 * Generate the confirmation call script in a specific language.
 */
const buildScriptInLanguage = ({
  lang = DEFAULT_CALL_LANGUAGE,
  customerName = "Customer",
  itemNames = "",
  amountPaid = 0,
  isService = true,
  arrivalDetails = {},
}) => {
  const t = L[lang] || L[DEFAULT_CALL_LANGUAGE];

  // English TTS reads spelled-out words most reliably; Indic voices pronounce
  // digits natively in their own language, so pass the numeral for those.
  const amountDisplay =
    lang === "en" ? numberToWords(amountPaid) : String(Math.round(Number(amountPaid) || 0));

  const parts = [t.hello(customerName), t.intro];

  if (itemNames) parts.push(t.ordered(itemNames));
  parts.push(t.paid(amountDisplay));
  parts.push(t.receipt);

  let arrivalSentence = "";
  if (isService && arrivalDetails && arrivalDetails.providerName) {
    arrivalSentence = fillTemplate(t.serviceNamed(arrivalDetails.providerName), {
      address: arrivalDetails.address || t.fallbackAddress,
      window: arrivalDetails.arrivalWindow || t.fallbackWindow,
    });
  } else if (isService) {
    arrivalSentence = t.serviceGeneric;
  } else {
    arrivalSentence = t.product;
  }
  parts.push(arrivalSentence);

  parts.push(t.help);
  parts.push(t.close);

  return { script: parts.join(" "), arrivalSentence };
};

/**
 * Generate the confirmation call script (all languages at once, so the
 * frontend caller can switch mid-call without another round-trip).
 */
const generateConfirmationCallScripts = ({
  customerName = "Customer",
  items = [],
  amountPaid = 0,
  isService = true,
  arrivalDetails = {},
} = {}) => {
  const itemNames =
    items.map((i) => i.name).join(", ") || "";
  const amountWords = numberToWords(amountPaid);

  const languageCodes = Object.keys(CALL_LANGUAGES);
  const scripts = {};
  for (const code of languageCodes) {
    scripts[code] = buildScriptInLanguage({
      lang: code,
      customerName,
      itemNames,
      amountPaid,
      isService,
      arrivalDetails,
    }).script;
  }

  return {
    scripts, // { en: "...", hi: "...", bn: "...", mr: "...", mai: "..." }
    defaultLanguage: DEFAULT_CALL_LANGUAGE,
    itemNames,
    amountWords,
  };
};

// Backwards-compatible single-script generator (defaults to English).
const generateConfirmationCallScript = (opts = {}) => {
  const { scripts } = generateConfirmationCallScripts(opts);
  return {
    script: scripts[DEFAULT_CALL_LANGUAGE],
    scripts,
  };
};

/**
 * Dispatch or prepare an automated phone call in the requested language.
 */
const initiateConfirmationCall = async ({
  customerPhone = "+91 98765 43210",
  customerName = "Customer",
  items = [],
  amountPaid = 0,
  isService = true,
  arrivalDetails = {},
  language,
} = {}) => {
  const callLanguage = normalizeLanguage(language);
  const languageCodes = Object.keys(CALL_LANGUAGES);
  const { scripts, itemNames } = generateConfirmationCallScripts({
    customerName,
    items,
    amountPaid,
    isService,
    arrivalDetails,
  });

  const script = scripts[callLanguage];
  const langMeta = CALL_LANGUAGES[callLanguage];

  const callId = `CALL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // TwiML representation for Twilio Voice compatibility
  const twiml = `
    <Response>
      <Say voice="${langMeta.voice}" language="${langMeta.twilioLang}">
        ${script}
      </Say>
    </Response>
  `.trim();

  // If Twilio credentials are configured in .env, attempt actual network call
  const hasTwilio =
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER &&
    !process.env.TWILIO_ACCOUNT_SID.includes("example");

  let externalCallSid = null;

  if (hasTwilio) {
    try {
      // Lazy load Twilio if available
      const twilio = require("twilio");
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      const call = await client.calls.create({
        twiml,
        to: customerPhone,
        from: process.env.TWILIO_PHONE_NUMBER,
      });
      externalCallSid = call.sid;
      console.log(`[Twilio Call Placed]: SID ${call.sid} to ${customerPhone} (${callLanguage})`);
    } catch (err) {
      console.warn(`[Twilio Call Failed]: ${err.message}. Using simulated browser caller.`);
    }
  }

  console.log(
    `[Confirmation Call Generated]: ${callId} for ${customerName} (${customerPhone}) in ${langMeta.label}`
  );

  return {
    success: true,
    callId,
    externalCallSid,
    customerPhone,
    customerName,
    language: callLanguage,
    languageLabel: langMeta.label,
    script,
    scripts,
    supportedLanguages: languageCodes.map((code) => ({
      code,
      label: CALL_LANGUAGES[code].label,
    })),
    twiml,
    itemNames,
    arrivalDetails,
    providerArrivalDetails: arrivalDetails,
    status: "ringing",
    triggeredAt: new Date(),
  };
};

module.exports = {
  CALL_LANGUAGES,
  DEFAULT_CALL_LANGUAGE,
  normalizeLanguage,
  generateConfirmationCallScripts,
  generateConfirmationCallScript,
  initiateConfirmationCall,
};
