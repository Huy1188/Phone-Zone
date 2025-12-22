'use client';
import React, { useEffect, useState } from 'react';
import { deletePost, getAllPosts } from '@/services/admin/postService';
import styles from '@/app/components/Admin/Posts/PostManage.module.css';
import Link from 'next/link';
import Image from 'next/image';

export default function PostManagePage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '');

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res: any = await getAllPosts();
      if (res?.success) setPosts(res?.data?.posts ?? res?.data ?? []);
      else alert(res?.message || 'Không thể tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (postId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;
    const res: any = await deletePost(postId);
    if (res?.success) {
      alert(res?.message || 'Đã xóa');
      fetchPosts();
    } else {
      alert(res?.message || 'Xóa thất bại');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Quản lý bài viết</h2>
        <Link href="/admin/posts/create" className={styles.createBtn}>+ Tạo bài viết</Link>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className={styles.list}>
          {posts.map((p) => (
            <div key={p.post_id} className={styles.card}>
              <div className={styles.thumb}>
                {p.thumbnail ? (
                  <Image
                    src={`${BACKEND_URL}${p.thumbnail}`}
                    alt={p.title}
                    width={280}
                    height={150}
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div className={styles.noimg}>No image</div>
                )}
              </div>

              <div className={styles.info}>
                <div className={styles.title}>{p.title}</div>
                <div className={styles.meta}>Slug: {p.slug}</div>
              </div>

              <div className={styles.actions}>
                {/* Nếu bạn có màn edit post */}
                <Link className={styles.smallBtn} href={`/admin/posts/edit/${p.post_id}`}>Sửa</Link>
                <button className={styles.deleteBtn} onClick={() => handleDelete(p.post_id)}>Xóa</button>
              </div>
            </div>
          ))}
          {posts.length === 0 && <p>Chưa có bài viết.</p>}
        </div>
      )}
    </div>
  );
}
