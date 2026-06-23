

async function gamedata() {
    try {
        const response = await fetch(`https://6a37d27fc105017aa6395867.mockapi.io/games`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching game data:", error);
        throw error;
    }
}

export { gamedata };