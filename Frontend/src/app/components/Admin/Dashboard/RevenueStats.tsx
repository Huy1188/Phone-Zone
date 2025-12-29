'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { getAllOrders } from '@/services/admin/orderService';
import styles from './Dashboard.module.scss';

type RevenueMode = 'day' | 'month' | 'year';
type RevenueScope = 'delivered' | 'non_cancelled' | 'all';

type OrderLike = {
    order_id?: number | string;
    createdAt?: string;
    status?: string;
    total_money?: number | string;
    total_price?: number | string;
};

function toNumber(v: any) {
    const n = Number(v ?? 0);
    return Number.isFinite(n) ? n : 0;
}

function pad2(n: number) {
    return String(n).padStart(2, '0');
}

function ymd(d: Date) {
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function formatMoney(v: number) {
    return v.toLocaleString('vi-VN');
}

function clampDateToLocalDay(d: Date) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
}

// Simple SVG bar chart (no external libs)
function SvgBarChart({ points }: { points: { label: string; value: number }[] }) {
    const width = 700;
    const height = 260;
    const padding = { top: 18, right: 16, bottom: 34, left: 100 };

    const max = Math.max(1, ...points.map((p) => p.value));
    const innerW = width - padding.left - padding.right;
    const innerH = height - padding.top - padding.bottom;

    const barCount = points.length || 1;
    const gap = barCount > 1 ? Math.min(10, innerW / barCount / 4) : 0;
    const barW = Math.max(2, innerW / barCount - gap);

    // ticks
    const ticks = 4;
    const tickValues = Array.from({ length: ticks + 1 }, (_, i) => (max * i) / ticks);

    return (
        <svg className={styles.svgChart} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
            {/* grid + y-axis labels */}
            {tickValues.map((tv, i) => {
                const y = padding.top + innerH - (tv / max) * innerH;
                return (
                    <g key={i}>
                        <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} className={styles.svgGrid} />
                        <text x={padding.left - 10} y={y + 4} textAnchor="end" className={styles.svgTick}>
                            {formatMoney(Math.round(tv))}
                        </text>
                    </g>
                );
            })}

            {/* bars */}
            {points.map((p, i) => {
                const x = padding.left + i * (barW + gap);
                const h = (p.value / max) * innerH;
                const y = padding.top + innerH - h;
                return (
                    <g key={p.label}>
                        <rect x={x} y={y} width={barW} height={h} rx={6} className={styles.svgBar} />
                        {/* show sparse labels for long series */}
                        {points.length <= 16 ||
                        i === 0 ||
                        i === points.length - 1 ||
                        i % Math.ceil(points.length / 10) === 0 ? (
                            <text x={x + barW / 2} y={height - 12} textAnchor="middle" className={styles.svgLabel}>
                                {p.label}
                            </text>
                        ) : null}
                    </g>
                );
            })}

            {/* axes */}
            <line
                x1={padding.left}
                y1={padding.top}
                x2={padding.left}
                y2={height - padding.bottom}
                className={styles.svgAxis}
            />
            <line
                x1={padding.left}
                y1={height - padding.bottom}
                x2={width - padding.right}
                y2={height - padding.bottom}
                className={styles.svgAxis}
            />
        </svg>
    );
}

export default function RevenueStats() {
    const today = useMemo(() => new Date(), []);
    const thisYear = today.getFullYear();
    const thisMonth = today.getMonth() + 1;

    const [orders, setOrders] = useState<OrderLike[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [mode, setMode] = useState<RevenueMode>('month');
    const [scope, setScope] = useState<RevenueScope>('delivered');

    // day range defaults: from 1st day of current month -> today
    const [dayFrom, setDayFrom] = useState(() => {
        const d = new Date();
        d.setDate(1);
        return ymd(d);
    });
    const [dayTo, setDayTo] = useState(() => ymd(new Date()));

    // month defaults: current month
    const [monthValue, setMonthValue] = useState(() => `${thisYear}-${pad2(thisMonth)}`);
    const [yearValue, setYearValue] = useState(() => String(thisYear));

    // fetch all orders (paged)
    useEffect(() => {
        const run = async () => {
            setLoading(true);
            setError(null);
            try {
                const limit = 200;
                let page = 1;
                let all: OrderLike[] = [];
                let totalPages: number | null = null;

                // safety to avoid infinite loops
                const MAX_PAGES = 50;

                while (page <= MAX_PAGES) {
                    const res: any = await getAllOrders({ page, limit });
                    if (!res?.success) throw new Error(res?.message || 'Không thể tải đơn hàng');

                    const data = res?.data ?? {};
                    const items = (data?.orders ?? data ?? []) as any[];
                    if (Array.isArray(items)) all = all.concat(items);

                    const tp = data?.paging?.totalPages;
                    if (typeof tp === 'number') totalPages = tp;

                    if (totalPages != null) {
                        if (page >= totalPages) break;
                    } else {
                        // fallback: if fewer than limit => no more pages
                        if (!Array.isArray(items) || items.length < limit) break;
                    }
                    page += 1;
                }

                setOrders(all);
            } catch (e: any) {
                console.error(e);
                setError(e?.message || 'Lỗi tải dữ liệu');
            } finally {
                setLoading(false);
            }
        };
        run();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const availableYears = useMemo(() => {
        const years = new Set<number>();
        for (const o of orders) {
            if (!o?.createdAt) continue;
            const d = new Date(o.createdAt);
            if (!Number.isNaN(d.getTime())) years.add(d.getFullYear());
        }
        if (years.size === 0) {
            // fallback: show last 6 years
            return Array.from({ length: 6 }, (_, i) => thisYear - i);
        }
        return Array.from(years).sort((a, b) => b - a);
    }, [orders, thisYear]);

    // normalize filter state when changing mode
    useEffect(() => {
        if (mode === 'year') {
            // ensure yearValue is valid
            if (!availableYears.includes(Number(yearValue)) && availableYears.length) {
                setYearValue(String(availableYears[0]));
            }
        }
    }, [mode, availableYears, yearValue]);

    const filteredOrders = useMemo(() => {
        const wantedScope = scope;
        const inScope = (o: OrderLike) => {
            const st = String(o.status || 'pending').toLowerCase();
            if (wantedScope === 'all') return true;
            if (wantedScope === 'non_cancelled') return st !== 'cancelled';
            return st === 'delivered';
        };

        if (mode === 'day') {
            const from = clampDateToLocalDay(new Date(dayFrom));
            const to = clampDateToLocalDay(new Date(dayTo));
            // inclusive end
            to.setHours(23, 59, 59, 999);

            return orders.filter((o) => {
                if (!inScope(o)) return false;
                if (!o?.createdAt) return false;
                const d = new Date(o.createdAt);
                if (Number.isNaN(d.getTime())) return false;
                return d >= from && d <= to;
            });
        }

        if (mode === 'month') {
            const [y, m] = monthValue.split('-').map((x) => Number(x));
            return orders.filter((o) => {
                if (!inScope(o)) return false;
                if (!o?.createdAt) return false;
                const d = new Date(o.createdAt);
                if (Number.isNaN(d.getTime())) return false;
                return d.getFullYear() === y && d.getMonth() + 1 === m;
            });
        }

        // year
        const y = Number(yearValue);
        return orders.filter((o) => {
            if (!inScope(o)) return false;
            if (!o?.createdAt) return false;
            const d = new Date(o.createdAt);
            if (Number.isNaN(d.getTime())) return false;
            return d.getFullYear() === y;
        });
    }, [orders, mode, scope, dayFrom, dayTo, monthValue, yearValue]);

    const revenueTotal = useMemo(() => {
        return filteredOrders.reduce((sum, o) => sum + toNumber(o.total_money ?? o.total_price), 0);
    }, [filteredOrders]);

    const ordersCount = filteredOrders.length;
    const avgOrderValue = ordersCount > 0 ? revenueTotal / ordersCount : 0;

    const points = useMemo(() => {
        const map = new Map<string, number>();

        const add = (label: string, v: number) => {
            map.set(label, (map.get(label) || 0) + v);
        };

        if (mode === 'year') {
            for (let m = 1; m <= 12; m++) add(pad2(m), 0);
            for (const o of filteredOrders) {
                const d = new Date(o.createdAt || '');
                if (Number.isNaN(d.getTime())) continue;
                const label = pad2(d.getMonth() + 1);
                add(label, toNumber(o.total_money ?? o.total_price));
            }
            return Array.from(map.entries())
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([label, value]) => ({ label, value }));
        }

        if (mode === 'month') {
            // show all days in month
            const [y, m] = monthValue.split('-').map((x) => Number(x));
            const daysInMonth = new Date(y, m, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) add(pad2(day), 0);

            for (const o of filteredOrders) {
                const d = new Date(o.createdAt || '');
                if (Number.isNaN(d.getTime())) continue;
                add(pad2(d.getDate()), toNumber(o.total_money ?? o.total_price));
            }
            return Array.from(map.entries())
                .sort((a, b) => Number(a[0]) - Number(b[0]))
                .map(([label, value]) => ({ label, value }));
        }

        // day: group by date
        for (const o of filteredOrders) {
            const d = new Date(o.createdAt || '');
            if (Number.isNaN(d.getTime())) continue;
            add(ymd(d), toNumber(o.total_money ?? o.total_price));
        }
        return Array.from(map.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([label, value]) => ({ label, value }));
    }, [filteredOrders, mode, monthValue]);

    const rangeLabel = useMemo(() => {
        if (mode === 'day') return `${dayFrom} → ${dayTo}`;
        if (mode === 'month') return `Tháng ${monthValue}`;
        return `Năm ${yearValue}`;
    }, [mode, dayFrom, dayTo, monthValue, yearValue]);

    return (
        <div className={styles.revenueWrap}>
            <div className={styles.revenueHeader}>
                <div>
                    <div className={styles.revenueTitle}>Thống kê doanh thu</div>
                    <div className={styles.revenueSub}>{rangeLabel}</div>
                </div>

                <div className={styles.filters}>
                    <div className={styles.filterGroup}>
                        <label>Kiểu lọc</label>
                        <select value={mode} onChange={(e) => setMode(e.target.value as RevenueMode)}>
                            <option value="day">Ngày</option>
                            <option value="month">Tháng</option>
                            <option value="year">Năm</option>
                        </select>
                    </div>

                    {mode === 'day' ? (
                        <>
                            <div className={styles.filterGroup}>
                                <label>Từ ngày</label>
                                <input type="date" value={dayFrom} onChange={(e) => setDayFrom(e.target.value)} />
                            </div>
                            <div className={styles.filterGroup}>
                                <label>Đến ngày</label>
                                <input type="date" value={dayTo} onChange={(e) => setDayTo(e.target.value)} />
                            </div>
                        </>
                    ) : null}

                    {mode === 'month' ? (
                        <div className={styles.filterGroup}>
                            <label>Tháng</label>
                            <input type="month" value={monthValue} onChange={(e) => setMonthValue(e.target.value)} />
                        </div>
                    ) : null}

                    {mode === 'year' ? (
                        <div className={styles.filterGroup}>
                            <label>Năm</label>
                            <select value={yearValue} onChange={(e) => setYearValue(e.target.value)}>
                                {availableYears.map((y) => (
                                    <option key={y} value={String(y)}>
                                        {y}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : null}

                    <div className={styles.filterGroup}>
                        <label>Chỉ tính</label>
                        <select value={scope} onChange={(e) => setScope(e.target.value as RevenueScope)}>
                            <option value="delivered">Đơn đã giao</option>
                            <option value="non_cancelled">Trừ đơn huỷ</option>
                            <option value="all">Tất cả đơn</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? <div className={styles.revenueLoading}>Đang tải dữ liệu doanh thu...</div> : null}
            {error ? <div className={styles.revenueError}>⚠️ {error}</div> : null}

            <div className={styles.summaryGrid}>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryLabel}>Tổng doanh thu</div>
                    <div className={styles.summaryValue}>{formatMoney(revenueTotal)} ₫</div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryLabel}>Số đơn hàng</div>
                    <div className={styles.summaryValue}>{ordersCount}</div>
                </div>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryLabel}>Trung bình / đơn</div>
                    <div className={styles.summaryValue}>{formatMoney(Math.round(avgOrderValue))} ₫</div>
                </div>
            </div>

            <div className={styles.chartWrap}>
                {points.length === 0 ? (
                    <div className={styles.noData}>Không có dữ liệu phù hợp.</div>
                ) : (
                    <>
                        <SvgBarChart points={points} />

                        <div className={styles.revenueTableWrap}>
                            <table className={styles.revenueTable}>
                                <thead>
                                    <tr>
                                        <th style={{ width: 160 }}>
                                            {mode === 'year' ? 'Tháng' : mode === 'month' ? 'Ngày' : 'Ngày'}
                                        </th>
                                        <th style={{ width: 220, textAlign: 'right' }}>Doanh thu</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {points.map((p) => (
                                        <tr key={p.label}>
                                            <td>{p.label}</td>
                                            <td style={{ textAlign: 'right' }}>{formatMoney(p.value)} ₫</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
