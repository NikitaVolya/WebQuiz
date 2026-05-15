/**
 * @file HubView.tsx
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Users } from "lucide-react";
import { useQuiz } from "../hooks/useQuiz";
import type { GameMode, GameModifier } from "../types/game";
import styles from "./HubView.module.css";

import { CategoryView } from "./CategoryView";
import { Header } from "../components/Header";
import { DiscoverSection } from "../components/DiscoverSection";
import { QuizPreviewModal } from "../components/QuizPreviewModal";
import { CategoryCarousel } from "../components/CategoryCarousel";
import { HubFooter } from "../components/HubFooter";

interface HubViewProps {
  onStartGame: (config: { quizId: number; mode: GameMode; modifier: GameModifier }) => void;
  onJoinGame: () => void;
  isLoggedIn: boolean;
  username: string;
  onOpenAuth: () => void;
  onLanguageClick: () => void;
  onLogoutClick: () => void;
  onStudioClick: () => void;
}

type ViewState = 'HOME' | 'CATEGORY' | 'SEARCH';

export const HubView = ({ 
  onStartGame, 
  onJoinGame, 
  isLoggedIn, 
  username, 
  onOpenAuth,
  onLanguageClick,
  onLogoutClick,
  onStudioClick,
}: HubViewProps) => {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [selectedCatId, setSelectedCatId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { 
    quizzes, 
    categories, 
    loading, 
    loadDiscoveryData, 
    filterQuizzes 
  } = useQuiz();

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);

  useEffect(() => {
    loadDiscoveryData();
  }, [loadDiscoveryData]);

  useEffect(() => {
    filterQuizzes(selectedCatId || undefined, searchQuery);
  }, [selectedCatId, searchQuery]);

  useEffect(() => {
    const handlePopState = () => {
      if (currentView !== 'HOME') {
        setCurrentView('HOME');
        setSelectedCatId(null);
        setSearchQuery("");
      }
    };
    window.addEventListener('popstate', handlePopState);
    if (currentView !== 'HOME') window.history.pushState({ view: currentView }, "");
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentView]);

  const navigateToCategory = (id: number) => {
    setSelectedCatId(id);
    setCurrentView('CATEGORY');
    window.scrollTo(0, 0);
  };

  const handleSelectQuiz = (quizId: number) => {
    setSelectedQuizId(quizId);
    setIsPreviewOpen(true);
  };

  const renderView = () => {
    switch (currentView) {
      case 'CATEGORY':
        const cat = categories.find(c => c.id === selectedCatId);
        return cat ? (
          <CategoryView 
            category={cat}
            quizzes={quizzes}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectQuiz={handleSelectQuiz}
            isLoading={loading}
          />
        ) : null;

      case 'HOME':
      default:
        return (
          <div className={styles.hubContent}>
            <motion.h1 
              className={styles.hubTitle}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 120 }}
            >
              Quiz <span>Battle</span>
            </motion.h1>

            {/* Grille des actions rapides */}
            <div className={styles.actionsGrid}>
              <motion.button 
                className={`${styles.actionCard} ${styles.cardCreate}`}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStudioClick}
              >
                <div className={styles.iconWrapper}>
                  <PlusCircle size={48} color="white" />
                </div>
                <h2>CRÉER</h2>
              </motion.button>

              <motion.button 
                className={`${styles.actionCard} ${styles.cardJoin}`}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={onJoinGame}
              >
                <div className={styles.iconWrapper}>
                  <Users size={48} color="white" />
                </div>
                <h2>REJOINDRE</h2>
              </motion.button>
            </div>

            {/* Le Carousel */}
            <CategoryCarousel 
              categories={categories}
              selectedCategoryId={selectedCatId} 
              onSelectCategory={navigateToCategory}
            />

            <div className={styles.discoverWrapper}>
              <DiscoverSection 
                quizzes={quizzes} 
                isLoading={loading}
                searchTerm={searchQuery}
                onSearchChange={setSearchQuery}
                onSelectQuiz={handleSelectQuiz} 
              />
            </div>
          </div>
        );
    }
  };

  return (
    <motion.div 
      className={styles.hubContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Header 
        isLoggedIn={isLoggedIn} 
        username={username} 
        onLoginClick={onOpenAuth}
        onLanguageClick={onLanguageClick}
        onLogoutClick={onLogoutClick}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentView + (selectedCatId || "")}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>

      <QuizPreviewModal 
        isOpen={isPreviewOpen}
        quizId={selectedQuizId}
        onClose={() => {
          setIsPreviewOpen(false);
          setSelectedQuizId(null);
        }}
        onConfirm={onStartGame}
      />

      <HubFooter />
    </motion.div>
  );
};