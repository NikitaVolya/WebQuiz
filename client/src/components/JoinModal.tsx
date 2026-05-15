/**
 * @file JoinModal.tsx
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users } from "lucide-react";
import styles from "./JoinModal.module.css";

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (code: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export const JoinModal = ({ isOpen, onClose, onJoin, isLoading }: JoinModalProps) => {
  const [code, setCode] = useState("");

  useEffect(() => {
    if (isOpen) setCode("");
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (value.length <= 6) {
      setCode(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6 && !isLoading) {
      onJoin(code);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.overlay}>
          <motion.div 
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            {/* Bouton fermer */}
            <button className={styles.closeBtn} onClick={onClose}>
              <X size={20} />
            </button>

            <div className={styles.header}>
              <div className={styles.iconBox}>
                <Users size={32} className={styles.icon} />
              </div>
              <h2 className={styles.title}>Rejoindre une partie</h2>
              <p className={styles.subtitle}>Saisissez le code à 6 caractères</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  placeholder="EX: A1B2C3"
                  value={code}
                  onChange={handleInputChange}
                  className={styles.input}
                  autoFocus
                  disabled={isLoading}
                />
              </div>

              <button 
                type="submit" 
                className={styles.joinBtn}
                disabled={code.length !== 6 || isLoading}
              >
                {isLoading ? (
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className={styles.spinner}
                  />
                ) : (
                  "Entrer dans le lobby"
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};