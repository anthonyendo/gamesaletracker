// Functions for calling the CheapShark API (fetch game lists, game details, etc.)
const base_url = "https://www.cheapshark.com/api/1.0";

// sortBy API call
export const fetchDeals = async(sortBy = 'dealRating', pageNumber = 0, pageSize = 12, title = '') => {
    try {
        const response = await fetch(`${base_url}/deals?sortBy=${sortBy}&pageNumber=${pageNumber}&pageSize=${pageSize}&title=${title}`);
        return await response.json();
    } catch(error) {
        console.error(error);
    }
};

export const fetchDealById = async (dealID) => {
    try {
        const response = await fetch(`https://www.cheapshark.com/api/1.0/deals?id=${encodeURIComponent(dealID)}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching deal by ID:", error);
    }
};

export const fetchStores = async () => {
    try {
      const response = await fetch("https://www.cheapshark.com/api/1.0/stores");
      return await response.json();
    } catch (error) {
      console.error("Error fetching stores:", error);
      return [];
    }
};
  
