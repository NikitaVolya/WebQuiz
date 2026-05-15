/**
 * @file repositories/IQuizRepository.ts
 */
import type { Quiz, Category } from '../types/quiz';

export interface IQuizRepository {
  /** Récupère tous les quiz */
  findAll(): Promise<Quiz[]>;
  
  /** Récupère un quiz par son ID unique */
  findById(id: number): Promise<Quiz | null>;
  
  /** Filtre les quiz par catégorie */
  findByCategory(categoryId: number): Promise<Quiz[]>;
  
  /** Recherche textuelle dans les titres ou descriptions */
  search(query: string): Promise<Quiz[]>;

  /** Récupère toutes les catégories disponibles */
  findAllCategories(): Promise<Category[]>;

  /** Récupère les détails d'une catégorie */
  getCategoryById(id: number): Promise<Category | null>;
}