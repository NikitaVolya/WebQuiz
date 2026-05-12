/**
 * @file services/quizService.ts
 */
import type { Quiz, Category } from "../types/quiz";
import { ApiQuizRepository } from '../repositories/api/ApiQuizRepository';
const quizRepo = new ApiQuizRepository();

export const quizService = {
  /**
   * Récupère tout le catalogue
   */
  getDiscoveryFeed: async (): Promise<Quiz[]> => {
    return quizRepo.findAll();
  },

  /**
   * Récupère un quiz spécifique avec gestion d'erreur métier
   */
  getQuizDetails: async (id: number): Promise<Quiz> => {
    if (!id) throw new Error("ID du quiz requis");
    
    const quiz = await quizRepo.findById(id);
    if (!quiz) throw new Error("Ce quiz n'existe plus ou est privé.");
    
    return quiz;
  },

  /**
   * Logique de filtrage multi-critères
   */
  searchQuizzes: async (categoryId?: number, query?: string): Promise<Quiz[]> => {
    if (categoryId) {
      return quizRepo.findByCategory(categoryId);
    }
    if (query) {
      return quizRepo.search(query);
    }
    return quizRepo.findAll();
  },

  /**
   * Gestion des catégories
   */
  getCategories: async (): Promise<Category[]> => {
    return quizRepo.findAllCategories();
  },

  /**
   * Récupère les infos d'une catégorie spécifique
   */
  getCategoryInfo: async (id: number): Promise<Category | null> => {
    return quizRepo.getCategoryById(id);
  }
};