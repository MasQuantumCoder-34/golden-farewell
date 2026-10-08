"use client";
import React, { createContext, useContext } from "react";
import type { KeepsakeConfig } from "./crypto";
import { defaultConfig } from "./config";

interface ConfigContextType {
  config: KeepsakeConfig;
  lock: () => void;
}

const ConfigContext = createContext<ConfigContextType>({
  config: defaultConfig,
  lock: () => {},
});

export function ConfigProvider({
  config,
  onLock,
  children,
}: {
  config: KeepsakeConfig;
  onLock: () => void;
  children: React.ReactNode;
}) {
  return (
    <ConfigContext.Provider value={{ config, lock: onLock }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  return useContext(ConfigContext).config;
}

export function useLock() {
  return useContext(ConfigContext).lock;
}
