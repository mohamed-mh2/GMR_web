export async function getGamingNews() {
  const response = await fetch(
`https://6a381ecdc105017aa639ac4d.mockapi.io/news`  );
  if (!response.ok) {
    throw new Error("Failed to fetch gaming news");
  }

  const data = await response.json();
  return data;
}

getGamingNews()

console.log(getGamingNews());