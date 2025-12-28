import axios from 'axios';

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Cấu hình phản hồi (Optional: giúp lấy data gọn hơn)
axiosClient.interceptors.response.use(
  (response) => {
    const data = response.data;

    // PATCH/DELETE đôi khi backend trả 204 hoặc body rỗng
    if (data === '' || data == null) {
      return { success: true };
    }

    return data;
  },
  (error) => Promise.reject(error),
);


export default axiosClient;
