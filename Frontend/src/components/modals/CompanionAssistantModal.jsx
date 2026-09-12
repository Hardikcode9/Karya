import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Sparkles, Send, Mic, MicOff, MapPin, Zap, ShieldCheck,
  Scale, HelpCircle, MessageSquare, Volume2, VolumeX, CheckCircle2
} from "lucide-react";
const workers = [];
import Button from "../ui/Button";
import VoiceVisualizer from "../voice/VoiceVisualizer";
import CompareAICard from "./CompareAICard";
import {
  DIALECTS,
  parseDialectQuery,
  generateDialectResponse,
  speakText
} from "../../utils/dialectVoiceEngine";

export default function CompanionAssistantModal({ isOpen, onClose, onOpenBooking }) {
  const [currentDialect, setCurrentDialect] = useState(DIALECTS[0]); // default English
  const [activeTab, setActiveTab] = useState("chat"); // 'chat' | 'compare' | 'capabilities'
  const [messages, setMessages] = useState(() => [
    {
      id: "welcome-1",
      sender: "bot",
      text: DIALECTS[0].welcome,
      chips: DIALECTS[0].chips,
    },
  ]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const handleSendRef = useRef(null);

  const handleSelectDialect = (dialect) => {
    setCurrentDialect(dialect);
    setMessages([
      {
        id: `welcome-${dialect.code}`,
        sender: "bot",
        text: dialect.welcome,
        chips: dialect.chips,
      },
    ]);
  };

  const handleSend = useCallback((textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsgId = `user-${Math.random().toString(36).substring(2, 9)}`;
    const botMsgId = `bot-${Math.random().toString(36).substring(2, 9)}`;

    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: userMsgId, sender: "user", text: query },
    ]);
    setInput("");

    // Process NLU & generate dialect-specific reply
    setTimeout(() => {
      const intent = parseDialectQuery(query, currentDialect.code);
      const dialectResult = generateDialectResponse(intent, currentDialect.code, workers);

      let matchedWorkers = [];
      if (dialectResult.compareMode) {
        matchedWorkers = workers.slice(0, 3);
      } else if (dialectResult.roleFilter) {
        matchedWorkers = workers
          .filter((w) => w.role.toLowerCase().includes(dialectResult.roleFilter.toLowerCase()))
          .slice(0, 2);
      } else {
        matchedWorkers = workers.slice(0, 2);
      }

      // Voice read out if enabled
      if (voiceEnabled) {
        setIsSpeaking(true);
        speakText(dialectResult.text, currentDialect.speechCode);
        setTimeout(() => setIsSpeaking(false), 3000);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          sender: "bot",
          text: dialectResult.text,
          workers: matchedWorkers,
          compareMode: dialectResult.compareMode,
          showRates: dialectResult.showRates,
          isEmergency: dialectResult.isEmergency,
          chips: currentDialect.chips.slice(0, 3),
        },
      ]);
    }, 450);
  }, [input, currentDialect, voiceEnabled]);

  useEffect(() => {
    handleSendRef.current = handleSend;
  }, [handleSend]);

  // Scroll to bottom of message list
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Web Speech Recognition setup
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = currentDialect.speechCode || "en-IN";

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsRecording(false);
          if (handleSendRef.current) {
            handleSendRef.current(transcript);
          }
        };

        recognition.onerror = () => {
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [currentDialect]);

  if (!isOpen) return null;

  const toggleRecording = () => {
    if (!isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.lang = currentDialect.speechCode || "en-IN";
          recognitionRef.current.start();
          setIsRecording(true);
        } catch {
          simulateVoiceInput();
        }
      } else {
        simulateVoiceInput();
      }
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    }
  };

  // Fallback simulation if browser blocks microphone
  const simulateVoiceInput = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      const sample = currentDialect.chips[0];
      handleSend(sample);
    }, 2200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-charcoal/50 dark:bg-black/70 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-2xl bg-cream dark:bg-dark-bg rounded-[2.25rem] shadow-2xl border border-charcoal/10 dark:border-dark-border overflow-hidden flex flex-col max-h-[88vh] z-10"
        >
          {/* Header */}
          <div className="bg-olive-950 dark:bg-dark-surface text-cream p-4 sm:p-5 flex items-center justify-between border-b border-white/10 dark:border-dark-border shrink-0">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-olive-700/60 dark:bg-olive-900/60 text-olive-300 flex items-center justify-center shadow-xs">
                <Sparkles size={20} />
              </span>
              <div>
                <h3 className="font-display text-base sm:text-lg text-cream flex items-center gap-2">
                  <span>Karya Compare & Voice AI</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-sans font-bold uppercase tracking-wider">
                    Online
                  </span>
                </h3>
                <p className="text-xs text-cream/60">
                  Multilingual Rural Voice Assistant & Smart Comparison Engine
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`p-2 rounded-full transition-colors ${
                  voiceEnabled ? "text-olive-300 hover:bg-white/10" : "text-white/40 hover:bg-white/10"
                }`}
                title={voiceEnabled ? "Voice Readout Enabled" : "Voice Readout Muted"}
              >
                {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-cream/70 hover:text-cream rounded-full hover:bg-cream/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Dialect Switcher Horizontal Pill Bar */}
          <div className="bg-ivory/90 dark:bg-dark-card px-3 sm:px-4 py-2 border-b border-charcoal/10 dark:border-dark-border flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50 dark:text-dark-muted shrink-0 mr-1">
              Dialect:
            </span>
            {DIALECTS.map((d) => {
              const isSelected = currentDialect.code === d.code;
              return (
                <button
                  key={d.code}
                  type="button"
                  onClick={() => handleSelectDialect(d)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 shrink-0 select-none ${
                    isSelected
                      ? "bg-olive-800 text-cream shadow-xs dark:bg-olive-600 font-bold"
                      : "bg-white/70 dark:bg-dark-surface text-charcoal/75 dark:text-dark-muted hover:text-charcoal hover:bg-white dark:hover:bg-dark-surface/80"
                  }`}
                >
                  <span>{d.flag}</span>
                  <span>{d.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mode Navigation Tabs */}
          <div className="grid grid-cols-3 bg-cream-card dark:bg-dark-surface border-b border-charcoal/5 dark:border-dark-border px-3 py-1.5 text-xs font-bold shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab("chat")}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all ${
                activeTab === "chat"
                  ? "bg-white dark:bg-dark-card text-olive-900 dark:text-olive-300 shadow-xs"
                  : "text-charcoal/60 dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text"
              }`}
            >
              <MessageSquare size={14} />
              <span>Voice & Chat</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("compare")}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all ${
                activeTab === "compare"
                  ? "bg-white dark:bg-dark-card text-olive-900 dark:text-olive-300 shadow-xs"
                  : "text-charcoal/60 dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text"
              }`}
            >
              <Scale size={14} />
              <span>Compare AI</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("capabilities")}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all ${
                activeTab === "capabilities"
                  ? "bg-white dark:bg-dark-card text-olive-900 dark:text-olive-300 shadow-xs"
                  : "text-charcoal/60 dark:text-dark-muted hover:text-charcoal dark:hover:text-dark-text"
              }`}
            >
              <HelpCircle size={14} />
              <span>What I Can Do</span>
            </button>
          </div>

          {/* Audio Waveform visualizer */}
          {(isRecording || isSpeaking) && (
            <div className="px-4 py-2 bg-cream-card dark:bg-dark-card border-b border-charcoal/5 dark:border-dark-border flex justify-center shrink-0">
              <VoiceVisualizer isListening={isRecording} isSpeaking={isSpeaking} />
            </div>
          )}

          {/* TAB 1: Voice & Chat View */}
          {activeTab === "chat" && (
            <>
              <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[90%] sm:max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        m.sender === "user"
                          ? "bg-olive-700 text-cream rounded-br-none shadow-sm"
                          : "bg-white dark:bg-dark-card text-charcoal dark:text-dark-text rounded-bl-none border border-charcoal/5 dark:border-dark-border shadow-xs"
                      }`}
                    >
                      {m.text}
                    </div>

                    {/* Compare AI side-by-side card */}
                    {m.compareMode && (
                      <CompareAICard
                        workers={m.workers || workers.slice(0, 3)}
                        onBook={(worker) => {
                          onClose();
                          if (onOpenBooking) onOpenBooking(worker);
                        }}
                      />
                    )}

                    {/* Standard Worker cards */}
                    {!m.compareMode && m.workers && m.workers.length > 0 && (
                      <div className="mt-2.5 w-full space-y-2">
                        {m.workers.map((w) => (
                          <div
                            key={w.id}
                            className="bg-white dark:bg-dark-card border border-olive-200 dark:border-dark-border rounded-2xl p-3 flex items-center justify-between gap-3 shadow-xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="w-10 h-10 rounded-xl bg-olive-100 dark:bg-olive-900/60 text-olive-800 dark:text-olive-300 font-bold flex items-center justify-center text-sm shrink-0">
                                {w.name[0]}
                              </span>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <h4 className="font-bold text-xs sm:text-sm text-charcoal dark:text-dark-text truncate">
                                    {w.name}
                                  </h4>
                                  <span className="text-[10px] font-bold bg-olive-100 dark:bg-olive-900/40 text-olive-800 dark:text-olive-300 px-1.5 py-0.5 rounded-full">
                                    {w.matchPercent}% match
                                  </span>
                                </div>
                                <p className="text-[11px] text-charcoal/60 dark:text-dark-muted flex items-center gap-1">
                                  <MapPin size={11} /> {w.village} · ₹{w.price}/{w.priceUnit || "day"}
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => {
                                onClose();
                                if (onOpenBooking) onOpenBooking(w);
                              }}
                              className="shrink-0 text-xs py-1.5 px-3"
                            >
                              Book
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Suggested Chips */}
                    {m.chips && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {m.chips.map((chip) => (
                          <button
                            key={chip}
                            type="button"
                            onClick={() => handleSend(chip)}
                            className="text-xs bg-white dark:bg-dark-card border border-charcoal/15 dark:border-dark-border text-charcoal/80 dark:text-dark-text hover:border-olive-600 hover:text-olive-800 dark:hover:text-olive-300 px-3 py-1 rounded-full transition-all shadow-xs"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Footer */}
              <div className="p-3 sm:p-4 bg-cream-card dark:bg-dark-surface border-t border-charcoal/10 dark:border-dark-border shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  <button
                    type="button"
                    onClick={toggleRecording}
                    className={`p-3 rounded-full transition-all shadow-xs ${
                      isRecording
                        ? "bg-rose-600 text-white animate-bounce ring-4 ring-rose-500/20"
                        : "bg-white dark:bg-dark-card text-charcoal/70 dark:text-dark-muted hover:text-olive-800 dark:hover:text-olive-300 border border-charcoal/10 dark:border-dark-border"
                    }`}
                    title="Tap to Speak"
                  >
                    {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                  </button>

                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Ask or speak in ${currentDialect.label}...`}
                    className="flex-1 bg-white dark:bg-dark-bg border border-charcoal/15 dark:border-dark-border rounded-full px-4 py-2.5 text-xs sm:text-sm outline-none focus:border-olive-600 dark:text-dark-text transition-colors"
                  />

                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="p-3 rounded-full bg-olive-700 text-cream hover:bg-olive-800 disabled:opacity-40 transition-colors shadow-xs"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </>
          )}

          {/* TAB 2: Compare AI Dedicated View */}
          {activeTab === "compare" && (
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-display font-medium text-lg text-charcoal dark:text-dark-text">
                    Specialist Comparison Matrix
                  </h4>
                  <p className="text-xs text-charcoal/60 dark:text-dark-muted">
                    Compare verified tradespeople side-by-side to choose the best fit for your budget and timeline.
                  </p>
                </div>
              </div>

              <CompareAICard
                workers={workers.slice(0, 3)}
                onBook={(worker) => {
                  onClose();
                  if (onOpenBooking) onOpenBooking(worker);
                }}
              />

              {/* Standard Wage Comparison Table */}
              <div className="rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border p-4 shadow-xs">
                <h5 className="font-bold text-xs uppercase tracking-wider text-charcoal/50 dark:text-dark-muted mb-3">
                  Panchayat Standard Benchmark Rates vs Market
                </h5>
                <div className="divide-y divide-charcoal/5 dark:divide-dark-border text-xs">
                  <div className="py-2 flex justify-between">
                    <span className="font-semibold text-charcoal dark:text-dark-text">Electrician Day-Rate</span>
                    <span className="text-olive-700 dark:text-olive-400 font-bold">₹350 – ₹450 / day</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="font-semibold text-charcoal dark:text-dark-text">Plumber Visit & Overhaul</span>
                    <span className="text-olive-700 dark:text-olive-400 font-bold">₹300 – ₹400 / visit</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="font-semibold text-charcoal dark:text-dark-text">Carpenter Woodcraft</span>
                    <span className="text-olive-700 dark:text-olive-400 font-bold">₹450 – ₹550 / day</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="font-semibold text-charcoal dark:text-dark-text">Tractor Field Tilling (per Acre)</span>
                    <span className="text-olive-700 dark:text-olive-400 font-bold">₹800 – ₹1,000 / acre</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-olive-50 dark:bg-olive-950/40 border border-olive-500/20 text-xs text-olive-900 dark:text-olive-300 flex items-center gap-2.5">
                <CheckCircle2 size={18} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>Karya enforces 0% broker deductions. 100% of your payment reaches the worker.</span>
              </div>
            </div>
          )}

          {/* TAB 3: What I Can Do (Capabilities Showcase) */}
          {activeTab === "capabilities" && (
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
              <div>
                <h4 className="font-display font-medium text-lg text-charcoal dark:text-dark-text">
                  What Karya AI Can Do
                </h4>
                <p className="text-xs text-charcoal/60 dark:text-dark-muted">
                  Explore how our intelligent rural assistant bridges digital access with local vernacular understanding.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div
                  onClick={() => {
                    setActiveTab("chat");
                    handleSend("Compare 3 best technicians side by side");
                  }}
                  className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border hover:border-olive-500 cursor-pointer transition-all shadow-xs space-y-1.5"
                >
                  <div className="w-8 h-8 rounded-xl bg-olive-100 dark:bg-olive-900/50 text-olive-800 dark:text-olive-300 flex items-center justify-center">
                    <Scale size={16} />
                  </div>
                  <h5 className="font-bold text-sm text-charcoal dark:text-dark-text">
                    1. Smart Worker Comparison
                  </h5>
                  <p className="text-xs text-charcoal/60 dark:text-dark-muted leading-relaxed">
                    Compare quotes, travel distance, star ratings, and verified KYC credentials in a clear matrix.
                  </p>
                  <span className="text-[11px] font-bold text-olive-700 dark:text-olive-400 inline-block pt-1">
                    Try Comparison →
                  </span>
                </div>

                <div
                  onClick={() => {
                    setActiveTab("chat");
                    handleSend("What are the standard village rates for plumbing and carpentry?");
                  }}
                  className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border hover:border-olive-500 cursor-pointer transition-all shadow-xs space-y-1.5"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 flex items-center justify-center">
                    <Zap size={16} />
                  </div>
                  <h5 className="font-bold text-sm text-charcoal dark:text-dark-text">
                    2. Fair Wage & Rate Assurance
                  </h5>
                  <p className="text-xs text-charcoal/60 dark:text-dark-muted leading-relaxed">
                    Check official panchayat benchmarks so you never overpay and workers receive fair remuneration.
                  </p>
                  <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 inline-block pt-1">
                    Check Rates →
                  </span>
                </div>

                <div
                  onClick={() => {
                    setActiveTab("chat");
                    handleSend("I need emergency electrician immediately for short circuit");
                  }}
                  className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border hover:border-rose-500 cursor-pointer transition-all shadow-xs space-y-1.5"
                >
                  <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-300 flex items-center justify-center">
                    <ShieldCheck size={16} />
                  </div>
                  <h5 className="font-bold text-sm text-charcoal dark:text-dark-text">
                    3. Rapid SOS Emergency Dispatch
                  </h5>
                  <p className="text-xs text-charcoal/60 dark:text-dark-muted leading-relaxed">
                    Trigger urgent alerts to all on-call technicians within a 10 km radius for immediate dispatch.
                  </p>
                  <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 inline-block pt-1">
                    Simulate SOS →
                  </span>
                </div>

                <div
                  onClick={() => {
                    const mew = DIALECTS.find((d) => d.code === "mew") || DIALECTS[0];
                    handleSelectDialect(mew);
                    setActiveTab("chat");
                  }}
                  className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-dark-border hover:border-emerald-500 cursor-pointer transition-all shadow-xs space-y-1.5"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
                    <Sparkles size={16} />
                  </div>
                  <h5 className="font-bold text-sm text-charcoal dark:text-dark-text">
                    4. 6-Dialect Natural Voice Processing
                  </h5>
                  <p className="text-xs text-charcoal/60 dark:text-dark-muted leading-relaxed">
                    Speaks and understands English, Hindi, Bengali, Mewadi, Malayalam, and Bihari / Bhojpuri fluently.
                  </p>
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 inline-block pt-1">
                    Switch Dialect →
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
