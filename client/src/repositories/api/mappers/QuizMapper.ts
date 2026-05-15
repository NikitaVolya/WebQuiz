import { type Quiz } from '../../../types/quiz/Quiz';
import { type Category } from '../../../types/quiz/Category';

export class QuizMapper {
  static toQuizDomain(raw: any): Quiz {
    return {
      id: raw.id,
      categoryId: raw.category_id,
      creatorId: raw.creator_id,
      title: raw.title,
      questionsCount: raw.questions_count || 0,
      description: raw.description,
      imageUrl: raw.image_url,
      isPublic: raw.is_public === 1 || raw.is_public === true,
      questions: raw.questions ? raw.questions.map((q: any) => this.toQuestionDomain(q)) : []
    };
  }

  static toQuestionDomain(raw: any) {
    return {
      id: raw.id,
      quizId: raw.quiz_id,
      questionText: raw.question_text,
      imageUrl: raw.image_url,
      timerSeconds: raw.timer_seconds || 30,
      pointsValue: raw.points_value || 10,
      answers: raw.answers ? raw.answers.map((a: any) => ({
        id: a.id,
        questionId: a.question_id,
        answerText: a.answer_text,
        isCorrect: a.is_correct === 1 || a.is_correct === true
      })) : []
    };
  }

  static toCategoryDomain(raw: any): Category {
    return {
      id: raw.id,
      name: raw.name,
      description: raw.description,
      imageUrl: raw.image_url,
      colorCode: raw.color_code,
      slug: raw.slug,
      count: raw.count
    };
  }
}