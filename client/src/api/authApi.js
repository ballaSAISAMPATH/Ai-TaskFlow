import axios from "axios";

export const checkAuth = async () => {
  try {
    const res = await axios.get("/api/auth/check-auth", {
      withCredentials: true,
    });
    return res.data.user;
  } catch (err) {
    console.error("Auth check failed", err);
    return null;
  }
};
