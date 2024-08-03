import axios, { AxiosError } from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  method: "get",
  headers: {
    "content-type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (value) => value,
  (error: AxiosError) => {
    if (error.code === "ERR_NETWORK") {
      console.log(error);
      alert("Server unavailable!");
    }
  }
);

export default axiosInstance;
