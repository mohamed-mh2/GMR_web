export async function getGamingNews() {
  const response = await fetch(
`https://6a381ecdc105017aa639ac4d.mockapi.io/news`  );
  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Failed to fetch gaming news (${response.status}): ${text}`
    );
  }

  const data = await response.json();
  return data;
}
