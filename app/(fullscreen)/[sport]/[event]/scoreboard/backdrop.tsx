import styles from './backdrop.module.css';

export function Backdrop() {
  return (
    <div className={styles.backdrop}>
      <div className="absolute inset-0 bg-gray-2" />
      <div className={styles['backdrop-x']}>
        <div className={styles['backdrop-y']}>
          <div className={styles['backdrop-image']} />
        </div>
      </div>
    </div>
  );
}
