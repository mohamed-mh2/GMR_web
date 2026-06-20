const API_KEY = "pub_fc4e854139a84bb9b15ac751048d3e6c";
const BASE_URL = "https://gnews.io/api/v4";

export async function getGamingNews() {
  const response = await fetch(
    `${BASE_URL}/search?q=gaming&lang=en&max=10&apikey=${API_KEY}`
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Failed to fetch gaming news (${response.status}): ${text}`
    );
  }

  const data = await response.json();
  return data.articles;
}