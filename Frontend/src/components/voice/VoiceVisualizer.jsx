import { motion } from "framer-motion";

export default function VoiceVisualizer({ isListening, isSpeaking }) {
  const bars = [14, 28, 42, 20, 36, 50, 24, 40, 16];

  if (!isListening && !isSpeaking) return null;

  return (
    <div className="flex items-center justify-center gap-1 py-2 px-4 bg-olive-900/10 dark:bg-olive-400/10 rounded-full border border-olive-500/20">
      <span className="text-[10px] font-bold uppercase tracking-wider text-olive-800 dark:text-olive-300 mr-1.5">
        {isListening ? "Listening..." : "Speaking..."}
      </span>
      {bars.map((height, idx) => (
        <motion.span
          key={idx}
          animate={{
            scaleY: [0.3, 1, 0.4, 0.9, 0.2],
          }}
          transition={{
            duration: 0.6 + (idx % 3) * 0.2,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: idx * 0.08,
          }}
          style={{ height: `${height * 0.4}px` }}
          className={`w-1 rounded-full ${
            isListening ? "bg-rose-500" : "bg-olive-600 dark:bg-olive-400"
          }`}
        />
      ))}
    </div>
  );
}
