import Link from 'next/link';
import styles from './Breadcrumb.module.scss';

export interface BreadcrumbItem {
  label: string;
  link?: string; 
}

interface Props {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: Props) {
  
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
              {}
              {item.link && !isLast ? (
                <Link href={item.link} title={item.label}>
                  {item.label}
                </Link>
              ) : (
                
                <span>{item.label}</span>
              )}
              
              {}
              {!isLast && <span className={styles.divider}>›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}