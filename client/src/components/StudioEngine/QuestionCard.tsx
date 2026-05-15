import React from 'react';
import { Trash2, ImageIcon, Check, Plus } from 'lucide-react';
import styles from './QuestionCard.module.css';
import { type StudioAction } from '../../hooks/studioReducer';

interface Props {
  q: any;
  index: number;
  activeId: string;
  dispatch: React.Dispatch<StudioAction>;
}

export const QuestionCard = ({ q, index, activeId, dispatch }: Props) => {
  return (
    <div 
      id={`question-${q.tempId}`} 
      className={`${styles.formCard} ${activeId === q.tempId ? styles.formCardActive : ''} studio-question-card`}
    >
      <div className={styles.questionHeader}>
        <div className={styles.questionBadge}>QUESTION {index + 1}</div>
        <button 
          className={styles.deleteAnswerBtn}
          onClick={() => dispatch({ type: 'REMOVE_QUESTION', questionId: q.tempId })}
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className={styles.questionMainRow}>
        <div className={styles.mediaSection}>
          <div className={styles.imagePreview}>
            {q.imageUrl ? <img src={q.imageUrl} alt="Preview" /> : <ImageIcon size={24} opacity={0.3} />}
          </div>
          <input 
            className={styles.urlInput}
            placeholder="Lien de l'image..."
            value={q.imageUrl || ''}
            onChange={(e) => dispatch({ type: 'UPDATE_QUESTION', questionId: q.tempId, payload: { imageUrl: e.target.value } })}
          />
        </div>

        <div className={styles.textSection}>
          <label className={styles.label} style={{ fontSize: '0.7rem' }}>INTITULÉ</label>
          <textarea 
            className={styles.questionTitleInput}
            placeholder="Écrivez votre question ici..."
            value={q.questionText}
            onChange={(e) => dispatch({ type: 'UPDATE_QUESTION', questionId: q.tempId, payload: { questionText: e.target.value } })}
          />
        </div>
      </div>

      <div className={styles.answersGrid}>
        {q.answers.map((ans: any, idx: number) => (
          <div key={ans.tempId} className={styles.answerCard}>
            <div 
              className={`${styles.correctToggle} ${ans.isCorrect ? styles.correctToggleActive : ''}`}
              onClick={() => dispatch({ type: 'SET_CORRECT_ANSWER', questionId: q.tempId, answerId: ans.tempId })}
            >
              {ans.isCorrect && <Check size={14} color="white" strokeWidth={4} />}
            </div>
            <input 
              className={styles.input}
              style={{ border: 'none', background: 'transparent', padding: 0 }}
              value={ans.answerText}
              placeholder={`Réponse ${idx + 1}`}
              onChange={(e) => dispatch({ type: 'UPDATE_ANSWER', questionId: q.tempId, answerId: ans.tempId, payload: { answerText: e.target.value } })}
            />
            {q.answers.length > 2 && (
              <button 
                onClick={() => dispatch({ type: 'REMOVE_ANSWER', questionId: q.tempId, answerId: ans.tempId })} 
                className={styles.deleteAnswerBtn}
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        ))}
        {q.answers.length < 4 && (
          <div className={styles.addAnswerSlot} onClick={() => dispatch({ type: 'ADD_ANSWER', questionId: q.tempId })}>
            <Plus size={18} />
          </div>
        )}
      </div>
    </div>
  );
};