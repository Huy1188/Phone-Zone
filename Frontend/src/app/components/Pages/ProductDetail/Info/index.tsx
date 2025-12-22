import classNames from 'classnames/bind';
import styles from './Info.module.scss';

const cx = classNames.bind(styles);

interface Props {
  name: string;
  sku: string;
  rating?: number;
}

export default function Info({ name, sku, rating = 5 }: Props) {
  return (
    <div className={cx('info-wrapper')}>
      <h1 className={cx('product-name')}>{name}</h1>
      <div className={cx('meta')}>
        <span className={cx('sku')}>Mã SP: {sku}</span>
        <span className={cx('divider')}>|</span>
        <span className={cx('rating')}>
          Đánh giá: {rating}/5 <span style={{color: '#FFD700'}}>⭐</span>
        </span>
      </div>
    </div>
  );
}