import classNames from 'classnames/bind';
import styles from '../Header/Header.module.scss';
import Image from 'next/image';
import Navbar from './Navbar';
import Subnav from './SubNavbar';

const cx = classNames.bind(styles);

function Header() {
    return (
        <>
            <div className={cx('banner')}>
                <Image
                    src="/img/banner/main/header-banner.png"
                    alt="banner"
                    width={1200}
                    height={50}
                />
            </div>
            <Navbar></Navbar>
            <Subnav></Subnav>
        </>
    );
}

export default Header;
