import Link from 'next/link';
import styles from './Breadcrumb.module.scss';

export interface BreadcrumbItem {
  label: string;
  link?: string; // Link là optional, phần tử cuối thường không cần link
}

interface Props {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: Props) {
  // Tự động thêm "Trang chủ" vào đầu danh sách
  const breadcrumbList = [
    { label: 'Trang chủ', link: '/' },
    ...items
  ];

  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <ol>
        {breadcrumbList.map((item, index) => {
          const isLast = index === breadcrumbList.length - 1;

          return (
            <li key={index} className={isLast ? styles.active : ''}>
              {/* Nếu có link và không phải phần tử cuối thì dùng thẻ Link */}
              {item.link && !isLast ? (
                <Link href={item.link} title={item.label}>
                  {item.label}
                </Link>
              ) : (
                // Phần tử cuối cùng (trang hiện tại) chỉ hiển thị text
                <span>{item.label}</span>
              )}
              
              {/* Icon ngăn cách (Divider), không hiện ở phần tử cuối */}
              {!isLast && <span className={styles.divider}>›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}