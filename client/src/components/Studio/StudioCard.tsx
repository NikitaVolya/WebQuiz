import React from 'react';
import { FolderOpen, Trash2, Globe, Lock, Send } from 'lucide-react';
import styles from './StudioCard.module.css';

interface StudioCardProps {
  id: string;
  title: string;
  imageUrl: string;
  questionsCount: number | undefined;
  isPublished: boolean;
  isPrivate?: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onPublish?: (id: string) => void;
}

const StudioCard: React.FC<StudioCardProps> = ({
  id,
  title,
  imageUrl,
  questionsCount,
  isPublished,
  isPrivate,
  onSelect,
  onDelete,
  onPublish
}) => {
  return (
    <div className={styles.card} onClick={() => onSelect(id)}>
      <div className={styles.actionsOverlay}>
        {!isPublished && (
          <button 
            className={styles.publishBtn} 
            onClick={(e) => { e.stopPropagation(); onPublish?.(id); }}
            title="Publier"
          >
            <Send size={18} />
          </button>
        )}
        <button 
          className={styles.deleteBtn} 
          onClick={(e) => { e.stopPropagation(); onDelete(id); }}
          title="Supprimer"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Rendu conditionnel Image ou Icône */}
      <div className={styles.imageBox}>
        {imageUrl ? (
          <img
            key={imageUrl}
            src={imageUrl}
            alt={title}
            className={styles.previewImg}
          />
        ) : (
          <div className={styles.iconPlaceholder}>
            <FolderOpen size={28} />
          </div>
        )}
      </div>

      <div className={styles.info}>
        <div className={styles.titleRow}>
          <h3>{title || "Quiz sans titre"}</h3>
          {isPublished && (
            <div className={isPrivate ? styles.lockIcon : styles.globeIcon}>
              {isPrivate ? <Lock size={14} /> : <Globe size={14} />}
            </div>
          )}
        </div>
        <p>
          {questionsCount} question{questionsCount ?? 0 > 1 ? 's' : ''} • 
          <span className={isPublished ? styles.statusPub : styles.statusDraft}>
            {isPublished ? ' Publié' : ' Brouillon'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default StudioCard;