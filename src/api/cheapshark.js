// Functions for calling the CheapShark API (fetch game lists, game details, etc.)
const base_url = "https://www.cheapshark.com/api/1.0";

// sortBy API call
export const fetchDeals = async(sortBy = 'dealRating') => {
    try {
        const response = await fetch(`${base_url}/deals?sortBy=${sortBy}`);
        return await response.json();
    } catch(error) {
        console.error(error);
    }
};