"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Eye, EyeOff, Sparkles, ShieldCheck } from "lucide-react";
import { decryptKeepsake, KeepsakeConfig } from "@/lib/crypto";

interface PasswordGateProps {
  onUnlock: (config: KeepsakeConfig) => void;
}

export default function PasswordGate({ onUnlock }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auto-unlock if session passcode exists
  useEffect(() => {
    const saved = typeof window !== "undefined" ? sessionStorage.getItem("keepsake_passcode") : null;
    if (saved) {
      handleUnlock(saved, true);
    } else {
      setCheckingSession(false);
    }
  }, []);

  async function handleUnlock(passToTry: string, isSilent = false) {
    if (!passToTry.trim()) {
      setError("Please enter the passcode.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const config = await decryptKeepsake(passToTry.trim());
      if (typeof window !== "undefined") {
        sessionStorage.setItem("keepsake_passcode", passToTry.trim());
      }
      onUnlock(config);
    } catch (err) {
      if (!isSilent) {
        setError("Incorrect passcode. Please check and try again.");
      }
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("keepsake_passcode");
      }
    } finally {
      setLoading(false);
      setCheckingSession(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleUnlock(password);
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-deep text-gold">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
          <Sparkles size={36} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="geo relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden bg-emerald-deep text-cream">
      {/* Floating subtle sparkles in background */}
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-gold-soft pointer-events-none"
          style={{ left: `${(i * 33 + 7) % 100}%`, top: `${(i * 47 + 11) % 100}%` }}
          animate={{ opacity: [0, 0.8, 0], y: [0, -25] }}
          transition={{ duration: 4 + (i % 4), repeat: Infinity, delay: i * 0.25 }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative w-full max-w-md mx-auto rounded-3xl border border-gold/40 bg-emerald-deep/90 p-8 sm:p-10 shadow-2xl backdrop-blur-md"
        style={{
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(201, 162, 75, 0.2)",
        }}
      >
        {/* Decorative corner accents */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-gold/60 rounded-tl" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-gold/60 rounded-tr" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-gold/60 rounded-bl" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-gold/60 rounded-br" />

        {/* Header Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-gold/50 bg-emerald/60 text-gold shadow-lg">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            {loading ? <Unlock size={28} className="animate-pulse" /> : <Lock size={28} />}
          </motion.div>
        </div>

        {/* Title */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-sans tracking-widest text-gold-soft uppercase">
            <ShieldCheck size={13} /> Protected Keepsake
          </span>
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl gold-text leading-snug">
            A Farewell Gift
          </h1>
          <p className="mt-1 font-serif text-lg italic text-gold-soft/90">
            Sheikh Mehvish Qadir
          </p>
          <p className="mt-4 text-sm text-cream/70 font-sans leading-relaxed">
            This personal keepsake is private. Please enter your passcode to unlock your gift.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <motion.div
            animate={error ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Enter passcode"
              disabled={loading}
              autoFocus
              className="w-full rounded-xl border border-gold/40 bg-emerald/70 px-4 py-3.5 pr-12 text-center text-lg tracking-wider text-cream placeholder-cream/40 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/40 disabled:opacity-60 font-sans"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cream/50 transition hover:text-gold"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="text-center text-sm text-red-300 font-sans"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className="relative flex w-full items-center justify-center gap-2 rounded-xl border border-gold bg-gradient-to-r from-gold via-gold-soft to-gold py-3.5 font-serif text-lg font-semibold text-emerald-deep shadow-lg transition hover:brightness-105 active:scale-[0.99] disabled:opacity-60"
          >
            {loading ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="inline-block"
                >
                  <Sparkles size={18} />
                </motion.span>
                <span>Decrypting & Unlocking...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Unlock Keepsake</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-cream/40 font-sans">
          End-to-end client-side encrypted with AES-256-GCM.
        </div>
      </motion.div>
    </div>
  );
}
