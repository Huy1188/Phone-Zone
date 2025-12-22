'use client'; // Cần client để xử lý click đổi ảnh
import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Gallery.module.scss';

const cx = classNames.bind(styles);

interface Props {
  images: string[];
}

export default function Gallery({ images }: Props) {
  const [activeImg, setActiveImg] = useState(images[0]);

  return (
    <div className={cx('gallery-wrapper')}>
      <div className={cx('main-image')}>
        <img src={activeImg} alt="Product" />
      </div>
      <ul className={cx('thumbnails')}>
        {images.map((img, index) => (
          <li 
            key={index} 
            className={cx({ active: activeImg === img })}
            onClick={() => setActiveImg(img)}
          >
            <img src={img} alt={`thumb-${index}`} />
          </li>
        ))}
      </ul>
    </div>
  );
}