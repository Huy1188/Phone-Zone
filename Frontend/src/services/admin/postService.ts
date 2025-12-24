import axiosClient from '@/lib/axiosClient';

export const getAllPosts = () => axiosClient.get('/admin/posts');

// export const getCreatePostMeta = () => axiosClient.get("/admin/posts/create");
export const getPostMeta = () => axiosClient.get('/admin/posts/create');

export const createPost = (formData: FormData) =>
    axiosClient.post('/admin/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

export const getPostById = (postId: number | string) => axiosClient.get(`/admin/posts/${postId}`);

export const updatePost = (postId: number | string, formData: FormData) =>
    axiosClient.patch(`/admin/posts/${postId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

export const deletePost = (postId: number | string) => axiosClient.delete(`/admin/posts/${postId}`);
