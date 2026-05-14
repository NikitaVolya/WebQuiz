/**
 * @file services/studioService.ts
 */
import type { QuizDraft } from '../types/studio/QuizDraft';
import type { DraftSummary } from '../repositories/IStudioRepository';
import { JsonStudioRepository as studioRepo } from '../repositories/json/JsonStudioRepository';

// --- CACHE PRIVÉ ---
let draftsCache: DraftSummary[] | null = null;

export const studioService = {
  /**
   * Liste tous les brouillons avec gestion du cache mémoire
   */
  getDraftList: async (forceRefresh = false): Promise<DraftSummary[]> => {
    if (draftsCache && !forceRefresh) {
      return draftsCache;
    }

    const data = await studioRepo.getAllDrafts();
    draftsCache = data;
    return data;
  },

  /**
   * Charge un brouillon pour l'éditeur
   */
  loadDraft: async (id: string): Promise<QuizDraft> => {
    const draft = await studioRepo.getDraft(id);
    if (!draft) throw new Error("Brouillon introuvable.");
    return draft;
  },

  /**
   * Sauvegarde et invalide le cache seulement si le repo confirme le succès
   */
  save: async (quiz: QuizDraft): Promise<boolean> => {
    const success = await studioRepo.saveDraft(quiz);
    if (success) {
      draftsCache = null;
    }
    return success;
  },

  /**
   * Supprime et met à jour le cache localement si le repo confirme la suppression
   */
  delete: async (id: string): Promise<boolean> => {
    const success = await studioRepo.deleteDraft(id);
    
    if (success && draftsCache) {
      draftsCache = draftsCache.filter(d => d.id !== id);
    }
    
    return success;
  },

  /**
   * Publie le quiz et nettoie le cache
   */
  publish: async (quiz: QuizDraft): Promise<{ quizId: number }> => {
    if (!quiz.title.trim()) throw new Error("Le titre est obligatoire pour publier.");
    if (quiz.questions.length === 0) throw new Error("Un quiz sans questions ne peut pas être publié.");
    
    const result = await studioRepo.publish(quiz);
    
    draftsCache = null; 
    return result;
  },

  /**
   * Vide manuellement le cache
   */
  clearCache: (): void => {
    draftsCache = null;
  }
};