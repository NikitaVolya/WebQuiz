import React from 'react';
import { Settings2, Plus } from 'lucide-react';
import { DndContext, closestCenter, type DragEndEvent, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove } from '@dnd-kit/sortable';

import { SortableQuestionItem } from './SortableQuestionItem';
import { type StudioAction } from '../../views/Studio/studioReducer';
import type { QuizDraft } from '../../types/studio/QuizDraft';
import styles from './StudioSidebar.module.css';

interface Props {
  quiz: QuizDraft;
  activeId: string;
  isOpen: boolean;
  dispatch: React.Dispatch<StudioAction>;
  onSelectQuestion: (id: string) => void;
}

export const StudioSidebar = ({ quiz, activeId, isOpen, dispatch, onSelectQuestion }: Props) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = quiz.questions.findIndex((q) => q.tempId === active.id);
      const newIndex = quiz.questions.findIndex((q) => q.tempId === over.id);
      dispatch({
        type: 'REORDER_QUESTIONS', 
        payload: arrayMove(quiz.questions, oldIndex, newIndex) 
      });
      onSelectQuestion(quiz.questions[newIndex].tempId);
    }
  };

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
      <div className={styles.sidebarHeader}>
        <p className={styles.sidebarTitle}>PLAN DU QUIZ</p>
      </div>

      <div className={styles.questionList}>
        <div 
          className={`${styles.sidebarInfoBtn} ${activeId === 'meta' ? styles.active : ''}`}
          onClick={() => onSelectQuestion('meta')}
        >
          <Settings2 size={16} color="var(--accent)" />
          <span className={styles.sidebarText}>Configuration</span>
        </div>

        <div className={styles.dividerH} />

        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext items={quiz.questions.map(q => q.tempId)} strategy={verticalListSortingStrategy}>
            {quiz.questions.map((q, index) => (
              <SortableQuestionItem 
                key={q.tempId} 
                q={q} 
                index={index} 
                activeId={activeId} 
                onSelect={onSelectQuestion} 
              />
            ))}
          </SortableContext>
        </DndContext>

        <button 
          className={styles.addBtnSidebar} 
          onClick={() => dispatch({ type: 'ADD_QUESTION' })}
        >
          <Plus size={18} /> 
          <span>Nouvelle Question</span>
        </button>
      </div>
    </aside>
  );
};