import { Shield, Code2, LifeBuoy } from 'lucide-react';
import styles from './HubFooter.module.css';

export const HubFooter = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.left}>
          <span className={styles.version}>v1.2.0</span>
          <span className={styles.separator}>•</span>
          <div className={styles.status}>
            <span className={styles.statusDot}></span>
            Serveurs opérationnels
          </div>
        </div>

        <div className={styles.center}>
          <p>© 2026 Quiz Battle. Tous droits réservés.</p>
        </div>

        <div className={styles.right}>
          <a href="#" className={styles.link} title="Aide">
            <LifeBuoy size={18} />
          </a>
          <a href="#" className={styles.link} title="Sécurité">
            <Shield size={18} />
          </a>
          <a href="#" className={styles.link} title="GitHub">
            <Code2 size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};