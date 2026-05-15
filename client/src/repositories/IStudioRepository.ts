/**
 * @file repositories/IStudioRepository.ts
 */
import type { QuizDraft, DraftSummary } from '../types/studio/QuizDraft';

export interface IStudioRepository {
  /**
   * Récupère tous les brouillons de l'utilisateur connecté
   */
  getAllDrafts(): Promise<DraftSummary[]>;

  /**
   * Récupère un brouillon spécifique par son ID
   */
  getDraft(draftId: string): Promise<QuizDraft | null>;

  /**
   * Sauvegarde ou met à jour le brouillon
   */
  saveDraft(draft: QuizDraft): Promise<boolean>;

  /**
   * Supprime définitivement un brouillon
   */
  deleteDraft(draftId: string): Promise<boolean>;

  /**
   * Publication : déverse le JSON dans les tables structurées
   */
  publish(draft: QuizDraft): Promise<{ quizId: number }>;
}