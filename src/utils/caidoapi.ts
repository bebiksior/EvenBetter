import type { Caido } from "@caido/sdk-frontend";

let CaidoAPI: Caido | null = null;

export const setCaidoAPI = (caido: Caido) => {
    CaidoAPI = caido;
}

export const getCaidoAPI = () => {
    if (!CaidoAPI) {
        throw new Error("CaidoAPI is not set yet!");
    }
    
    return CaidoAPI;
}