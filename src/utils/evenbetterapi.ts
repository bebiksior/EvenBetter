import { EvenBetterAPI } from "@bebiks/evenbetter-api";

let evenBetterAPI: EvenBetterAPI | null = null;

export const setEvenBetterAPI = (api: EvenBetterAPI) => {
    evenBetterAPI = api;
}

export const getEvenBetterAPI = () => {
    if (!evenBetterAPI) {
        throw new Error("EvenBetterAPI is not set yet!");
    }
    
    return evenBetterAPI;
}