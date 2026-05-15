import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import styles from './SortableQuestionItem.module.css';

interface Props {
  q: any;
  index: number;
  activeId: string;
  onSelect: (id: string) => void;
}

export const SortableQuestionItem = ({ q, index, activeId, onSelect }: Props) => {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition, 
    isDragging 
  } = useSortable({ id: q.tempId });

  const dndStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={dndStyle}
      className={`${styles.questionItem} ${activeId === q.tempId ? styles.questionItemActive : ''}`}
      onClick={() => onSelect(q.tempId)}
    >
      <div className={styles.itemContent}>
        <div className={styles.itemLeft}>
          <span className={styles.indexBadge}>{index + 1}</span>
          <span className={styles.sidebarText}>
            {q.questionText || "Question vide..."}
          </span>
        </div>
        
        <div {...attributes} {...listeners} className={styles.dragHandleSidebar}>
          <GripVertical size={14} />
        </div>
      </div>
    </div>
  );
};