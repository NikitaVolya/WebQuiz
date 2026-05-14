import React, { useReducer, useState, useEffect } from 'react';
import { studioReducer, createDefaultQuestion } from './studioReducer';
import StudioEngine from '../../components/StudioEngine/StudioEngine';
import { useStudio } from '../../hooks/useStudio';
import ConfirmDialog from '../../components/ConfirmDialog'
import StudioCard from '../../components/Studio/StudioCard'
import StudioFilters from '../../components/Studio/StudioFilters';
import { Plus, Loader2, AlertCircle, ArrowLeft, X } from 'lucide-react';
import styles from './StudioView.module.css';
import type { QuizDraft } from '../../types/studio/QuizDraft';

const StudioView: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { saveDraft, publishQuiz, loadDraft, fetchDrafts, deleteDraft, isPending, error, setError } = useStudio();
  const [isEditing, setIsEditing] = useState(false);
  const [draftList, setDraftList] = useState<any[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredList = draftList.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'draft') return matchesSearch && !item.isPublished;
    if (statusFilter === 'public') return matchesSearch && item.isPublished && !item.isPrivate;
    if (statusFilter === 'private') return matchesSearch && item.isPublished && item.isPrivate;
    
    return matchesSearch;
  });

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const [quiz, dispatch] = useReducer(studioReducer, {
    id: 'new',
    title: '',
    description: '',
    categoryId: null,
    imageUrl: '',
    isPublished: false,
    isPrivate: false,
    questionsCount: 1,
    questions: [createDefaultQuestion()],
  });

  useEffect(() => {
    if (!isEditing) {
      fetchDrafts().then(setDraftList);
    }
  }, [isEditing, fetchDrafts]);

  const handleCreateNew = () => {
    dispatch({ type: 'RESET_QUIZ', payload: { questions: [createDefaultQuestion()] } });
    setIsEditing(true);
  };

  const handleSelectDraft = async (id: string) => {
    try {
      const data = await loadDraft(id);
      dispatch({ type: 'LOAD_QUIZ', payload: data });
      setIsEditing(true);
    } catch (err) {
      console.error("Erreur chargement");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    
    try {
      await deleteDraft(deleteTarget); 
      setDraftList(prev => prev.filter(d => d.id === deleteTarget ? false : true));
      setDeleteTarget(null);
    } catch (err) {
      setError("Impossible de supprimer le brouillon.");
    }
  };

  const handleSave = async (isPublishing: boolean = false) => {
    try {
      if (isPublishing) {
        await publishQuiz(quiz);
        onExit();
      } else {
        await saveDraft(quiz); 
      
        const updatedList = await fetchDrafts();
        setDraftList(updatedList);

        console.log("Brouillon sauvegardé avec succès");
      }
    } catch (err) {
      console.error("Erreur lors de la sauvegarde", err);
      setError("Erreur de synchronisation avec le serveur.");
    }
  };

  useEffect(() => {
    if (!isEditing) {
      fetchDrafts().then((data) => {
        setDraftList(data);
      });
    }
  }, [isEditing, fetchDrafts]);

  if (!isEditing) {
    return (
      <>
        <div className={styles.dashboardWrapper}>
          <main className={styles.dashboardMain}>
            
            <header className={styles.dashboardHeader}>
              <button className={styles.backButton} onClick={onExit} title="Retour au menu">
                <ArrowLeft size={24} />
              </button>
              <h1>Studio</h1>
            </header>

            <section className={styles.welcomeSection}>
              <h2>Content de vous revoir !</h2>
              <p>
                {draftList.length > 0 
                  ? `Vous avez ${draftList.length} projet${draftList.length > 1 ? 's' : ''} en cours de rédaction.`
                  : "C'est ici que commence l'aventure. Créez votre premier quiz !"}
              </p>
            </section>

            <div className={styles.contentScroll}>
              <StudioFilters 
                search={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
              />

              <div className={styles.draftGrid}>
                
                {/* Le Placeholder */}
                <div className={styles.addDraftPlaceholder} onClick={handleCreateNew}>
                  <div className={styles.plusCircle}>
                    <Plus size={32} />
                  </div>
                  <span className={styles.addLabel}>Créer un nouveau quiz</span>
                </div>

                {/* Cartes des brouillons existants */}
                {filteredList.map((item: QuizDraft) => (
                  <StudioCard 
                    key={item.id}
                    id={item.id ?? item.id}
                    title={item.title}
                    imageUrl={item.imageUrl}
                    questionsCount={item.questionsCount}
                    isPublished={item.isPublished || false}
                    isPrivate={item.isPrivate || false}
                    onSelect={handleSelectDraft}
                    onDelete={(id) => setDeleteTarget(id)}
                    onPublish={(id) => console.log("Publier", id)}
                  />
                ))}

              </div>
            </div>
          </main>
        </div>

        <ConfirmDialog 
          isOpen={!!deleteTarget}
          title="Supprimer le brouillon ?"
          message="Cette action est irréversible. Toutes les questions de ce quiz seront perdues."
          confirmLabel="Supprimer définitivement"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      </>
    );
  }

  return (
    <div className={styles.container}>
      {isPending && (
        <div className={styles.saveLoader}>
          <Loader2 size={16} className={styles.spinner} /> <span>Synchro...</span>
        </div>
      )}

      {error && (
        <div className={styles.errorToast}>
          <div className={styles.errorIcon}>
            <AlertCircle size={20} />
          </div>
          <span className={styles.errorMessage}>{error}</span>
          <button 
            className={styles.closeError} 
            onClick={() => setError(null)}
            aria-label="Fermer l'alerte"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <StudioEngine 
        quiz={quiz} 
        dispatch={dispatch} 
        onSave={handleSave} 
        onExit={() => setIsEditing(false)} 
      />
    </div>
  );
};

export default StudioView;