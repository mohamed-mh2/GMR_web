const USERGAMES_API_URL = "https://6a37d27fc105017aa6395867.mockapi.io/usergames";

function normalizeList(data) {
	return Array.isArray(data) ? data : data.value || [];
}

async function getUserGames() {
	const response = await fetch(USERGAMES_API_URL);

	if (!response.ok) {
		throw new Error(`Failed to fetch user games (${response.status})`);
	}

	const data = await response.json();
	return normalizeList(data);
}

async function getUserGame(id) {
	const response = await fetch(`${USERGAMES_API_URL}/${id}`);

	if (!response.ok) {
		throw new Error(`Failed to fetch user game (${response.status})`);
	}

	return response.json();
}

async function createUserGame(userGame) {
	const response = await fetch(USERGAMES_API_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(userGame),
	});

	if (!response.ok) {
		throw new Error(`Failed to create user game (${response.status})`);
	}

	return response.json();
}

async function updateUserGame(id, userGame) {
	const response = await fetch(`${USERGAMES_API_URL}/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(userGame),
	});

	if (!response.ok) {
		throw new Error(`Failed to update user game (${response.status})`);
	}

	return response.json();
}

async function deleteUserGame(id) {
	const response = await fetch(`${USERGAMES_API_URL}/${id}`, {
		method: "DELETE",
	});

	if (!response.ok) {
		throw new Error(`Failed to delete user game (${response.status})`);
	}

	return response.json();
}

export { getUserGames, getUserGame, createUserGame, updateUserGame, deleteUserGame };
