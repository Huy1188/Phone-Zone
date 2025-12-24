'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import styles from '@/app/components/Admin/Posts/PostManage.module.scss';
import { deletePost, getAllPosts } from '@/services/admin/postService';

export default function PostManagePage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [q, setQ] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 10;

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

    const filtered = useMemo(() => {
        const keyword = q.trim().toLowerCase();
        if (!keyword) return posts;
        return posts.filter((p) => {
            const title = String(p?.title ?? '').toLowerCase();
            const author = (
                String(p?.author?.first_name ?? '') +
                ' ' +
                String(p?.author?.last_name ?? '')
            ).toLowerCase();
            return title.includes(keyword) || author.includes(keyword);
        });
    }, [posts, q]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const pageSafe = Math.min(page, totalPages);

    useEffect(() => {
        if (page !== pageSafe) setPage(pageSafe);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [totalPages]);

    const paged = useMemo(() => {
        const start = (pageSafe - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, pageSafe]);

    const formatDate = (d: any) => {
        if (!d) return '---';
        const dt = new Date(d);
        if (Number.isNaN(dt.getTime())) return '---';
        return dt.toLocaleDateString('vi-VN');
    };

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
            <div className={styles.cardBox}>
                <div className={styles.cardHeader}>
                    <h2>
                        <i className="fas fa-newspaper"></i> Quản lý bài viết
                    </h2>

                    <div className={styles.headerRight}>
                        <Link href="/admin/posts/create" className={styles.createBtn}>
                            <i className="fas fa-plus"></i> Tạo bài viết
                        </Link>
                    </div>
                </div>

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th style={{ width: 80 }}>ID</th>
                                <th style={{ width: 180 }}>Tiêu đề</th>
                                <th style={{ width: 200 }}>Tác giả</th>
                                <th style={{ width: 130 }}>Ngày tạo</th>
                                <th style={{ width: 240, textAlign: 'center' }}>Hành động</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className={styles.center}>
                                        Đang tải...
                                    </td>
                                </tr>
                            ) : paged.length > 0 ? (
                                paged.map((p) => (
                                    <tr key={p.post_id}>
                                        <td>#{p.post_id}</td>

                                        <td>
                                            <div className={styles.titleCell} title={p.title}>
                                                {p.title}
                                            </div>
                                        </td>

                                        <td>
                                            {p?.author ? (
                                                <div className={styles.authorCell}>
                                                    <div className={styles.authorName}>
                                                        {p.author.first_name} {p.author.last_name}
                                                    </div>
                                                </div>
                                            ) : (
                                                '---'
                                            )}
                                        </td>

                                        <td>{formatDate(p.createdAt)}</td>

                                        <td className={styles.center}>
                                            <div className={styles.actionGroup}>
                                                <Link
                                                    className={`${styles.actionBtn} ${styles.view}`}
                                                    href={`/admin/posts/view/${p.post_id}`}
                                                >
                                                    <i className="fas fa-eye"></i> Xem
                                                </Link>

                                                <Link
                                                    className={`${styles.actionBtn} ${styles.edit}`}
                                                    href={`/admin/posts/edit/${p.post_id}`}
                                                >
                                                    <i className="fas fa-edit"></i> Sửa
                                                </Link>

                                                <button
                                                    type="button"
                                                    className={`${styles.actionBtn} ${styles.delete}`}
                                                    onClick={() => handleDelete(p.post_id)}
                                                >
                                                    <i className="fas fa-trash"></i> Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className={styles.center}>
                                        Chưa có bài viết.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
