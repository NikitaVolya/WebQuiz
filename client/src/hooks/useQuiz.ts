/**
 * @file hooks/useQuiz.ts
 * Gère l'état des données Quiz pour l'interface React.
 */
import { useState, useCallback } from 'react';
import { quizService } from '../services/quizService';
import type { Quiz, Category } from '../types/quiz';

export const useQuiz = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Charge les catégories
   */
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const catData = await quizService.getCategories();
      setCategories(catData);
      return catData;
    } catch (err: any) {
      setError(err.message || "Erreur lors de la récupération des catégories");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Charge le flux de découverte
   */
  const loadDiscoveryData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [quizData, catData] = await Promise.all([
        quizService.getDiscoveryFeed(),
        quizService.getCategories()
      ]);
      setQuizzes(quizData);
      setCategories(catData);
    } catch (err: any) {
      setError(err.message || "Erreur de chargement du catalogue");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Recherche ou filtre les quiz
   */
  const filterQuizzes = async (categoryId?: number, query?: string) => {
    setLoading(true);
    try {
      const filtered = await quizService.searchQuizzes(categoryId, query);
      setQuizzes(filtered);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Récupère un quiz spécifique par son ID (pour le SoloView)
   */
  const getFullQuiz = async (id: number): Promise<Quiz | null> => {
    setLoading(true);
    try {
      return await quizService.getQuizDetails(id);
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { 
    quizzes, 
    categories, 
    loading, 
    error,
    fetchCategories,
    loadDiscoveryData, 
    filterQuizzes,
    getFullQuiz 
  };
};