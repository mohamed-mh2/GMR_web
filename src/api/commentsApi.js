const COMMENTS_API_URL = "https://6a37d27fc105017aa6395867.mockapi.io/comments";

function normalizeList(data) {
	return Array.isArray(data) ? data : data.value || [];
}

async function getComments() {
	const response = await fetch(COMMENTS_API_URL);

	if (!response.ok) {
		throw new Error(`Failed to fetch comments (${response.status})`);
	}

	const data = await response.json();
	return normalizeList(data);
}

async function getComment(id) {
	const response = await fetch(`${COMMENTS_API_URL}/${id}`);

	if (!response.ok) {
		throw new Error(`Failed to fetch comment (${response.status})`);
	}

	return response.json();
}

async function createComment(comment) {
	const response = await fetch(COMMENTS_API_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(comment),
	});

	if (!response.ok) {
		throw new Error(`Failed to create comment (${response.status})`);
	}

	return response.json();
}

async function updateComment(id, comment) {
	const response = await fetch(`${COMMENTS_API_URL}/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(comment),
	});

	if (!response.ok) {
		throw new Error(`Failed to update comment (${response.status})`);
	}

	return response.json();
}

async function deleteComment(id) {
	const response = await fetch(`${COMMENTS_API_URL}/${id}`, {
		method: "DELETE",
	});

	if (!response.ok) {
		throw new Error(`Failed to delete comment (${response.status})`);
	}

	return response.json();
}

export { getComments, getComment, createComment, updateComment, deleteComment };
