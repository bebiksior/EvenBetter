import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { caidoTheme, StyledSplitter } from "caido-material-ui";
import "allotment/dist/style.css";
import "./styles/style.css";
import { SDKProvider } from "./context/SDKContext";
import { CaidoSDK } from "@/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FlagsList } from "@/components/settings/FlagsList";
import { Settings } from "@/components/settings/Settings";
import { EvenBetterAPI } from "@bebiks/evenbetter-api";
import { EBApiProvider } from "@/context/EBApiContext";

const queryClient = new QueryClient();

interface AppProps {
  sdk: CaidoSDK;
  evenBetterAPI: EvenBetterAPI;
}

export const App = ({ sdk, evenBetterAPI }: AppProps) => {
  return (
    <EBApiProvider evenBetterAPI={evenBetterAPI}>
      <SDKProvider sdk={sdk}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={caidoTheme}>
            <Content />
          </ThemeProvider>
        </QueryClientProvider>
      </SDKProvider>
    </EBApiProvider>
  );
};

const Content = () => {
  return (
    <StyledSplitter>
      <Settings />
      <FlagsList />
    </StyledSplitter>
  );
};
