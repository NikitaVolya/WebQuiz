import type { QuizDraft, DraftSummary } from '../../../types/studio/QuizDraft';

export class StudioMapper {
  /**
   * Transforme un brouillon brut de l'API vers le type Frontend
   */
  static toDomain(raw: any): QuizDraft {
    return {
      id: raw.id.toString(),
      title: raw.title || '',
      description: raw.description || '',
      categoryId: raw.category_id ? Number(raw.category_id) : null,
      imageUrl: raw.image_url || '',
      isPublished: Boolean(raw.is_published),
      isPrivate: Boolean(raw.is_private),
      questionsCount: raw.questions_count || 0,
      questions: raw.questions ? raw.questions.map((q: any) => ({
        ...q,
        tempId: q.temp_id || q.id.toString()
      })) : []
    };
  }

  static toSummary(raw: any): DraftSummary {
    return {
      id: raw.id.toString(),
      title: raw.title || 'Sans titre',
      description: raw.description,
      categoryId: raw.category_id,
      imageUrl: raw.image_url || '',
      questionsCount: raw.questions_count || 0,
      isPublished: Boolean(raw.is_published),
      isPrivate: Boolean(raw.is_private)
    };
  }
}