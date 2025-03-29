import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_ENDPOINT = "https://devapi-618v.onrender.com/api";

const api = axios.create({ baseURL: API_ENDPOINT });

// Interceptor to attach token to every request
api.interceptors.request.use(
  async (config) => {
    // Try to get token from AsyncStorage
    let token = await AsyncStorage.getItem("token");
    // If not found and on web, try localStorage
    if (!token && typeof window !== "undefined") {
      token = localStorage.getItem("token");
    }

    // For testing: hardcode a token if needed
    /*
    if (!token) {
      token = "YOUR_VALID_TOKEN_HERE";
      console.log("Using hardcoded token:", token);
    }
    */

    if (token && config.headers) {
      // Clean token: remove extra quotes and whitespace
      token = token.trim().replace(/^"|"$/g, "");
      console.log("Using token:", token);
      
      // Option 1: Try without the "Bearer " prefix:
      config.headers.Authorization = token;
      
      // Option 2: If needed, try the Bearer format (comment out Option 1 and uncomment below)
      // config.headers.Authorization = `Bearer ${token}`;
      
      // Optionally, remove or set the Accept header if needed:
      // config.headers.Accept = "application/json";
    } else {
      console.log("No token found in storage.");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Get all users
export const getUsers = async (): Promise<any> => {
  try {
    const { data } = await api.get("/user");
    return data;
  } catch (error) {
    console.error("getUsers error:", error.response?.data || error);
    throw error;
  }
};

// Get a single user by ID
export const getUserById = async (userId: number): Promise<any> => {
  try {
    console.log("Fetching user with ID:", userId);
    const { data } = await api.get(`/user/${userId}`);
    return data;
  } catch (error) {
    console.error("getUserById error:", error.response?.data || error);
    throw error;
  }
};

// Update a user
export const updateUser = async (
  id: string | number,
  payload: { name?: string; username: string; password?: string }
): Promise<any> => {
  try {
    const { data } = await api.put(`/user/${id}`, payload);
    return data;
  } catch (error) {
    console.error("updateUser error:", error.response?.data || error);
    throw error;
  }
};

// Delete a user
export const deleteUser = async (id: string | number): Promise<any> => {
  try {
    const { data } = await api.delete(`/user/${id}`);
    return data;
  } catch (error) {
    console.error("deleteUser error:", error.response?.data || error);
    throw error;
  }
};

export default api;