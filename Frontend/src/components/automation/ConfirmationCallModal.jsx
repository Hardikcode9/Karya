import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone, PhoneCall, PhoneOff, RotateCcw,
  CheckCircle2, Clock, MapPin, User, Sparkles, X, Languages
} from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

// Browser TTS language code per call language. Maithili has no browser voice;
// Hindi is the closest phonetic match and is understood by Maithili speakers.
const TTS_LANG_BY_CODE = {
  en: "en-IN",
  hi: "hi-IN",
  bn: "bn-IN",
  mr: "mr-IN",
  mai: "hi-IN",
};

const FALLBACK_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "bn", label: "বাংলা" },
  { code: "mr", label: "मराठी" },
  { code: "mai", label: "मैथिली" },
];

export default function ConfirmationCallModal({
  isOpen,
  onClose,
  callData,
  onCallCompleted,
}) {
  const { current: appLanguage } = useLanguage();
  const [callState, setCallState] = useState("ringing"); // 'ringing' | 'connected' | 'ended'
  const [callDuration, setCallDuration] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioBars, setAudioBars] = useState([40, 60, 30, 80, 50, 70, 45, 90]);
  // Start in the user's app language when the backend supports it
  const [activeLang, setActiveLang] = useState("en");

  const audioContextRef = useRef(null);
  const ringtoneIntervalRef = useRef(null);
  const timerRef = useRef(null);
  const synthRef = useRef(typeof window !== "undefined" ? window.speechSynthesis : null);
  const utteranceRef = useRef(null);

  const customerName = callData?.customerName || "Customer";

  // Per-language scripts from the backend; fall back to a single English script.
  const scriptsByLang = callData?.scripts || null;
  const supportedLanguages =
    callData?.supportedLanguages?.length > 0
      ? callData.supportedLanguages
      : FALLBACK_LANGUAGES;

  // Resolve the script for a language (object or Map from Mongoose).
  const scriptFor = useCallback(
    (code) => {
      if (scriptsByLang) {
        if (typeof scriptsByLang.get === "function") {
          const v = scriptsByLang.get(code);
          if (v) return v;
        } else if (scriptsByLang[code]) {
          return scriptsByLang[code];
        }
      }
      return (
        callData?.script ||
        `Namaste ${customerName}! This is the Karya Automated Dispatch Service calling to confirm your recent booking. Your payment has been verified, and your digital receipt and thank-you note have been sent to your email. Your verified service specialist is scheduled to arrive at your address within 45 minutes. Thank you for supporting rural livelihoods!`
      );
    },
    [scriptsByLang, callData?.script, customerName]
  );

  // Default the call language to the user's app language when the call data arrives,
  // and reset the call state so "Reopen Call" starts a fresh ringing session.
  useEffect(() => {
    if (isOpen && callData) {
      const preferred = TTS_LANG_BY_CODE[appLanguage] ? appLanguage : "en";
      setActiveLang(preferred);
      setCallState("ringing");
      setCallDuration(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, callData]);

  const script = scriptFor(activeLang);
  const arrivalDetails = callData?.arrivalDetails || callData?.providerArrivalDetails || {
    providerName: "Ramesh Kumar",
    serviceName: "Electrical Maintenance",
    arrivalWindow: "Today at 03:30 PM (Within 45 mins)",
    address: "Ward #4, Near Panchayat Bhavan, Rampur",
    providerPhone: "+91 98234 56789",
  };

  const stopAllAudio = useCallback(() => {
    if (ringtoneIntervalRef.current) clearInterval(ringtoneIntervalRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    if (synthRef.current && synthRef.current.speaking) {
      synthRef.current.cancel();
    }
    setIsSpeaking(false);
  }, []);

  // Play synthetic telephone ring tone using Web Audio API
  const playRingtoneBeep = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (!ctx || ctx.state === "suspended") return;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc2.type = "sine";
      osc1.frequency.setValueAtTime(440, ctx.currentTime);
      osc2.frequency.setValueAtTime(480, ctx.currentTime);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 1.2);
      osc2.stop(ctx.currentTime + 1.2);
    } catch {
      // Audio context might require initial user gesture
    }
  }, []);

  // Manage Ringing State
  useEffect(() => {
    if (isOpen) {
      // Trigger ringtone intervals
      playRingtoneBeep();
      ringtoneIntervalRef.current = setInterval(() => {
        playRingtoneBeep();
      }, 3000);
    } else {
      stopAllAudio();
    }

    return () => {
      stopAllAudio();
    };
  }, [isOpen, playRingtoneBeep, stopAllAudio]);

  // Audio animation visualizer loop when connected
  useEffect(() => {
    let animInterval;
    if (callState === "connected" && isSpeaking) {
      animInterval = setInterval(() => {
        setAudioBars([
          Math.floor(20 + Math.random() * 80),
          Math.floor(30 + Math.random() * 70),
          Math.floor(15 + Math.random() * 85),
          Math.floor(40 + Math.random() * 60),
          Math.floor(25 + Math.random() * 75),
          Math.floor(35 + Math.random() * 65),
          Math.floor(20 + Math.random() * 80),
          Math.floor(30 + Math.random() * 70),
        ]);
      }, 120);
    } else {
      setAudioBars([15, 20, 15, 25, 20, 15, 20, 15]);
    }
    return () => clearInterval(animInterval);
  }, [callState, isSpeaking]);

  // Timer counter when connected
  useEffect(() => {
    if (callState === "connected") {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [callState]);

  // Answer call & initiate speech synthesis
  const handleAnswerCall = () => {
    if (ringtoneIntervalRef.current) clearInterval(ringtoneIntervalRef.current);
    setCallState("connected");
    speakScript(script);
  };

  const speakScript = (textToSpeak, langCode = activeLang) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    // Pick a voice that matches the call language (Indic voices first).
    const wantedLang = TTS_LANG_BY_CODE[langCode] || "en-IN";
    const voices = synthRef.current.getVoices();
    const exact = voices.find((v) => v.lang.replace("_", "-") === wantedLang);
    const partial = voices.find(
      (v) => v.lang.toLowerCase().startsWith(wantedLang.split("-")[0])
    );
    const indianFallback = voices.find(
      (v) =>
        v.lang.includes("en-IN") ||
        v.name.includes("India") ||
        v.name.includes("Kavya") ||
        v.name.includes("Rishi") ||
        v.name.includes("Heera")
    );
    const chosen = exact || partial || indianFallback;
    if (chosen) utterance.voice = chosen;
    utterance.lang = wantedLang;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      if (onCallCompleted) onCallCompleted();
    };
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  // Switch the call language live: update transcript and re-speak immediately.
  const handleSwitchLanguage = (code) => {
    if (code === activeLang) return;
    setActiveLang(code);
    if (callState === "connected") {
      speakScript(scriptFor(code), code);
    }
  };

  const handleDeclineOrHangup = () => {
    stopAllAudio();
    setCallState("ended");
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleReplay = () => {
    speakScript(script);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${rem < 10 ? "0" : ""}${rem}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl shadow-2xl border border-slate-700/60 overflow-hidden flex flex-col"
        >
          {/* Top Bar */}
          <div className="p-4 flex items-center justify-between border-b border-slate-700/40">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Automated Dispatch System
            </div>
            <button
              onClick={handleDeclineOrHangup}
              className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-700/50 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Call Body */}
          <div className="p-6 flex flex-col items-center text-center space-y-6">
            {/* Caller Identity */}
            <div className="space-y-1">
              <div className="relative mx-auto mb-3">
                <div
                  className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                    callState === "ringing"
                      ? "bg-emerald-500/20 text-emerald-400 ring-8 ring-emerald-500/20 animate-pulse"
                      : callState === "connected"
                      ? "bg-emerald-600 text-white ring-8 ring-emerald-500/30"
                      : "bg-rose-500/20 text-rose-400"
                  }`}
                >
                  {callState === "ringing" ? (
                    <PhoneCall size={40} className="animate-bounce" />
                  ) : callState === "connected" ? (
                    <Phone size={40} />
                  ) : (
                    <PhoneOff size={40} />
                  )}
                </div>
              </div>

              <h3 className="font-display text-2xl font-bold text-slate-100">
                Karya Dispatch Center
              </h3>
              <p className="text-sm font-medium text-emerald-400">
                +91 8000-KARYA (Toll Free)
              </p>
              <p className="text-xs text-slate-400">
                {callState === "ringing" && "Incoming Order & Arrival Confirmation..."}
                {callState === "connected" && `Call in progress • ${formatTime(callDuration)}`}
                {callState === "ended" && "Call Finished"}
              </p>
              <p className="text-[10px] text-emerald-400/80 font-semibold flex items-center justify-center gap-1">
                <Languages size={10} />
                Speaking: {supportedLanguages.find((l) => l.code === activeLang)?.label || activeLang}
              </p>
            </div>

            {/* Audio Waveform when connected */}
            {callState === "connected" && (
              <div className="w-full space-y-3">
                <div className="flex items-center justify-center gap-1.5 h-10 px-4 bg-slate-800/80 rounded-2xl border border-slate-700/50">
                  {audioBars.map((height, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.12 }}
                      className="w-1.5 bg-emerald-400 rounded-full"
                    />
                  ))}
                </div>

                {/* Language Selector */}
                <div className="space-y-1.5">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1 px-1">
                    <Languages size={11} /> Call Language
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {supportedLanguages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => handleSwitchLanguage(l.code)}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                          activeLang === l.code
                            ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30"
                            : "bg-slate-800/80 text-slate-300 border border-slate-700 hover:border-emerald-500/50 hover:text-white"
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Transcript / Script */}
                <div className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/40 text-left text-xs leading-relaxed text-slate-300 max-h-32 overflow-y-auto space-y-1">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1">
                    <Sparkles size={11} /> Live Voice Transcript
                  </div>
                  <p className="italic font-normal text-slate-200">"{script}"</p>
                </div>

                {/* Service Provider Arrival Notice Card */}
                {arrivalDetails && (
                  <div className="w-full text-left p-3.5 bg-emerald-950/60 rounded-2xl border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-emerald-400" />
                        Service Provider Dispatched
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-semibold">
                        Arriving Soon
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
                      <div className="flex items-center gap-1.5">
                        <User size={13} className="text-emerald-400 shrink-0" />
                        <span className="truncate font-semibold">{arrivalDetails.providerName}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} className="text-emerald-400 shrink-0" />
                        <span className="truncate">{arrivalDetails.arrivalWindow}</span>
                      </div>
                      <div className="col-span-2 flex items-start gap-1.5 text-[11px] text-slate-400">
                        <MapPin size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{arrivalDetails.address}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="p-6 bg-slate-900/90 border-t border-slate-800/80">
            {callState === "ringing" ? (
              <div className="flex items-center justify-around gap-4">
                <button
                  onClick={handleDeclineOrHangup}
                  className="flex-1 py-3 px-4 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-400 font-semibold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <PhoneOff size={16} /> Decline
                </button>
                <button
                  onClick={handleAnswerCall}
                  className="flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 animate-pulse transition-all"
                >
                  <PhoneCall size={16} /> Answer Call
                </button>
              </div>
            ) : callState === "connected" ? (
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={handleReplay}
                  className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
                  title="Replay Voice Announcement"
                >
                  <RotateCcw size={14} /> Replay
                </button>

                <button
                  onClick={handleDeclineOrHangup}
                  className="flex-1 py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/30 transition-all"
                >
                  <PhoneOff size={14} /> End Call
                </button>
              </div>
            ) : (
              <div className="text-center text-xs text-slate-400 font-medium py-1">
                Call ended. Thank you for choosing Karya!
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
