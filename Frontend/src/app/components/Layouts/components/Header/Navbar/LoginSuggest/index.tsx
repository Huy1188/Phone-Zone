import classNames from "classnames/bind";
import styles from "../Navbar.module.scss";
import Link from "next/link";

const cx = classNames.bind(styles);

function LoginSuggest() {
  return (
    <div className={cx("nav-login-suggest")}>
      <ul className={cx("nav-suggest-container")}>
        <li className={cx("nav-suggest-item")}>
          <h3 className={cx("nav-suggest-item__name")}>
            <i
              className={cx(
                "fa-regular",
                "fa-hand-peace",
                "nav-suggest-item__icon"
              )}
            />
            Xin chào, vui lòng đăng nhập
          </h3>
        </li>

        <li className={cx("nav-suggest-item", "nav-suggest__btn")}>
          <Link href="/login" className={cx("nav-suggest__btn-login")}>
            Đăng nhập
          </Link>
          <Link href="/register" className={cx("nav-suggest__btn-register")}>
            Đăng kí
          </Link>
        </li>

        <li className={cx("nav-suggest-item")}>
          <Link
            href="/help"
            className={cx(
              "nav-suggest-item__help",
              "nav__style-hover"
            )}
          >
            <i
              className={cx(
                "fa-regular",
                "fa-circle-question",
                "nav-suggest-item__icon"
              )}
            />
            Trợ giúp
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default LoginSuggest;
