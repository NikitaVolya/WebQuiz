/**
 * @file ProfileDropdown.tsx
 */
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Settings, Trophy, ChevronRight } from "lucide-react";
import styles from "./ProfileDropdown.module.css";

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  onLogout: () => void;
}

export const ProfileDropdown = ({ isOpen, onClose, username, onLogout }: ProfileDropdownProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay invisible pour fermer en cliquant n'importe où */}
          <div className={styles.invisibleOverlay} onClick={onClose} />
          
          <motion.div 
            className={styles.dropdownCard}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <div className={styles.header}>
              <div className={styles.avatarLarge}>
                {username.charAt(0).toUpperCase()}
              </div>
              <div className={styles.userInfo}>
                <span className={styles.name}>{username}</span>
                <span className={styles.status}>Joueur Élite</span>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.menuList}>
              <button className={styles.menuItem}>
                <div className={styles.menuIcon}><Trophy size={18} /></div>
                <span>Mes Statistiques</span>
                <ChevronRight size={14} className={styles.arrow} />
              </button>
              
              <button className={styles.menuItem}>
                <div className={styles.menuIcon}><Settings size={18} /></div>
                <span>Paramètres</span>
                <ChevronRight size={14} className={styles.arrow} />
              </button>
            </div>

            <div className={styles.divider} />

            <button className={`${styles.menuItem} ${styles.logoutBtn}`} onClick={onLogout}>
              <div className={styles.menuIcon}><LogOut size={18} /></div>
              <span>Se déconnecter</span>
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};