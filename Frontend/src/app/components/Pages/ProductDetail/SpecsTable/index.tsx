import classNames from 'classnames/bind';
import styles from './SpecsTable.module.scss';

const cx = classNames.bind(styles);

interface SpecItem {
  label: string;
  value: string;
}

export default function SpecsTable({ specs }: { specs: SpecItem[] }) {
  return (
    <div className={cx('specs-wrapper')}>
      <h3>Thông số kỹ thuật</h3>
      <table className={cx('table')}>
        <tbody>
          {specs.map((item, index) => (
            <tr key={index}>
              <td className={cx('label')}>{item.label}</td>
              <td className={cx('value')}>{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}