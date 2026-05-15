/**
 * @file repositories/api/ApiQuizRepository.ts
 * Implémentation pour les Quiz avec Mapping de données
 */
import api from '../../api/axiosInstance';
import type { IQuizRepository } from '../IQuizRepository';
import type { Quiz, Category } from '../../types/quiz';
import { QuizMapper } from './mappers/QuizMapper';

export class ApiQuizRepository implements IQuizRepository {
  
  /** 
   * Récupère tous les quiz
   * Transforme le snake_case PHP en camelCase TS
   */
  async findAll(): Promise<Quiz[]> {
    const response = await api.get('/quizzes');
    // On map chaque quiz de la liste
    return response.data.map((item: any) => QuizMapper.toQuizDomain(item));
  }

  /** 
   * Récupère un quiz complet par son ID (incluant questions et réponses)
   */
  async findById(id: number): Promise<Quiz | null> {
    try {
      const response = await api.get(`/quizzes/${id}`);
      // Le mapper va gérer récursivement les questions et les réponses
      return QuizMapper.toQuizDomain(response.data);
    } catch (error) {
      console.error(`Erreur lors de la récupération du quiz ${id}:`, error);
      return null;
    }
  }

  /**
   * Filtre par catégorie
   */
  async findByCategory(categoryId: number): Promise<Quiz[]> {
    const response = await api.get('/quizzes', {
      params: { category_id: categoryId }
    });
    return response.data.map((item: any) => QuizMapper.toQuizDomain(item));
  }

  /**
   * Recherche textuelle
   */
  async search(query: string): Promise<Quiz[]> {
    const response = await api.get('/quizzes/search', {
      params: { q: query }
    });
    return response.data.map((item: any) => QuizMapper.toQuizDomain(item));
  }

  /**
   * Récupère toutes les catégories
   */
  async findAllCategories(): Promise<Category[]> {
    try {
      const response = await api.get('/categories');
      return response.data.map((item: any) => QuizMapper.toCategoryDomain(item));
    } catch (error) {
      console.error("Erreur catégories:", error);
      return [];
    }
  }

  /**
   * Récupère les détails d'une catégorie par son ID
   */
  async getCategoryById(id: number): Promise<Category | null> {
    try {
      const response = await api.get(`/categories/${id}`);
      return QuizMapper.toCategoryDomain(response.data);
    } catch {
      return null;
    }
  }
}