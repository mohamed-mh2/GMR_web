const PROFILE_API_URL = "https://6a37d27fc105017aa6395867.mockapi.io/profile";

function normalizeList(data) {
	const list = Array.isArray(data) ? data : data.value || [];

	return list.map((item, index) => ({
		id: item.id || String(index + 1),
		...item,
	}));
}

async function getProfiles() {
	const response = await fetch(PROFILE_API_URL);

	if (!response.ok) {
		throw new Error(`Failed to fetch profiles (${response.status})`);
	}

	const data = await response.json();
	return normalizeList(data);
}

async function getProfile(id) {
	const response = await fetch(`${PROFILE_API_URL}/${id}`);

	if (!response.ok) {
		throw new Error(`Failed to fetch profile (${response.status})`);
	}

	return response.json();
}

async function createProfile(profile) {
	const response = await fetch(PROFILE_API_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(profile),
	});

	if (!response.ok) {
		throw new Error(`Failed to create profile (${response.status})`);
	}

	return response.json();
}

async function updateProfile(id, profile) {
	const response = await fetch(`${PROFILE_API_URL}/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(profile),
	});

	if (!response.ok) {
		throw new Error(`Failed to update profile (${response.status})`);
	}

	return response.json();
}

async function deleteProfile(id) {
	const response = await fetch(`${PROFILE_API_URL}/${id}`, {
		method: "DELETE",
	});

	if (!response.ok) {
		throw new Error(`Failed to delete profile (${response.status})`);
	}

	return response.json();
}

export { getProfiles, getProfile, createProfile, updateProfile, deleteProfile };
