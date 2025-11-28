import { API_BASE_URL } from "../constants"

export const refreshAccessToken = async () => {
	const response = await fetch(`${API_BASE_URL}/auth/refresh-tokens`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
	})

	if (!response.ok) {
		throw new Error("Error when trying to refresh access token.")
	}

	return
}
