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
        // Nếu backend trả về { errCode: 0, data: [...] } thì lấy luôn phần data
        return response.data;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export default axiosClient;
