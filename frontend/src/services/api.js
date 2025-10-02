import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "/v1";

export async function searchRoutes(from, to) {
  try {
    console.log(`Searching routes from ${from} to ${to}`);
    const response = await axios.post(`${API_URL}/search`, {
      from_city: from,
      to_city: to,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching routes:", error);
    throw error;
  }
}
