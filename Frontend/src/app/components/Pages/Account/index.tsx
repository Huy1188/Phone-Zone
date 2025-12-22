"use client";

import { useEffect, useMemo, useState } from "react";
import classNames from "classnames/bind";
import styles from "./account.module.scss";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const cx = classNames.bind(styles);

type TabKey = "profile" | "orders" | "address" | "password";

export default function AccountPage() {
  const router = useRouter();
  const pathname = usePathname();

  const { user, logoutUser } = useAuth();

  // guard: chưa login => đá sang /login
  useEffect(() => {
    if (user === null) router.push("/login");
  }, [user, router]);

  const displayName = useMemo(() => {
    // nếu BE sau này có username/fullname thì thay ở đây
    const anyUser = user as any;
    return anyUser?.username || anyUser?.fullname || user?.email?.split("@")[0] || "User";
  }, [user]);

  // Tab đơn giản (sau này bạn có thể tách route con)
  const [tab, setTab] = useState<TabKey>("profile");

  useEffect(() => {
    // nếu bạn muốn điều khiển tab theo query ?tab=
    // hiện tại default profile
  }, [pathname]);

  if (!user) return null;

  return (
    <div className={cx("wrap")}>
      <div className={cx("container")}>
        {/* SIDEBAR */}
        <aside className={cx("sidebar")}>
          <div className={cx("userBox")}>
            <div className={cx("avatar")}>
              <i className="fa-solid fa-circle-user" />
            </div>

            <div className={cx("userInfo")}>
              <div className={cx("hello")}>Xin chào,</div>
              <div className={cx("name")}>{displayName}</div>
              <div className={cx("email")}>{user.email}</div>
            </div>
          </div>

          <div className={cx("menu")}>
            <button className={cx("item", { active: tab === "profile" })} onClick={() => setTab("profile")}>
              Thông tin tài khoản
            </button>

            <button className={cx("item", { active: tab === "orders" })} onClick={() => setTab("orders")}>
              Đơn hàng của tôi
            </button>

            <button className={cx("item", { active: tab === "address" })} onClick={() => setTab("address")}>
              Sổ địa chỉ
            </button>

            <button className={cx("item", { active: tab === "password" })} onClick={() => setTab("password")}>
              Đổi mật khẩu
            </button>

            <button
              className={cx("logout")}
              onClick={async () => {
                await logoutUser();
                router.push("/");
                router.refresh();
              }}
            >
              Đăng xuất
            </button>
          </div>
        </aside>

        {/* CONTENT */}
        <main className={cx("content")}>
          {tab === "profile" && (
            <section>
              <h2 className={cx("title")}>Thông tin tài khoản</h2>

              <div className={cx("card")}>
                <div className={cx("row")}>
                  <div className={cx("label")}>Họ tên</div>
                  <div className={cx("value")}>{displayName}</div>
                </div>

                <div className={cx("row")}>
                  <div className={cx("label")}>Email</div>
                  <div className={cx("value")}>{user.email}</div>
                </div>

                <div className={cx("row")}>
                  <div className={cx("label")}>Mã người dùng</div>
                  <div className={cx("value")}>{user.user_id}</div>
                </div>

                <div className={cx("hint")}>
                  * Hiện BE chưa trả “tên”, nên FE đang lấy theo email. Nếu bạn muốn giống GearVN hoàn toàn,
                  hãy cho BE trả thêm <b>username/fullname</b> trong <code>/api/auth/me</code>.
                </div>
              </div>
            </section>
          )}

          {tab === "orders" && (
            <section>
              <h2 className={cx("title")}>Đơn hàng của tôi</h2>
              <div className={cx("card")}>
                <p>Chưa có API lấy đơn hàng theo user. Khi có endpoint, mình nối dữ liệu và render bảng đơn hàng giống GearVN.</p>
                <Link href="/" className={cx("link")}>
                  Tiếp tục mua sắm
                </Link>
              </div>
            </section>
          )}

          {tab === "address" && (
            <section>
              <h2 className={cx("title")}>Sổ địa chỉ</h2>
              <div className={cx("card")}>
                <p>Chưa có API địa chỉ theo user. Khi có, mình làm CRUD địa chỉ giống GearVN.</p>
              </div>
            </section>
          )}

          {tab === "password" && (
            <section>
              <h2 className={cx("title")}>Đổi mật khẩu</h2>
              <div className={cx("card")}>
                <p>Chưa có API đổi mật khẩu cho user. Nếu bạn đưa endpoint, mình nối luôn.</p>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
