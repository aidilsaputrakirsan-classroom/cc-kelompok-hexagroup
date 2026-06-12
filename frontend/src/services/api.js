const API_URL = import.meta.env.VITE_API_URL;

async function apiCall(
  endpoint,
  method = "GET",
  body = null,
  isRefresh = false
) {
  const headers = {
    "Content-Type": "application/json",
  };

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

  let response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, options);
  } catch (err) {
    throw new Error("Service temporarily unavailable");
  }

  if (response.status === 401 && !isRefresh) {
    const refreshToken = localStorage.getItem("refresh_token");

    if (refreshToken) {
      try {
        const refreshRes = await apiCall(
          "/auth/refresh",
          "POST",
          { refresh_token: refreshToken },
          true
        );

        localStorage.setItem("access_token", refreshRes.access_token);
        
        return apiCall(endpoint, method, body);
      } catch (err) {
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
      return;
    }
  }

  if (!response.ok) {
    let errorMsg = `HTTP ${response.status}`;
    
    try {
     
      const errorData = await response.json();
      
      if (errorData?.detail) {
        if (typeof errorData.detail === "string") {
          errorMsg = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
          errorMsg = errorData.detail
            .map((err) => `${err.loc?.[1] || "field"}: ${err.msg}`)
            .join(", ");
        }
      }
    } catch (e) {
     
    }

    throw new Error(errorMsg);
  }

  return await response.json();
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
  
  createTransaction: (typeOrTitle, categoryOrType, amountOrCategory, descriptionOrAmount, dateOrNull) => {
    if (dateOrNull !== undefined || typeof descriptionOrAmount === "number") {
      return apiCall("/finance/transactions", "POST", {
        title: typeOrTitle,
        type: categoryOrType,
        category: amountOrCategory,
        amount: parseFloat(descriptionOrAmount),
        date: dateOrNull,
      });
    }
    return apiCall("/finance/transactions", "POST", {
      type: typeOrTitle,
      category: categoryOrType,
      amount: parseFloat(amountOrCategory),
      description: descriptionOrAmount,
    });
  },

  getTransactions: (skip = 0, limit = 100) =>
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

  getLetters: (status = null, skip = 0, limit = 100) => {
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
  getAllUsers: (skip = 0, limit = 100) =>
    apiCall(`/auth/users?skip=${skip}&limit=${limit}`, "GET"),

  createUser: (email, password, fullName, role) =>
    apiCall("/auth/users", "POST", {
      email,
      password,
      full_name: fullName,
      role,
    }),

  updateUser: (id, data) => apiCall(`/auth/users/${id}`, "PUT", data),

  deleteUser: (id) => apiCall(`/auth/users/${id}`, "DELETE"),
};

export const checkAPIConnection = async () => {
  try {
    const res = await fetch(`${API_URL}/health`, {
      method: "GET",
    });
    return res.ok;
  } catch {
    return false;
  }
};