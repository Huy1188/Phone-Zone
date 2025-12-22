import classNames from 'classnames/bind';
import styles from './CheckoutSteps.module.scss';
import type { ReactNode } from 'react';

import CartIcon from '@/app/components/Common/Icon/CartIcon';
import PaymentIcon from '@/app/components/Common/Icon/PaymentIcon';
import SuccessIcon from '@/app/components/Common/Icon/SuccessIcon';

const cx = classNames.bind(styles);

type StepDef = {
    id: number;
    label: string;
    icon: (p: { size?: number; bg?: string; fg?: string }) => ReactNode;
};

const steps: StepDef[] = [
    { id: 1, label: 'Giỏ hàng', icon: CartIcon },
    { id: 2, label: 'Thanh toán', icon: PaymentIcon },
    { id: 3, label: 'Hoàn tất', icon: SuccessIcon },
];

export default function CheckoutSteps({ currentStep }: { currentStep: number }) {
    return (
        <div className={cx('wrap')} aria-label="Checkout steps">
            {steps.map((s, idx) => {
                const isDone = s.id < currentStep;
                const isActive = s.id === currentStep;
                const isUpcoming = s.id > currentStep;

                const Icon = s.icon;

                // màu theo trạng thái
                const bg = isDone ? '#16a34a' : isActive ? '#E30019' : '#e5e7eb'; // green / red / gray
                const fg = isUpcoming ? '#6b7280' : '#ffffff'; // upcoming thì nét xám

                return (
                    <div key={s.id} className={cx('step')}>
                        <div className={cx('node')}>
                            <div className={cx('dot', { done: isDone, active: isActive, upcoming: isUpcoming })}>
                                <Icon size={30} bg={bg} fg={fg} />
                                <div className={cx('text')}>
                                    <div className={cx('label', { done: isDone, active: isActive })}>{s.label}</div>
                                    {/* <div className={cx('hint')}>
                                        {isDone ? 'Đã xong' : isActive ? 'Đang thực hiện' : 'Sắp tới'}
                                    </div> */}
                                </div>
                            </div>

                            {idx !== steps.length - 1 && <div className={cx('line', { done: isDone })} />}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
