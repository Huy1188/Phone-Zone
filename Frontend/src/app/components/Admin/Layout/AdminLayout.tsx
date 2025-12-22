// 'use client';

// import Link from 'next/link';
// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { handleCheckSession, handleLogoutApi } from '@/services/admin/authService';

// const AdminLayout = ({ children }: { children: React.ReactNode }) => {
//     const router = useRouter();
//     const [sidebarMini, setSidebarMini] = useState(false);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const isMini = localStorage.getItem('sidebarMini') === 'true';
//         setSidebarMini(isMini);
//     }, []);

//     useEffect(() => {
//         const checkAuth = async () => {
//             try {
//                 const res: any = await handleCheckSession();
//                 if (res.errCode === 0) {
//                     setIsAuthenticated(true);
//                 } else {
//                     router.push('/admin/login');
//                 }
//             } catch (error) {
//                 router.push('/admin/login');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         checkAuth();
//     }, [router]);

//     const handleLogout = async () => {
//         try {
//             await handleLogoutApi();
//             router.push('/admin/login');
//         } catch (error) {
//             console.error('Logout error:', error);
//             router.push('/admin/login');
//         }
//     };

//     if (loading) {
//         return <div className="min-h-screen flex items-center justify-center">Đang kiểm tra đăng nhập...</div>;
//     }

//     if (!isAuthenticated) {
//         return null;
//     }

//     return (
//         <>
//             <style jsx>{`
//                 .main-sidebar {
//                     width: 250px;
//                     background-color: #343a40;
//                     min-height: 100vh;
//                     display: flex;
//                     flex-direction: column;
//                     flex-shrink: 0;
//                     color: #c2c7d0;
//                     transition: all 0.3s ease;
//                 }

//                 .brand-link {
//                     display: flex;
//                     align-items: center;
//                     justify-content: space-between;
//                     padding: 0 15px;
//                     height: 57px;
//                     background-color: #dc3545;
//                     color: white;
//                     text-decoration: none;
//                     font-weight: bold;
//                     font-size: 18px;
//                     border-bottom: 1px solid #4b545c;
//                     overflow: hidden;
//                 }

//                 .btn-toggle-sidebar {
//                     background: none;
//                     border: none;
//                     color: white;
//                     font-size: 18px;
//                     cursor: pointer;
//                     outline: none;
//                 }

//                 .user-panel {
//                     display: flex;
//                     align-items: center;
//                     padding: 15px;
//                     border-bottom: 1px solid #4f5962;
//                     margin-bottom: 10px;
//                     white-space: nowrap;
//                     overflow: hidden;
//                 }
//                 .user-panel img {
//                     width: 35px;
//                     height: 35px;
//                     border-radius: 50%;
//                     object-fit: cover;
//                     margin-right: 10px;
//                     border: 2px solid #fff;
//                 }
//                 .user-info a {
//                     color: #c2c7d0;
//                     display: block;
//                     text-decoration: none;
//                     font-weight: bold;
//                     font-size: 14px;
//                 }

//                 .nav-sidebar {
//                     list-style: none;
//                     padding: 0 10px;
//                     margin: 0;
//                     padding-bottom: 20px;
//                 }
//                 .nav-item {
//                     margin-bottom: 2px;
//                 }

//                 .nav-header {
//                     padding: 5px 10px 5px 10px;
//                     font-size: 11px;
//                     text-transform: uppercase;
//                     color: #6c757d;
//                     font-weight: bold;
//                     white-space: nowrap;
//                 }

//                 .nav-link {
//                     display: flex;
//                     align-items: center;
//                     padding: 0px 10px;
//                     color: #c2c7d0;
//                     text-decoration: none;
//                     border-radius: 4px;
//                     transition: 0.2s;
//                     white-space: nowrap;
//                     overflow: hidden;
//                 }
//                 .nav-link i {
//                     width: 25px;
//                     text-align: center;
//                     margin-right: 10px;
//                     font-size: 14px;
//                     flex-shrink: 0;
//                 }
//                 .nav-link:hover {
//                     background-color: #494e53;
//                     color: #fff;
//                 }

//                 .main-sidebar.mini {
//                     width: 70px;
//                 }

//                 .main-sidebar.mini .brand-text,
//                 .main-sidebar.mini .user-info,
//                 .main-sidebar.mini .nav-link p,
//                 .main-sidebar.mini .nav-header {
//                     display: none;
//                     opacity: 0;
//                 }

//                 .main-sidebar.mini .brand-link {
//                     justify-content: center;
//                     padding: 0;
//                 }
//                 .main-sidebar.mini .btn-toggle-sidebar {
//                     display: block;
//                     margin: 0;
//                 }

//                 .main-sidebar.mini .user-panel {
//                     justify-content: center;
//                     padding: 15px 0;
//                 }
//                 .main-sidebar.mini .user-panel img {
//                     margin: 0;
//                 }

//                 .main-sidebar.mini .nav-link {
//                     justify-content: center;
//                     padding: 10px 0;
//                 }
//                 .main-sidebar.mini .nav-link i {
//                     margin: 0;
//                     font-size: 18px;
//                 }

//                 .main-sidebar.mini .nav-link:hover {
//                     background-color: #007bff;
//                 }
//             `}</style>
//             <div className="flex min-h-screen bg-gray-100">
//                 {/* Sidebar */}
//                 <aside className={`main-sidebar ${sidebarMini ? 'mini' : ''}`} id="sidebar">
//                     <div className="brand-link">
//                         <div className="flex items-center">
//                             <i className="fas fa-store mr-2" id="logoIcon"></i>
//                             <span className="brand-text">Phone Zone</span>
//                         </div>
//                         <button className="btn-toggle-sidebar" onClick={toggleSidebar}>
//                             <i className="fas fa-bars"></i>
//                         </button>
//                     </div>

//                     <div className="sidebar">
//                         <div className="user-panel">
//                             <img src="https://cdn-icons-png.flaticon.com/512/2206/2206368.png" alt="Admin" />
//                             <div className="user-info">
//                                 <a href="#">Super Admin</a>
//                             </div>
//                         </div>

//                         <ul className="nav-sidebar">
//                             <li className="nav-item">
//                                 <Link href="/admin/dashboard" className="nav-link">
//                                     <i className="fas fa-tachometer-alt" style={{ color: '#007bff' }}></i>
//                                     <p>Dashboard</p>
//                                 </Link>
//                             </li>

//                             <li className="nav-header">HỆ THỐNG</li>

//                             <li className="nav-item">
//                                 <Link href="/admin/users" className="nav-link">
//                                     <i className="fas fa-users" style={{ color: '#28a745' }}></i>
//                                     <p>Người dùng</p>
//                                 </Link>
//                             </li>

//                             <li className="nav-header">KHO & SẢN PHẨM</li>

//                             <li className="nav-item">
//                                 <Link href="/admin/categories" className="nav-link">
//                                     <i className="fas fa-list" style={{ color: '#17a2b8' }}></i>
//                                     <p>Danh mục</p>
//                                 </Link>
//                             </li>

//                             <li className="nav-item">
//                                 <Link href="/admin/brands" className="nav-link">
//                                     <i className="fas fa-tags" style={{ color: '#6610f2' }}></i>
//                                     <p>Thương hiệu</p>
//                                 </Link>
//                             </li>

//                             {/* <li className="nav-item">
//                                 <Link href="/admin/products" className="nav-link">
//                                     <i className="fas fa-mobile-alt" style={{ color: '#ffc107' }}></i>
//                                     <p>Tất cả sản phẩm</p>
//                                 </Link>
//                             </li> */}

//                             <li className="nav-header">KINH DOANH</li>

//                             {/* <li className="nav-item">
//                                 <Link href="/admin/orders" className="nav-link">
//                                     <i className="fas fa-shopping-cart" style={{ color: '#dc3545' }}></i>
//                                     <p>Đơn hàng</p>
//                                 </Link>
//                             </li>

//                             <li className="nav-item">
//                                 <Link href="/admin/vouchers" className="nav-link">
//                                     <i className="fas fa-ticket-alt" style={{ color: '#e83e8c' }}></i>
//                                     <p>Mã giảm giá (Voucher)</p>
//                                 </Link>
//                             </li>

//                             <li className="nav-item">
//                                 <Link href="/admin/reviews" className="nav-link">
//                                     <i className="fas fa-star-half-alt" style={{ color: '#fd7e14' }}></i>
//                                     <p>Đánh giá & Review</p>
//                                 </Link>
//                             </li> */}

//                             <li className="nav-header">MARKETING</li>

//                             {/* <li className="nav-item">
//                                 <Link href="/admin/banners" className="nav-link">
//                                     <i className="fas fa-images" style={{ color: '#20c997' }}></i>
//                                     <p>Banner & Slider</p>
//                                 </Link>
//                             </li>

//                             <li className="nav-item">
//                                 <Link href="/admin/posts" className="nav-link">
//                                     <i className="fas fa-newspaper" style={{ color: '#007bff' }}></i>
//                                     <p>Tin tức / Blog</p>
//                                 </Link>
//                             </li> */}
//                         </ul>
//                     </div>
//                 </aside>

//                 {/* Main Content */}
//                 <div className="flex-1 overflow-auto">
//                     <header className="h-16 bg-white shadow flex items-center px-6 justify-between">
//                         <h2 className="font-semibold text-gray-700">Xin chào, Admin</h2>
//                         <button onClick={handleLogout} className="text-red-500 hover:text-red-700">
//                             Đăng xuất
//                         </button>
//                     </header>
//                     <main className="p-6">{children}</main>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default AdminLayout;
