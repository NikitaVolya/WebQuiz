/**
 * @file GameLoader.tsx
 */
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import styles from "./GameLoader.module.css";

export const GameLoader = () => {
  return (
    <div className={styles.loaderContainer}>
      <motion.div 
        className={styles.content}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* Icône animée */}
        <div className={styles.iconWrapper}>
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0] 
            }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Zap size={48} className={styles.zapIcon} fill="currentColor" />
          </motion.div>
        </div>

        <h2 className={styles.title}>Préparation de l'arène</h2>
        
        {/* Barre de chargement */}
        <div className={styles.progressContainer}>
          <motion.div 
            className={styles.progressBar}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
        </div>

        <motion.p 
          className={styles.statusText}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          Chargement des questions...
        </motion.p>
      </motion.div>
    </div>
  );
};