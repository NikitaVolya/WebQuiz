/**
 * @file views/Studio/studioReducer.ts
 */
import type { QuizDraft, QuestionDraft, AnswerDraft } from '../types/studio/QuizDraft';

export type StudioAction =
  | { type: 'LOAD_QUIZ'; payload: QuizDraft }
  | { type: 'RESET_QUIZ'; payload: Partial<QuizDraft> }
  | { type: 'SET_ID'; id: string }
  | { type: 'UPDATE_QUIZ'; payload: Partial<QuizDraft> }
  | { type: 'ADD_QUESTION' }
  | { type: 'DUPLICATE_QUESTION'; questionId: string }
  | { type: 'REMOVE_QUESTION'; questionId: string }
  | { type: 'REORDER_QUESTIONS'; payload: QuestionDraft[] }
  | { type: 'UPDATE_QUESTION'; questionId: string; payload: Partial<QuestionDraft> }
  | { type: 'ADD_ANSWER'; questionId: string }
  | { type: 'REMOVE_ANSWER'; questionId: string; answerId: string }
  | { type: 'UPDATE_ANSWER'; questionId: string; answerId: string; payload: Partial<AnswerDraft> }
  | { type: 'SET_CORRECT_ANSWER'; questionId: string; answerId: string };

export const createDefaultQuestion = (): QuestionDraft => ({
  tempId: crypto.randomUUID(),
  questionText: '',
  imageUrl: '',
  timerSeconds: 20,
  pointsValue: 100,
  answers: [
    { tempId: crypto.randomUUID(), answerText: '', isCorrect: true },
    { tempId: crypto.randomUUID(), answerText: '', isCorrect: false },
  ],
});

export function studioReducer(state: QuizDraft, action: StudioAction): QuizDraft {
  switch (action.type) {
    case 'LOAD_QUIZ':
      return { ...action.payload };

    case 'RESET_QUIZ':
      return {
        id: crypto.randomUUID(), 
        title: '',
        description: '',
        categoryId: null,
        imageUrl: '',
        isPublished: false,
        isPrivate: false,
        questionsCount: 1,
        questions: action.payload?.questions || [createDefaultQuestion()],
      };

    case 'SET_ID':
      return { ...state, id: action.id };

    case 'UPDATE_QUIZ':
      return { ...state, ...action.payload };

    case 'ADD_QUESTION':
      return { ...state, questions: [...state.questions, createDefaultQuestion()] };

    case 'DUPLICATE_QUESTION': {
      const questionToCopy = state.questions.find(q => q.tempId === action.questionId);
      if (!questionToCopy) return state;

      const duplicatedQuestion: QuestionDraft = {
        ...questionToCopy,
        tempId: crypto.randomUUID(),
        answers: questionToCopy.answers.map(a => ({
          ...a,
          tempId: crypto.randomUUID()
        }))
      };

      const index = state.questions.findIndex(q => q.tempId === action.questionId);
      const newQuestions = [...state.questions];
      newQuestions.splice(index + 1, 0, duplicatedQuestion);

      return { ...state, questions: newQuestions };
    }

    case 'REMOVE_QUESTION':
      if (state.questions.length <= 1) return state;
      return {
        ...state,
        questions: state.questions.filter((q) => q.tempId !== action.questionId),
      };

    case 'REORDER_QUESTIONS':
      return { ...state, questions: action.payload };

    case 'UPDATE_QUESTION':
      return {
        ...state,
        questions: state.questions.map((q) =>
          q.tempId === action.questionId ? { ...q, ...action.payload } : q
        ),
      };

    case 'ADD_ANSWER':
      return {
        ...state,
        questions: state.questions.map((q) => {
          if (q.tempId !== action.questionId || q.answers.length >= 4) return q;
          return {
            ...q,
            answers: [...q.answers, { tempId: crypto.randomUUID(), answerText: '', isCorrect: false }],
          };
        }),
      };

    case 'REMOVE_ANSWER':
      return {
        ...state,
        questions: state.questions.map((q) => {
          if (q.tempId !== action.questionId || q.answers.length <= 2) return q;
          
          const newAnswers = q.answers.filter((a) => a.tempId !== action.answerId);
          
          if (!newAnswers.some(a => a.isCorrect)) {
            newAnswers[0] = { ...newAnswers[0], isCorrect: true };
          }

          return { ...q, answers: newAnswers };
        }),
      };

    case 'UPDATE_ANSWER':
      return {
        ...state,
        questions: state.questions.map((q) => {
          if (q.tempId !== action.questionId) return q;
          return {
            ...q,
            answers: q.answers.map((a) =>
              a.tempId === action.answerId ? { ...a, ...action.payload } : a
            ),
          };
        }),
      };

    case 'SET_CORRECT_ANSWER':
      return {
        ...state,
        questions: state.questions.map((q) => {
          if (q.tempId !== action.questionId) return q;
          return {
            ...q,
            answers: q.answers.map((a) => ({
              ...a,
              isCorrect: a.tempId === action.answerId,
            })),
          };
        }),
      };

    default:
      return state;
  }
}