const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

let savedToken: string | null = null

export function clearAuthToken() {
  savedToken = null
}

// 1. Get JWT token from Next.js (/api/auth/jwt)
export async function getAuthToken() {
  if (savedToken) return savedToken

  const res = await fetch("/api/auth/jwt")
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || "Please sign in first")
  }

  savedToken = data.token
  return data.token
}

// 2. Call Express API with JWT Bearer token
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = await getAuthToken()

  let res: Response
  try {
    res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    })
  } catch (err) {
    throw new Error(
      "Cannot connect to backend server. Please make sure pizzahub-server is running on port 5000."
    )
  }

  if (res.status === 401) clearAuthToken()

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || "Something went wrong")

  return data
}
