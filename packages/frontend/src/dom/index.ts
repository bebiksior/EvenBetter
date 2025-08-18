export const initDOMManager = () => {
  patchHistoryMethod("pushState");
  patchHistoryMethod("replaceState");

  window.addEventListener("popstate", notify);
  window.addEventListener("hashchange", notify);
  window.addEventListener("locationchange", notify);

  // we need to wait for the Caido app to be fully loaded, this is obviously a hack while we wait for the APIs to be ready
  setTimeout(() => {
    let attempts = 0;
    const maxAttempts = 10;

    const checkInterval = setInterval(() => {
      attempts++;

      if (document.querySelector(".c-topbar__environment")) {
        clearInterval(checkInterval);
        for (const cb of subscribers) {
          cb({ oldHash: lastHash, newHash: lastHash });
        }
        return;
      }

      if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        for (const cb of subscribers) {
          cb({ oldHash: lastHash, newHash: lastHash });
        }
      }
    }, 50);
  }, 150);
};

// Temporary workaround for missing sdk.navigation.onPageChange
type LocationChange = {
  oldHash: string;
  newHash: string;
};

export type Callback = (change: LocationChange) => void;

const subscribers = new Set<Callback>();
let lastHash = window.location.hash;

function notify(): void {
  const newHash = window.location.hash;
  if (newHash === lastHash) return;

  setTimeout(() => {
    for (const cb of subscribers) {
      try {
        cb({ oldHash: lastHash, newHash });
      } catch {
        // ignore
      }
    }
  }, 1);

  lastHash = newHash;
}

const patchHistoryMethod = (method: "pushState" | "replaceState"): void => {
  const original = history[method];
  history[method] = function (...args: Parameters<typeof original>) {
    const result = original.apply(this, args);
    window.dispatchEvent(new Event("locationchange"));
    return result;
  };
};

export function onLocationChange(cb: Callback): () => void {
  subscribers.add(cb);
  return () => {
    subscribers.delete(cb);
  };
}
