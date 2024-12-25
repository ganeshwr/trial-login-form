import axios from "axios";

const API_URL = "https://fakestoreapi.com";

// Get all user data
export const getUsersData = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch users data");
  }
};

// Login function
export const doLogin = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Invalid email or password");
  }
};

// Get user data by id
export const getUserDataById = async (userId: number) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch user data by id");
  }
};
