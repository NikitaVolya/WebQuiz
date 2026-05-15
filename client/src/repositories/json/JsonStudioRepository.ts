/**
 * @file repositories/json/JsonStudioRepository.ts
 * Implémentation locale (localStorage) du contrat Studio.
 */
import { db } from '../../infra/localStorageDB';
import type { IStudioRepository, DraftSummary } from '../IStudioRepository';
import type { QuizDraft } from '../../types/studio/QuizDraft';

const DRAFTS_KEY = 'quiz_drafts';
const PUBLISHED_KEY = 'quizzes';

export const JsonStudioRepository: IStudioRepository = {
  
  async getAllDrafts(): Promise<DraftSummary[]> {
    await new Promise(res => setTimeout(res, 600));
    
    const drafts = db.get<QuizDraft>(DRAFTS_KEY);
    
    return drafts.map(d => ({
      id: d.id!,
      title: d.title || 'Quiz sans titre',
      imageUrl: d.imageUrl,
      updatedAt: new Date(),
      questionsCount: d.questions.length
    }));
  },

  async getDraft(draftId: string): Promise<QuizDraft | null> {
    await new Promise(res => setTimeout(res, 400));
    
    const drafts = db.get<QuizDraft>(DRAFTS_KEY);
    return drafts.find(d => d.id === draftId) || null;
  },

  async saveDraft(draft: QuizDraft): Promise<boolean> {
    await new Promise(res => setTimeout(res, 800));
    
    try {
      const drafts = db.get<QuizDraft>(DRAFTS_KEY);
      
      if (draft.id) {
        const index = drafts.findIndex(d => d.id === draft.id);
        if (index !== -1) {
          drafts[index] = { ...draft };
        } else {
          return false;
        }
      } else {
        const newDraft = { 
          ...draft, 
          id: crypto.randomUUID() 
        };
        drafts.push(newDraft);
        draft.id = newDraft.id;
      }

      db.save(DRAFTS_KEY, drafts);
      return true;
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du brouillon:", error);
      return false;
    }
  },

  async deleteDraft(draftId: string): Promise<boolean> {
    await new Promise(res => setTimeout(res, 300));

    try {
      const drafts = db.get<QuizDraft>(DRAFTS_KEY);
      const initialLength = drafts.length;
      
      const filtered = drafts.filter(d => d.id !== draftId);
      
      if (filtered.length === initialLength) return false;

      db.save(DRAFTS_KEY, filtered);
      return true;
    } catch (error) {
      return false;
    }
  },

  async publish(draft: QuizDraft): Promise<{ quizId: number }> {
    await new Promise(res => setTimeout(res, 1500));
    
    const publishedQuizzes = db.get<any>(PUBLISHED_KEY);
    const newId = Math.floor(Math.random() * 10000);
    
    publishedQuizzes.push({
      ...draft,
      id: newId,
      publishedAt: new Date().toISOString()
    });
    db.save(PUBLISHED_KEY, publishedQuizzes);

    if (draft.id) {
      await this.deleteDraft(draft.id);
    }

    return { quizId: newId };
  }
};