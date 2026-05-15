/**
 * @file hooks/useStudio.ts
 */
import { useState, useCallback } from "react";
import { studioService } from "../services/studioService";
import type { QuizDraft } from "../types/studio/QuizDraft";

export const useStudio = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Récupère la liste résumée des brouillons
   */
  const fetchDrafts = useCallback(async () => {
    setIsPending(true);
    setError(null);
    try {
      return await studioService.getDraftList();
    } catch (err: any) {
      setError(err.message || "Erreur lors de la récupération des brouillons.");
      return [];
    } finally {
      setIsPending(false);
    }
  }, []);

  /**
   * Charge un brouillon complet pour l'éditeur
   */
  const loadDraft = async (id: string) => {
    setIsPending(true);
    setError(null);
    try {
      return await studioService.loadDraft(id);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  /**
   * Sauvegarde l'état actuel du quiz (brouillon)
   */
  const saveDraft = async (quiz: QuizDraft) => {
    setIsPending(true);
    setError(null);
    try {
        return await studioService.save(quiz); 
    } catch (err: any) {
        setError(err.message);
        throw err;
    } finally {
        setIsPending(false);
    }
  };

  /**
   * Supprime un brouillon définitivement
   */
  const deleteDraft = async (id: string) => {
    setIsPending(true);
    setError(null);
    try {
      await studioService.delete(id);
      return true;
    } catch (err: any) {
      setError(err.message || "Erreur lors de la suppression.");
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  /**
   * Publie le quiz final
   */
  const publishQuiz = async (quiz: QuizDraft) => {
    setIsPending(true);
    setError(null);
    try {
      return await studioService.publish(quiz);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return {
    fetchDrafts,
    loadDraft,
    saveDraft,
    deleteDraft,
    publishQuiz,
    isPending,
    error,
    setError
  };
};