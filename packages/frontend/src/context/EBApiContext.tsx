import React, { createContext, useContext, ReactNode } from "react";
import { EvenBetterAPI } from "@bebiks/evenbetter-api";

const EBApiContext = createContext<EvenBetterAPI | null>(null);

interface EBApiProviderProps {
  evenBetterAPI: EvenBetterAPI;
  children: ReactNode;
}

export const EBApiProvider = ({ evenBetterAPI, children }: EBApiProviderProps) => {
  return <EBApiContext.Provider value={evenBetterAPI}>{children}</EBApiContext.Provider>;
};

export const useEBApi = (): EvenBetterAPI => {
  const context = useContext(EBApiContext);
  if (context === null) {
    throw new Error("useEBApi must be used within an EBApiProvider");
  }
  return context;
};
