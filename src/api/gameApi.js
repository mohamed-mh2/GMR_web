const apikey = "b9ae5e154e864a1985c1d00025ee238e";

async function gamedata() {
    try {
        const response = await fetch(`https://api.rawg.io/api/games?key=${apikey}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching game data:", error);
        throw error;
    }
}

gamedata()

export { gamedata };