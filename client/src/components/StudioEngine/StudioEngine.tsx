import React, { useEffect, useState, useRef } from 'react';
import { type StudioAction } from '../../views/Studio/studioReducer';
import type { QuizDraft } from '../../types/studio/QuizDraft';
import styles from './StudioEngine.module.css';
import { useQuiz } from '../../hooks/useQuiz';
import { X, Layout, ImageIcon, Hash, Menu, ChevronDown } from 'lucide-react';

import { QuestionCard } from './QuestionCard';
import { StudioSidebar } from './StudioSidebar';

interface StudioEngineProps {
  quiz: QuizDraft;
  dispatch: React.Dispatch<StudioAction>;
  onSave: (publish?: boolean) => void;
  onExit: () => void;
}

const StudioEngine: React.FC<StudioEngineProps> = ({ quiz, dispatch, onSave, onExit }) => {
  const [activeId, setActiveId] = useState<string>(quiz.questions[0]?.tempId || '');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { categories, fetchCategories } = useQuiz();
  const [isCatOpen, setIsCatOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const currentCategoryLabel = categories.find(c => c.id === quiz.categoryId)?.name || 'Catégorie...';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setIsCatOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace('question-', '');
            setActiveId(id);
          }
        });
      },
      { 
        root: scrollAreaRef.current, 
        rootMargin: '-45% 0px -45% 0px',
        threshold: 0 
      }
    );
    document.querySelectorAll('.studio-question-card').forEach((card) => {
      observer.observe(card);
    });
    
    return () => observer.disconnect();
  }, [quiz.questions.length]);

  const scrollToSection = (id: string) => {
    const elementId = id === 'meta' ? 'quiz-meta' : `question-${id}`;
    document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (window.innerWidth <= 1024) setIsSidebarOpen(false);
  };

  const handleSmartExit = () => {
    onSave(false);
    onExit();
  };

  return (
    <div className={styles.container}>
      <header className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <button className={styles.menuBtn} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Layout size={22} color="var(--accent)" className={styles.hideMobile} />
          <h1 className={styles.logoText}>STUDIO</h1>
        </div>

        <div className={styles.topBarRight}>
          <button 
            className={styles.closeIconBtn} 
            onClick={handleSmartExit}
            title="Enregistrer et quitter"
          >
            <X size={24} />
          </button>
        </div>
      </header>

      <div className={styles.mainLayout}>

        {isSidebarOpen && (
          <div 
            className={styles.sidebarOverlay} 
            onClick={() => setIsSidebarOpen(false)} 
          />
        )}

        <StudioSidebar 
          quiz={quiz}
          activeId={activeId}
          isOpen={isSidebarOpen}
          dispatch={dispatch}
          onSelectQuestion={scrollToSection}
        />

        <main className={styles.editorScrollArea} ref={scrollAreaRef}>
          <section id="quiz-meta" className={styles.metaSectionCard}>
            <div className={styles.metaHeader}>
              {/* Carré de preview */}
              <div className={styles.previewBox}>
                {quiz.imageUrl ? (
                  <img 
                    key={quiz.imageUrl}
                    src={quiz.imageUrl}
                    alt="Preview" 
                    className={styles.previewImage}
                    onError={(e) => e.currentTarget.style.display = 'none'} 
                  />
                ) : (
                  <ImageIcon size={24} color="var(--text-secondary)" />
                )}
              </div>

              {/* Conteneur du titre et du label */}
              <div className={styles.titleContainer}>
                <label className={styles.label} style={{ fontSize: '0.7rem' }}>
                  PARAMÈTRES GÉNÉRAUX
                </label>
                <input 
                  className={styles.titleInput}
                  placeholder="Titre du Quiz..."
                  value={quiz.title}
                  onChange={(e) => dispatch({ type: 'UPDATE_QUIZ', payload: { title: e.target.value }})}
                />
              </div>
            </div>
            
            <div className={styles.metaGrid}>
              <div className={styles.metaItem}>
                <Hash size={18} color="var(--accent)" />
                <div className={styles.customDropdown} ref={catRef}>
                  <button 
                    type="button"
                    className={`${styles.dropdownTrigger} ${isCatOpen ? styles.active : ''}`}
                    onClick={() => setIsCatOpen(!isCatOpen)}
                  >
                    <span>{currentCategoryLabel}</span>
                    <ChevronDown size={14} className={`${styles.chevron} ${isCatOpen ? styles.rotate : ''}`} />
                  </button>

                  {isCatOpen && (
                    <div className={styles.dropdownMenu}>
                      {categories.map((cat) => (
                        <div 
                          key={cat.id}
                          className={`${styles.dropdownOption} ${quiz.categoryId === cat.id ? styles.selected : ''}`}
                          onClick={() => {
                            dispatch({ type: 'UPDATE_QUIZ', payload: { categoryId: cat.id }});
                            setIsCatOpen(false);
                          }}
                        >
                          {cat.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className={styles.metaItem} style={{ flex: 1 }}>
                <ImageIcon size={18} color="var(--accent)" />
                <input 
                  className={styles.urlInputSimple}
                  placeholder="URL de l'image de couverture..."
                  value={quiz.imageUrl}
                  onChange={(e) => dispatch({ type: 'UPDATE_QUIZ', payload: { imageUrl: e.target.value }})}
                />
              </div>
            </div>
          </section>

          {quiz.questions.map((q, index) => (
            <QuestionCard key={q.tempId} q={q} index={index} activeId={activeId} dispatch={dispatch} />
          ))}
        </main>
      </div>
    </div>
  );
};

export default StudioEngine;