import { API_BASE_URL } from "../constants"
import { refreshAccessToken } from "./auth"

interface FetchOptions extends RequestInit {
	headers?: Record<string, string>
}

export const apiFetch = async <T = any>(
	endpoint: string,
	options: FetchOptions = {},
): Promise<T> => {
	const url = `${API_BASE_URL}${endpoint}`

	console.log("url que llega al apiFetch: ", url)
	const defaultOptions: FetchOptions = {
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			...options.headers,
		},
		...options,
	}

	try {
		console.log("haciento el fetch en el apiFetch")
		let response = await fetch(url, defaultOptions)
		console.log("responseeee:", response)
		if (response.status === 401) {
			try {
				console.log("Invalid tokens. Trying refreshing...")
				await refreshAccessToken()
				response = await fetch(url, defaultOptions)
			} catch (refreshError) {
				console.error(
					"Error when trying to refresh tokens: ",
					refreshError,
				)
				throw refreshError
			}
		}

		if (!response.ok) {
			const errorData = await response.json().catch(() => null)
			throw new Error(
				errorData?.message || `HTTP Error: ${response.status}`,
			)
		}
		return await response.json()
	} catch (error) {
		console.error("Error in apiFetch: ", error)
		throw error
	}
}
