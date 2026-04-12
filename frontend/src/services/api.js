const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Helper to make fetch requests with auth
async function apiCall(
  endpoint,
  method = "GET",
  body = null,
  isRefresh = false,
) {
  const headers = {
    "Content-Type": "application/json",
  };

  // Add auth token if not a refresh request
  if (!isRefresh) {
    const token = localStorage.getItem("access_token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const options = {
    method,
    headers,
    credentials: "include",
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);

    // If 401 and not already a refresh attempt, try to refresh token
    if (response.status === 401 && !isRefresh) {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const refreshRes = await apiCall(
            "/auth/refresh",
            "POST",
            { refresh_token: refreshToken },
            true,
          );
          localStorage.setItem("access_token", refreshRes.access_token);

          // Retry original request
          return apiCall(endpoint, method, body);
        } catch (err) {
          // Refresh failed, clear storage and redirect
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");
          window.location.href = "/login";
          throw err;
        }
      } else {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }

    if (!response.ok) {
      let errorMsg = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        console.log("[v0] Backend error response:", errorData);

        // Handle FastAPI validation errors (422)
        if (errorData.detail) {
          if (typeof errorData.detail === "string") {
            errorMsg = errorData.detail;
          } else if (Array.isArray(errorData.detail)) {
            // Pydantic validation errors
            errorMsg = errorData.detail
              .map((err) => `${err.loc[1]}: ${err.msg}`)
              .join(", ");
          }
        }
      } catch (parseErr) {
        console.log("[v0] Could not parse error response");
      }
      throw new Error(errorMsg);
    }

    return await response.json();
  } catch (error) {
    console.log("[v0] API error:", error.message);
    throw error;
  }
}

export const authAPI = {
  register: (email, password, fullName) =>
    apiCall("/auth/register", "POST", {
      email,
      password,
      full_name: fullName,
    }),
  login: (email, password) =>
    apiCall("/auth/login", "POST", {
      email,
      password,
    }),
  getMe: () => apiCall("/auth/me", "GET"),
  refresh: (refreshToken) =>
    apiCall("/auth/refresh", "POST", { refresh_token: refreshToken }),
};

export const financeAPI = {
  createTransaction: (type, category, amount, description) =>
    apiCall("/finance/transactions", "POST", {
      type,
      category,
      amount: parseFloat(amount),
      description,
    }),
  getTransactions: (skip = 0, limit = 10) =>
    apiCall(`/finance/transactions?skip=${skip}&limit=${limit}`, "GET"),
  getTransaction: (id) => apiCall(`/finance/transactions/${id}`, "GET"),
  updateTransaction: (id, data) =>
    apiCall(`/finance/transactions/${id}`, "PUT", data),
  deleteTransaction: (id) => apiCall(`/finance/transactions/${id}`, "DELETE"),
  getSummary: () => apiCall("/finance/summary", "GET"),
};

export const letterAPI = {
  createLetter: (title, letterType, content) =>
    apiCall("/letters", "POST", {
      title,
      letter_type: letterType,
      content,
    }),
  getLetters: (status = null, skip = 0, limit = 10) => {
    let url = `/letters?skip=${skip}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    return apiCall(url, "GET");
  },
  getLetter: (id) => apiCall(`/letters/${id}`, "GET"),
  updateLetter: (id, data) => apiCall(`/letters/${id}`, "PUT", data),
  deleteLetter: (id) => apiCall(`/letters/${id}`, "DELETE"),
  submitLetter: (id) => apiCall(`/letters/${id}/submit`, "POST"),
  approveLetter: (id) => apiCall(`/letters/${id}/approve`, "POST"),
  rejectLetter: (id) => apiCall(`/letters/${id}/reject`, "POST"),
};

export const userAPI = {
  getAllUsers: (skip = 0, limit = 10) =>
    apiCall(`/users?skip=${skip}&limit=${limit}`, "GET"),
  createUser: (email, password, fullName, role) =>
    apiCall("/users", "POST", {
      email,
      password,
      full_name: fullName,
      role,
    }),
  updateUser: (id, data) => apiCall(`/users/${id}`, "PUT", data),
  deleteUser: (id) => apiCall(`/users/${id}`, "DELETE"),
};
