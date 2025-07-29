import { createFeature } from "@/features/manager";
import { CaidoSDK } from "@/types";

let intervalId: NodeJS.Timeout | undefined;

interface TimeFilter {
  name: string;
  minutes: number;
}

const TIME_FILTERS: TimeFilter[] = [
  { name: "recent", minutes: 5 },
  { name: "1hr", minutes: 60 },
  { name: "6hr", minutes: 360 },
  { name: "12hr", minutes: 720 },
  { name: "24hr", minutes: 1440 }
];

const createTimeBasedFilterQuery = (minutes: number): string => {
  const now = new Date();
  const pastTime = new Date(now.getTime() - (minutes * 60 * 1000));
  const formattedDate = pastTime.getFullYear() + '-' +
    String(pastTime.getMonth() + 1).padStart(2, '0') + '-' +
    String(pastTime.getDate()).padStart(2, '0') + ' ' +
    String(pastTime.getHours()).padStart(2, '0') + ':' +
    String(pastTime.getMinutes()).padStart(2, '0') + ':' +
    String(pastTime.getSeconds()).padStart(2, '0');
  return `req.created_at.gt:"${formattedDate}"`;
};

const maintainTimeFilters = async (sdk: CaidoSDK) => {
  try {
    // Get all existing filters
    const existingFilters = sdk.filters.getAll();

    for (const timeFilter of TIME_FILTERS) {
      const filterQuery = createTimeBasedFilterQuery(timeFilter.minutes);

      // Check if filter already exists
      const existingFilter = existingFilters.find(
        (filter: any) => filter.name === timeFilter.name
      );

      if (existingFilter) {
        // Update existing filter if the query has changed
        if (existingFilter.query !== filterQuery) {
          await sdk.filters.update(existingFilter.id, {
            name: timeFilter.name,
            alias: timeFilter.name,
            query: filterQuery
          });
        }
      } else {
        // Create new filter
        await sdk.filters.create({
          name: timeFilter.name,
          alias: timeFilter.name,
          query: filterQuery
        });
      }
    }
  } catch (error) {
    console.error("Error maintaining time filters:", error);
  }
};

const startFilterMaintenance = (sdk: CaidoSDK) => {
  // Run immediately
  maintainTimeFilters(sdk);

  // Then run every minute
  intervalId = setInterval(() => {
    maintainTimeFilters(sdk);
  }, 60000); // 60,000ms = 1 minute
};

const stopFilterMaintenance = async (sdk: CaidoSDK) => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = undefined;
  }

  try {
    // Get all existing filters
    const existingFilters = sdk.filters.getAll();

    // Remove any filters that match our time filter names
    for (const timeFilter of TIME_FILTERS) {
      const existingFilter = existingFilters.find(
        (filter: any) => filter.name === timeFilter.name
      );

      if (existingFilter) {
        await sdk.filters.delete(existingFilter.id);
      }
    }
  } catch (error) {
    console.error("Error cleaning up time filters:", error);
    sdk.window.showToast("[EvenBetter] Error cleaning up time filters", {
        variant: "error"
    });
  }
};

export default createFeature("common-filters", {
  onFlagEnabled: (sdk: CaidoSDK) => {
    startFilterMaintenance(sdk);
  },
  onFlagDisabled: (sdk: CaidoSDK) => {
    stopFilterMaintenance(sdk);
  }
});
