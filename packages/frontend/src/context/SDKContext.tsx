import React, { createContext, useContext, ReactNode } from "react";
import { CaidoSDK } from "../types";

const SDKContext = createContext<CaidoSDK | null>(null);

interface SDKProviderProps {
  sdk: CaidoSDK;
  children: ReactNode;
}

export const SDKProvider = ({ sdk, children }: SDKProviderProps) => {
  return <SDKContext.Provider value={sdk}>{children}</SDKContext.Provider>;
};

export const useSDK = (): CaidoSDK => {
  const context = useContext(SDKContext);
  if (context === null) {
    throw new Error("useSDK must be used within an SDKProvider");
  }
  return context;
};
