"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MemoryFrame from "@/components/MemoryFrame";
import PasswordGate from "@/components/PasswordGate";
import { ConfigProvider } from "@/lib/config-context";
import type { KeepsakeConfig } from "@/lib/crypto";
import {
  Nav,
  Hero,
  FarewellSection,
  PhdSection,
  DuaSection,
  FrameSection,
  MemoryWall,
  DistanceSection,
  FinalMessage,
} from "@/components/Sections";

export default function Page() {
  const [config, setConfig] = useState<KeepsakeConfig | null>(null);

  function handleLock() {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("keepsake_passcode");
    }
    setConfig(null);
  }

  return (
    <AnimatePresence mode="wait">
      {!config ? (
        <motion.div
          key="gate"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PasswordGate onUnlock={setConfig} />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <ConfigProvider config={config} onLock={handleLock}>
            <main>
              <Nav />
              <Hero onOpen={() => document.getElementById("farewell")?.scrollIntoView({ behavior: "smooth" })} />
              <FarewellSection />
              <PhdSection />
              <DuaSection />
              <FrameSection>
                <MemoryFrame />
              </FrameSection>
              <MemoryWall />
              <DistanceSection />
              <FinalMessage />
            </main>
          </ConfigProvider>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
