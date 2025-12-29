import axios from 'axios';

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});


axiosClient.interceptors.response.use(
  (response) => {
    const data = response.data;

    
    if (data === '' || data == null) {
      return { success: true };
    }

    return data;
  },
  (error) => Promise.reject(error),
);


export default axiosClient;
