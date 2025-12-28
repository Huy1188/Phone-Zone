'use client';

import { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './account.module.scss';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { getMyOrders } from '@/services/order';
import { updateMe, changeMyPassword } from '@/services/user';
import {
    getMyAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    type Address,
} from '@/services/address';

const cx = classNames.bind(styles);

type TabKey = 'profile' | 'orders' | 'address' | 'password';

export default function AccountPage() {
    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();

    const { addItemByVariant } = useCart();
    const [orders, setOrders] = useState<any[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [ordersError, setOrdersError] = useState<string | null>(null);

    const [openOrder, setOpenOrder] = useState<any | null>(null);

    const openDetail = (order: any) => setOpenOrder(order);
    const closeDetail = () => setOpenOrder(null);

    const { user, hydrated, refreshMe, logoutUser } = useAuth();
    const [profile, setProfile] = useState({
        username: '',
        first_name: '',
        last_name: '',
        phone: '',
        gender: '' as '' | 'male' | 'female',
        avatar: '',
    });

    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;

        setProfile({
            username: user.username ?? '',
            first_name: user.first_name ?? '',
            last_name: user.last_name ?? '',
            phone: user.phone ?? '',
            gender: user.gender === true ? 'male' : user.gender === false ? 'female' : '',
            avatar: user.avatar ?? '',
        });
    }, [user]);

    const onSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaveMsg(null);
        setSaving(true);

        try {
            const res = await updateMe(profile);
            if (!res?.success) throw new Error(res?.message || 'Cập nhật thất bại');
            await refreshMe();
            setSaveMsg('Cập nhật thành công!');
        } catch (err: any) {
            setSaveMsg(err?.message || 'Có lỗi khi cập nhật');
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        if (!hydrated) return; // ✅ đợi hydrate
        if (!user) router.push('/login');
    }, [hydrated, user, router]);

    const displayName = useMemo(() => {
        // nếu BE sau này có username/fullname thì thay ở đây
        const anyUser = user as any;
        return anyUser?.username || anyUser?.fullname || user?.email?.split('@')[0] || 'User';
    }, [user]);

    // Tab đơn giản (sau này bạn có thể tách route con)
    const [tab, setTab] = useState<TabKey>('profile');
    useEffect(() => {
        const t = (sp.get('tab') || 'profile') as TabKey;
        const allowed: TabKey[] = ['profile', 'orders', 'address', 'password'];
        if (allowed.includes(t)) setTab(t);
    }, [sp]);

    useEffect(() => {
        const run = async () => {
            if (tab !== 'orders') return;
            if (!user) return;

            try {
                setLoadingOrders(true);
                setOrdersError(null);
                const res = await getMyOrders();
                setOrders(res.orders || []);
            } catch (e: any) {
                setOrdersError(e?.message || 'Không tải được đơn hàng');
            } finally {
                setLoadingOrders(false);
            }
        };

        run();
    }, [tab, user]);

    useEffect(() => {
        // nếu bạn muốn điều khiển tab theo query ?tab=
        // hiện tại default profile
    }, [pathname]);

    const withBackend = (p?: string) => {
        if (!p) return '';
        if (p.startsWith('http')) return p;
        return `${process.env.NEXT_PUBLIC_STATIC_BASE}${p}`;
    };

    const getBadgeClass = (status?: string) => {
        const s = String(status || '').toLowerCase();
        if (s === 'pending') return cx('badge', 'badgePending');
        if (s === 'shipping') return cx('badge', 'badgeShipping');
        if (s === 'done' || s === 'completed' || s === 'delivered') return cx('badge', 'badgeDone');
        if (s === 'cancel' || s === 'canceled') return cx('badge', 'badgeCancel');
        return cx('badge');
    };

    const getStatusText = (status?: string) => {
        const s = String(status || '').toLowerCase();
        if (s === 'pending') return 'Chờ xác nhận';
        if (s === 'shipping') return 'Đang giao';
        if (s === 'done' || s === 'completed' || s === 'delivered') return 'Hoàn thành';
        if (s === 'cancel' || s === 'canceled') return 'Đã huỷ';
        return status || 'Đang xử lý';
    };

    const handleRebuy = async (order: any) => {
        if (!order?.details?.length) return;

        try {
            // add từng item vào cart
            for (const d of order.details) {
                const variantId = Number(d.variant_id);
                const quantity = Number(d.quantity || 1);

                if (variantId && quantity > 0) {
                    await addItemByVariant(variantId, quantity);
                }
            }
            // chuyển sang trang cart
            window.location.href = '/cart';
        } catch (e) {
            console.error('Rebuy error:', e);
            alert('Không thể mua lại đơn hàng, vui lòng thử lại.');
        }
    };

    // address
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loadingAddr, setLoadingAddr] = useState(false);
    const [addrError, setAddrError] = useState<string | null>(null);

    const [openAddrModal, setOpenAddrModal] = useState(false);
    const [editingAddr, setEditingAddr] = useState<Address | null>(null);

    const [addrForm, setAddrForm] = useState({
        recipient_name: '',
        recipient_phone: '',
        street: '',
        city: '',
        is_default: false,
    });

    useEffect(() => {
        if (tab !== 'address') return;
        if (!user) return;

        (async () => {
            try {
                setLoadingAddr(true);
                setAddrError(null);
                const res = await getMyAddresses();
                setAddresses(res.addresses || []);
            } catch (e: any) {
                setAddrError(e?.message || 'Không tải được địa chỉ');
            } finally {
                setLoadingAddr(false);
            }
        })();
    }, [tab, user]);

    const openAddAddress = () => {
        setEditingAddr(null);
        setAddrForm({ recipient_name: '', recipient_phone: '', street: '', city: '', is_default: false });
        setOpenAddrModal(true);
    };

    const openEditAddress = (a: Address) => {
        setEditingAddr(a);
        setAddrForm({
            recipient_name: a.recipient_name,
            recipient_phone: a.recipient_phone,
            street: a.street,
            city: a.city,
            is_default: a.is_default,
        });
        setOpenAddrModal(true);
    };

    const submitAddress = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = editingAddr
                ? await updateAddress(editingAddr.address_id, addrForm)
                : await createAddress(addrForm);

            setAddresses(res.addresses || []);
            setOpenAddrModal(false);
        } catch (e: any) {
            alert(e?.message || 'Lưu địa chỉ thất bại');
        }
    };

    const handleDeleteAddr = async (id: number) => {
        if (!confirm('Xóa địa chỉ này?')) return;
        const res = await deleteAddress(id);
        setAddresses(res.addresses || []);
    };

    const handleSetDefault = async (id: number) => {
        const res = await setDefaultAddress(id);
        setAddresses(res.addresses || []);
    };

    const [pw, setPw] = useState({ oldPassword: '', newPassword: '', confirm: '' });
    const [pwSaving, setPwSaving] = useState(false);
    const [pwMsg, setPwMsg] = useState<string | null>(null);

    const onChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPwMsg(null);

        if (!pw.oldPassword || !pw.newPassword) {
            setPwMsg('Vui lòng nhập mật khẩu hiện tại và mật khẩu mới');
            return;
        }
        if (pw.newPassword.length < 6) {
            setPwMsg('Mật khẩu mới phải có ít nhất 6 ký tự');
            return;
        }
        if (pw.newPassword !== pw.confirm) {
            setPwMsg('Nhập lại mật khẩu mới không khớp');
            return;
        }

        setPwSaving(true);
        try {
            const res = await changeMyPassword({ oldPassword: pw.oldPassword, newPassword: pw.newPassword });
            setPwMsg(res?.message || 'Đổi mật khẩu thành công');
            setPw({ oldPassword: '', newPassword: '', confirm: '' });
        } catch (err: any) {
            setPwMsg(err?.message || 'Đổi mật khẩu thất bại');
        } finally {
            setPwSaving(false);
        }
    };

    if (!hydrated) return null; // hoặc render loading
    if (!user) return null;

    return (
        <div className={cx('wrap')}>
            <div className={cx('container')}>
                {/* SIDEBAR */}
                <aside className={cx('sidebar')}>
                    <div className={cx('userBox')}>
                        <div className={cx('avatar')}>
                            <i className="fa-solid fa-circle-user" />
                        </div>

                        <div className={cx('userInfo')}>
                            <div className={cx('hello')}>Xin chào,</div>
                            <div className={cx('name')}>{user.last_name || ''}</div>
                            <div className={cx('email')}>{user.email}</div>
                        </div>
                    </div>

                    <div className={cx('menu')}>
                        <button className={cx('item', { active: tab === 'profile' })} onClick={() => setTab('profile')}>
                            Thông tin tài khoản
                        </button>

                        <button
                            className={cx('item', { active: tab === 'orders' })}
                            onClick={() => router.push('/account?tab=orders')}
                        >
                            Đơn hàng của tôi
                        </button>

                        <button className={cx('item', { active: tab === 'address' })} onClick={() => setTab('address')}>
                            Sổ địa chỉ
                        </button>

                        <button
                            className={cx('item', { active: tab === 'password' })}
                            onClick={() => setTab('password')}
                        >
                            Đổi mật khẩu
                        </button>

                        <button
                            className={cx('logout')}
                            onClick={async () => {
                                await logoutUser();
                                router.push('/');
                                router.refresh();
                            }}
                        >
                            Đăng xuất
                        </button>
                    </div>
                </aside>

                {/* CONTENT */}
                <main className={cx('content')}>
                    {tab === 'profile' && (
                        <section>
                            <h2 className={cx('title')}>Thông tin tài khoản</h2>

                            <form className={cx('card')} onSubmit={onSaveProfile}>
                                <div className={cx('row')}>
                                    <div className={cx('label')}>Email</div>
                                    <div className={cx('value')}>{user.email}</div>
                                </div>

                                <div className={cx('row')}>
                                    <div className={cx('label')}>Họ</div>
                                    <input
                                        className={cx('input')}
                                        value={profile.first_name}
                                        onChange={(e) => setProfile((p) => ({ ...p, first_name: e.target.value }))}
                                        placeholder="Nhập họ"
                                    />
                                </div>

                                <div className={cx('row')}>
                                    <div className={cx('label')}>Tên</div>
                                    <input
                                        className={cx('input')}
                                        value={profile.last_name}
                                        onChange={(e) => setProfile((p) => ({ ...p, last_name: e.target.value }))}
                                        placeholder="Nhập tên"
                                    />
                                </div>

                                <div className={cx('row')}>
                                    <div className={cx('label')}>SĐT</div>
                                    <input
                                        className={cx('input')}
                                        value={profile.phone}
                                        onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                                        placeholder="Nhập số điện thoại"
                                    />
                                </div>

                                <div className={cx('row')}>
                                    <div className={cx('label')}>Giới tính</div>
                                    <select
                                        className={cx('input')}
                                        value={profile.gender}
                                        onChange={(e) => setProfile((p) => ({ ...p, gender: e.target.value as any }))}
                                    >
                                        <option value="">-- Chọn --</option>
                                        <option value="male">Nam</option>
                                        <option value="female">Nữ</option>
                                    </select>
                                </div>

                                <div className={cx('row')}>
                                    <div className={cx('label')}>Avatar (URL)</div>
                                    <input
                                        className={cx('input')}
                                        value={profile.avatar}
                                        onChange={(e) => setProfile((p) => ({ ...p, avatar: e.target.value }))}
                                        placeholder="Nhập link ảnh avatar"
                                    />
                                </div>

                                {saveMsg && <div className={cx('hint')}>{saveMsg}</div>}

                                <button className={cx('btnPrimary')} type="submit" disabled={saving}>
                                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </button>
                            </form>
                        </section>
                    )}

                    {tab === 'orders' && (
                        <section>
                            <h2 className={cx('title')}>Đơn hàng của tôi</h2>

                            {loadingOrders && <div className={cx('card')}>Đang tải đơn hàng...</div>}

                            {!loadingOrders && ordersError && <div className={cx('card')}>{ordersError}</div>}

                            {!loadingOrders && !ordersError && orders.length === 0 && (
                                <div className={cx('card')}>
                                    <span className={cx('notText')}>Bạn chưa có đơn hàng nào.</span>
                                </div>
                            )}

                            {!loadingOrders && !ordersError && orders.length > 0 && (
                                <div className={cx('ordersWrap')}>
                                    {orders.map((o: any) => (
                                        <div key={o.order_id} className={cx('orderBox')}>
                                            <div className={cx('orderHead')}>
                                                <div className={cx('orderCode')}>Đơn hàng #{o.order_id}</div>
                                                <div className={cx('orderMeta')}>
                                                    <span>{new Date(o.createdAt).toLocaleString('vi-VN')}</span>
                                                    <span className={getBadgeClass(o.status)}>
                                                        {getStatusText(o.status)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className={cx('orderBody')}>
                                                <div className={cx('items')}>
                                                    {(o.details || []).map((d: any) => {
                                                        const img = withBackend(d?.variant?.image);
                                                        const slug = d?.variant?.product?.slug;

                                                        return (
                                                            <div key={d.detail_id} className={cx('itemRow')}>
                                                                <img
                                                                    className={cx('thumb')}
                                                                    src={img || '/no-image.png'}
                                                                    alt={d.product_name}
                                                                />

                                                                <div className={cx('itemInfo')}>
                                                                    <div className={cx('itemName')}>
                                                                        {d.product_name}
                                                                    </div>
                                                                    <div className={cx('itemSub')}>
                                                                        SL: {d.quantity}
                                                                    </div>
                                                                    {slug && (
                                                                        <a
                                                                            className={cx('link')}
                                                                            href={`/product/${slug}`}
                                                                        >
                                                                            Xem sản phẩm
                                                                        </a>
                                                                    )}
                                                                </div>

                                                                <div className={cx('itemPrice')}>
                                                                    {Number(d.price || 0).toLocaleString('vi-VN')}đ
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <div className={cx('orderFoot')}>
                                                <div className={cx('total')}>
                                                    <div className={cx('totalLabel')}>Tổng thanh toán</div>
                                                    <div className={cx('totalValue')}>
                                                        {Number(o.total_money || 0).toLocaleString('vi-VN')}đ
                                                    </div>
                                                </div>

                                                <div className={cx('actions')}>
                                                    <button className={cx('btnOutline')} onClick={() => handleRebuy(o)}>
                                                        Mua lại
                                                    </button>
                                                    <button className={cx('btnPrimary')} onClick={() => openDetail(o)}>
                                                        Xem chi tiết
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    {tab === 'address' && (
                        <section className={cx('addressWrap')}>
                            <div className={cx('titleRow')}>
                                <h2 className={cx('title')}>Sổ địa chỉ</h2>
                                <button className={cx('btnPrimary')} onClick={openAddAddress}>
                                    + Thêm địa chỉ
                                </button>
                            </div>

                            {loadingAddr && <div className={cx('card')}>Đang tải địa chỉ...</div>}
                            {!loadingAddr && addrError && <div className={cx('card')}>{addrError}</div>}

                            {!loadingAddr && !addrError && addresses.length === 0 && (
                                <div className={cx('card')}>
                                    <span className={cx('notText')}>Bạn chưa có địa chỉ nào.</span>
                                </div>
                            )}

                            {!loadingAddr && !addrError && addresses.length > 0 && (
                                <div className={cx('addrList')}>
                                    {addresses.map((a) => (
                                        <div key={a.address_id} className={cx('addrCard')}>
                                            <div className={cx('addrHead')}>
                                                <div className={cx('addrName')}>
                                                    {a.recipient_name} — {a.recipient_phone}
                                                </div>
                                                {a.is_default && (
                                                    <span className={cx('badge', 'badgeDone')}>Mặc định</span>
                                                )}
                                            </div>

                                            <div className={cx('addrText')}>
                                                {a.street}, {a.city}
                                            </div>

                                            <div className={cx('addrActions')}>
                                                {!a.is_default && (
                                                    <button
                                                        className={cx('btnOutline')}
                                                        onClick={() => handleSetDefault(a.address_id)}
                                                    >
                                                        Đặt mặc định
                                                    </button>
                                                )}
                                                <button className={cx('btnOutline')} onClick={() => openEditAddress(a)}>
                                                    Sửa
                                                </button>
                                                <button
                                                    className={cx('btnDanger')}
                                                    onClick={() => handleDeleteAddr(a.address_id)}
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {openAddrModal && (
                                <div className={cx('modalOverlay')} onClick={() => setOpenAddrModal(false)}>
                                    <div className={cx('modal')} onClick={(e) => e.stopPropagation()}>
                                        <div className={cx('modalHead')}>
                                            <div className={cx('modalTitle')}>
                                                {editingAddr ? 'Sửa địa chỉ' : 'Thêm địa chỉ'}
                                            </div>
                                            <button
                                                className={cx('modalClose')}
                                                onClick={() => setOpenAddrModal(false)}
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        <form className={cx('modalBody')} onSubmit={submitAddress}>
                                            <input
                                                className={cx('input')}
                                                placeholder="Họ tên người nhận"
                                                value={addrForm.recipient_name}
                                                onChange={(e) =>
                                                    setAddrForm((p) => ({ ...p, recipient_name: e.target.value }))
                                                }
                                            />
                                            <input
                                                className={cx('input')}
                                                placeholder="Số điện thoại"
                                                value={addrForm.recipient_phone}
                                                onChange={(e) =>
                                                    setAddrForm((p) => ({ ...p, recipient_phone: e.target.value }))
                                                }
                                            />
                                            <input
                                                className={cx('input')}
                                                placeholder="Địa chỉ (số nhà, đường, phường/xã, quận/huyện)"
                                                value={addrForm.street}
                                                onChange={(e) => setAddrForm((p) => ({ ...p, street: e.target.value }))}
                                            />
                                            <input
                                                className={cx('input')}
                                                placeholder="Tỉnh/Thành phố"
                                                value={addrForm.city}
                                                onChange={(e) => setAddrForm((p) => ({ ...p, city: e.target.value }))}
                                            />

                                            <label className={cx('checkboxRow')}>
                                                <input
                                                    type="checkbox"
                                                    checked={addrForm.is_default}
                                                    onChange={(e) =>
                                                        setAddrForm((p) => ({ ...p, is_default: e.target.checked }))
                                                    }
                                                />
                                                Đặt làm địa chỉ mặc định
                                            </label>

                                            <button className={cx('btnPrimary')} type="submit">
                                                Lưu
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    {tab === 'password' && (
                        <section>
                            <h2 className={cx('title')}>Đổi mật khẩu</h2>

                            <form className={cx('card')} onSubmit={onChangePassword}>
                                <div className={cx('row')}>
                                    <div className={cx('label')}>Mật khẩu hiện tại</div>
                                    <input
                                        className={cx('input')}
                                        type="password"
                                        value={pw.oldPassword}
                                        onChange={(e) => setPw((p) => ({ ...p, oldPassword: e.target.value }))}
                                        placeholder="Nhập mật khẩu hiện tại"
                                        autoComplete="current-password"
                                    />
                                </div>

                                <div className={cx('row')}>
                                    <div className={cx('label')}>Mật khẩu mới</div>
                                    <input
                                        className={cx('input')}
                                        type="password"
                                        value={pw.newPassword}
                                        onChange={(e) => setPw((p) => ({ ...p, newPassword: e.target.value }))}
                                        placeholder="Nhập mật khẩu mới"
                                        autoComplete="new-password"
                                    />
                                </div>

                                <div className={cx('row')}>
                                    <div className={cx('label')}>Nhập lại mật khẩu mới</div>
                                    <input
                                        className={cx('input')}
                                        type="password"
                                        value={pw.confirm}
                                        onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))}
                                        placeholder="Nhập lại mật khẩu mới"
                                        autoComplete="new-password"
                                    />
                                </div>

                                {pwMsg && <div className={cx('hint')}>{pwMsg}</div>}

                                <button className={cx('btnPrimary')} type="submit" disabled={pwSaving}>
                                    {pwSaving ? 'Đang đổi...' : 'Đổi mật khẩu'}
                                </button>
                            </form>
                        </section>
                    )}
                </main>
            </div>
            {openOrder && (
                <div className={cx('modalOverlay')} onClick={closeDetail}>
                    <div className={cx('modal')} onClick={(e) => e.stopPropagation()}>
                        <div className={cx('modalHead')}>
                            <div className={cx('modalTitle')}>Chi tiết đơn #{openOrder.order_id}</div>
                            <button className={cx('modalClose')} onClick={closeDetail}>
                                ✕
                            </button>
                        </div>

                        <div className={cx('modalBody')}>
                            <div className={cx('kv')}>
                                <div className={cx('k')}>Trạng thái</div>
                                <div className={cx('v')}>
                                    <span className={getBadgeClass(openOrder.status)}>
                                        {getStatusText(openOrder.status)}
                                    </span>
                                </div>
                            </div>

                            <div className={cx('kv')}>
                                <div className={cx('k')}>Địa chỉ nhận hàng</div>
                                <div className={cx('v')}>{openOrder.shipping_address || '-'}</div>
                            </div>

                            <div className={cx('kv')}>
                                <div className={cx('k')}>Thanh toán</div>
                                <div className={cx('v')}>{openOrder.payment_method || '-'}</div>
                            </div>

                            <div className={cx('kv')}>
                                <div className={cx('k')}>Ghi chú</div>
                                <div className={cx('v')}>{openOrder.note || '-'}</div>
                            </div>

                            <div className={cx('kv')}>
                                <div className={cx('k')}>Tổng tiền</div>
                                <div className={cx('v')}>
                                    {Number(openOrder.total_money || 0).toLocaleString('vi-VN')}đ
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
