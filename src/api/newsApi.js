const API_KEY = "0625e4975022a20f7b9a74a7d5364c72";
const BASE_URL = "https://gnews.io/api/v4";

export async function getGamingNews() {
  const response = await fetch(
    `https://gnews.io/api/v4/search?q=gaming&lang=en&max=10&apikey=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch gaming news");
  }

  const data = await response.json();
  return data.articles;
}

getGamingNews()

console.log(getGamingNews());