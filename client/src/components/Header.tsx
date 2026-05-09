/**
 * @file Header.tsx
 * @description Composant Header utilisant les CSS Modules.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, LogIn, User as UserIcon, Languages } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { ProfileDropdown } from "./ProfileDropdown"
import styles from "./Header.module.css";

interface HeaderProps {
    username?: string;
    isLoggedIn?: boolean;
    onLoginClick: () => void;
    onLanguageClick: () => void;
    onLogoutClick: () => void;
}

/**
 * Header global avec styles isolés.
 * @component
 */
export const Header = ({ username = "Invité", isLoggedIn = false, onLoginClick, onLanguageClick, onLogoutClick }: HeaderProps) => {
    const { theme, toggleTheme } = useTheme();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const headerBtnTransition = {
        type: "spring",
        stiffness: 400,
        damping: 25
    } as const;

    return (
        <header className={styles.gameHeader}>
            
            <div className={styles.headerLeft}>
                <div style={{ position: 'relative' }}>
                    <motion.button 
                        className={styles.userProfile}
                        onClick={() => {if(isLoggedIn) setIsDropdownOpen(!isDropdownOpen)}}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={headerBtnTransition}
                    >
                    <div className={styles.avatarCircle}>
                        <UserIcon size={20} />
                    </div>
                    <span className={styles.usernameText}>{username}</span>
                    </motion.button>
                    <ProfileDropdown 
                        isOpen={isDropdownOpen}
                        username={username}
                        onClose={() => setIsDropdownOpen(false)}
                        onLogout={() => {
                            setIsDropdownOpen(false);
                            onLogoutClick();
                        }}
                    />
                </div>
            </div>

            <div className={styles.headerRight}>
                <motion.button 
                    className={styles.themeToggle}
                    onClick={toggleTheme}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ rotate: 180, scale: 0.9 }}
                    transition={headerBtnTransition}
                >
                {theme === 'dark' ? 
                    <Sun size={24} color="#ffcc00" /> : 
                    <Moon size={24} color="#555" />
                }
                </motion.button>

                <motion.button 
                    className={styles.languageBtn}
                    onClick={onLanguageClick}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ rotate: 180, scale: 0.9 }}
                    transition={headerBtnTransition}
                >
                    <Languages size={20} />
                </motion.button>

                {!isLoggedIn && (<motion.button 
                        className={styles.authBtn} 
                        onClick={onLoginClick}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={headerBtnTransition}
                    >
                        <span className={styles.btnText}>
                        Connexion
                        </span>
                        <LogIn size={18} />
                    </motion.button>
                )}
            </div>
        </header>
    );
};