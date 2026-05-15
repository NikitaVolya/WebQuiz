import api from '../../api/axiosInstance';
import { type IStudioRepository } from '../IStudioRepository';
import { StudioMapper } from './mappers/StudioMapper';
import type { QuizDraft, DraftSummary } from '../../types/studio/QuizDraft';

export class ApiStudioRepository implements IStudioRepository {
  
  /**
  * Récupère la liste simplifiée de tous les brouillons appartenant à l'utilisateur authentifié.
  * Route : GET /studio/drafts
  */
  async getAllDrafts(): Promise<DraftSummary[]> {
    const response = await api.get('/studio/drafts');
    console.log(response);
    return response.data.map((item: any) => StudioMapper.toSummary(item));
  }

  /**
  * Récupère l'intégralité des données d'un brouillon (questions incluses) via son identifiant unique.
  * Route : GET /studio/drafts/{id}
  */
  async getDraft(draftId: string): Promise<QuizDraft | null> {
    try {
      const response = await api.get(`/studio/drafts/${draftId}`);
      return StudioMapper.toDomain(response.data);
    } catch (error) {
      return null;
    }
  }

  /**
  * Crée un nouveau brouillon (POST) ou met à jour un existant (PUT/POST).
  * Gère la conversion des données CamelCase vers SnakeCase pour la base de données.
  * Route : POST /studio/drafts ou /studio/drafts/{id}
  */
  async saveDraft(draft: QuizDraft): Promise<boolean> {
    try {
      const isNew = draft.id === 'new';
      const endpoint = isNew ? '/studio/drafts' : `/studio/drafts/${draft.id}`;
      
      const payload = {
        id: draft.id,
        title: draft.title || '',
        description: draft.description || '',
        category_id: draft.categoryId || null,
        image_url: draft.imageUrl || '',
        is_published: draft.isPublished || false,
        is_private: draft.isPrivate || false,
        questions: draft.questions.map(q => ({
          temp_id: q.tempId,
          question_text: q.questionText || '',
          image_url: q.imageUrl || '',
          timer_seconds: q.timerSeconds || 20,
          points_value: q.pointsValue || 100,
          answers: q.answers.map(a => ({
            temp_id: a.tempId,
            answer_text: a.answerText || '',
            is_correct: a.isCorrect === true
          }))
        }))
      };

      console.log("DEBUG PAYLOAD:", JSON.stringify(payload, null, 2));

      const response = await api.post(endpoint, payload);
      return response.status === 200 || response.status === 201;
    } catch (error) {
      console.error("Erreur saveDraft:", error);
      return false;
    }
  }

  /**
  * Supprime définitivement un brouillon et ses questions associées de la base de données.
  * Route : DELETE /studio/drafts/{id}
  */
  async deleteDraft(draftId: string): Promise<boolean> {
    try {
      const response = await api.delete(`/studio/drafts/${draftId}`);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  /**
  * Valide et transforme un brouillon en quiz "Public". Cette action peut déplacer 
  * les données vers des tables de production indexées.
  * Route : POST /studio/drafts/{id}/publish
  */
  async publish(draft: QuizDraft): Promise<{ quizId: number }> {
    const response = await api.post(`/studio/drafts/${draft.id}/publish`, draft);
    return { quizId: response.data.quiz_id };
  }
}

