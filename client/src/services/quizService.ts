/**
 * @file services/quizService.ts
 */
import type { Quiz, Category } from "../types/quiz";
import { JsonQuizRepository as quizRepo } from '../repositories/json/JsonQuizRepository';
// import { ApiQuizRepository } from '../repositories/api/ApiQuizRepository';
// const quizRepo = new ApiQuizRepository();

let discoveryCache: Quiz[] | null = null;
let categoriesCache: Category[] | null = null;
let lastDiscoveryFetch: number = 0;

const CACHE_TTL = 1000 * 60 * 10;

export const quizService = {
  /**
   * Récupère tout le catalogue avec cache (10 min)
   */
  getDiscoveryFeed: async (forceRefresh = false): Promise<Quiz[]> => {
    const now = Date.now();
    if (!forceRefresh && discoveryCache && (now - lastDiscoveryFetch < CACHE_TTL)) {
      return discoveryCache;
    }

    const data = await quizRepo.findAll();
    discoveryCache = data;
    lastDiscoveryFetch = now;
    return data;
  },

  /**
   * Récupère un quiz spécifique
   */
  getQuizDetails: async (id: number): Promise<Quiz> => {
    if (!id) throw new Error("ID du quiz requis");
    
    const quiz = await quizRepo.findById(id);
    if (!quiz) throw new Error("Ce quiz n'existe plus ou est privé.");
    
    return quiz;
  },

  /**
   * Logique de filtrage
   */
  searchQuizzes: async (categoryId?: number, query?: string): Promise<Quiz[]> => {
    if (categoryId) {
      return quizRepo.findByCategory(categoryId);
    }
    if (query) {
      return quizRepo.search(query);
    }
    return quizService.getDiscoveryFeed();
  },

  /**
   * Gestion des catégories avec cache persistant
   */
  getCategories: async (): Promise<Category[]> => {
    if (categoriesCache) return categoriesCache;

    const categories = await quizRepo.findAllCategories();
    categoriesCache = categories;
    return categories;
  },

  /**
   * Récupère les infos d'une catégorie spécifique
   */
  getCategoryInfo: async (id: number): Promise<Category | null> => {
    if (categoriesCache) {
      return categoriesCache.find(c => c.id === id) || null;
    }
    return quizRepo.getCategoryById(id);
  },

  /**
   * Invalidation manuel
   */
  invalidateCache: () => {
    discoveryCache = null;
    categoriesCache = null;
    lastDiscoveryFetch = 0;
  }
};