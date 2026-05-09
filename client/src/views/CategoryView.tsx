/**
 * @file CategoryView.tsx
 */
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import type { Category, Quiz } from "../types/quiz";
import { DiscoverSection } from "../components/DiscoverSection";
import styles from "./CategoryView.module.css";

interface CategoryViewProps {
  category: Category;
  quizzes: Quiz[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectQuiz: (quizId: number) => void;
  isLoading: boolean;
}

export const CategoryView = ({ 
  category, 
  quizzes, 
  searchQuery, 
  onSearchChange,
  onSelectQuiz,
  isLoading 
}: CategoryViewProps) => {
  return (
    <motion.div 
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* HEADER */}
      <header className={styles.hero}>
        <img src={category.imageUrl} alt="" className={styles.heroImage} />
        <div 
          className={styles.overlay} 
          style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.3), ${category.colorCode}dd, var(--bg-main))` }} 
        />

        <div className={styles.heroContent}>
          <motion.span 
            className={styles.badge}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{ backgroundColor: category.colorCode }}
          >
            {category.count} Quiz disponibles
          </motion.span>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {category.name}
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {category.description}
          </motion.p>
        </div>
      </header>

      {/* ZONE DE RECHERCHE ET RÉSULTATS */}
      <div className={styles.content}>
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder={`Rechercher dans ${category.name}...`}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <DiscoverSection 
            quizzes={quizzes} 
            isLoading={isLoading}
            searchTerm={searchQuery}
            onSearchChange={onSearchChange}
            onSelectQuiz={onSelectQuiz}
            hideHeader={true}
        />
      </div>
    </motion.div>
  );
};