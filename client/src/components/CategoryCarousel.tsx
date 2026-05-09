/**
 * @file CategoryCarousel.tsx
 */
import { motion } from "framer-motion";
import { type Category } from "../types/quiz";
import styles from "./CategoryCarousel.module.css";

interface CategoryCarouselProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelectCategory: (id: number) => void;
}

export const CategoryCarousel = ({ 
  categories,
  selectedCategoryId, 
  onSelectCategory 
}: CategoryCarouselProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.scrollWrapper}>
        {/* Cartes Dynamiques */}
        {categories.map((cat) => (
          <motion.div 
            key={cat.id}
            className={`${styles.catCard} ${selectedCategoryId === cat.id ? styles.active : ''}`}
            onClick={() => onSelectCategory(cat.id)}
          >
            <img src={cat.imageUrl} alt={cat.name} className={styles.catImage} />
            <div className={styles.overlay} style={{ '--accent-color': cat.colorCode } as any} />
            <span className={styles.catName}>{cat.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};