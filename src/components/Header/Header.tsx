import { useMemo } from 'react';
import clsx from 'clsx';
import styles from './Header.module.css';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/Button';

type Tab = 'rooms' | 'assets' | 'bookings' | 'data';

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const a = parts[0]?.[0] ?? '';
  const b = parts[1]?.[0] ?? '';
  return (a + b).toUpperCase();
}

export function Header({
  activeTab,
  onTabChange,
}: {
  activeTab: Tab;
  onTabChange: (t: Tab) => void;
}) {
  const { user, isAuthenticated, signIn, signOut } = useAuth();

  const displayName = useMemo(() => {
    if (user?.name) return user.name;
    return 'Гость';
  }, [user]);

  return (
    <header className={styles.header}>
      <div className={styles.brand}>Room Assets</div>

      <nav className={styles.nav}>
        <div
          className={clsx(styles.navItem, activeTab === 'rooms' && styles.navItemActive)}
          onClick={() => onTabChange('rooms')}
        >
          Rooms
        </div>
        <div
          className={clsx(styles.navItem, activeTab === 'assets' && styles.navItemActive)}
          onClick={() => onTabChange('assets')}
        >
          Assets
        </div>
        <div
          className={clsx(styles.navItem, activeTab === 'bookings' && styles.navItemActive)}
          onClick={() => onTabChange('bookings')}
        >
          Bookings
        </div>
        <div
          className={clsx(styles.navItem, activeTab === 'data' && styles.navItemActive)}
          onClick={() => onTabChange('data')}
        >
          Data
        </div>
      </nav>

      <div className={styles.userBox}>
        <div className={styles.avatar}>{initials(displayName)}</div>
        <div>{displayName}</div>

        {!isAuthenticated ? (
          <Button
            variant="secondary"
            onClick={() =>
              signIn({ id: 'u1', name: 'Sema Student', email: 'student@example.com' })
            }
          >
            Войти
          </Button>
        ) : (
          <Button variant="secondary" onClick={signOut}>
            Выйти
          </Button>
        )}
      </div>
    </header>
  );
}