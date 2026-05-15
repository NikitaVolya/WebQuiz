import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import styles from './StudioFilters.module.css';

interface StudioFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
}

const StudioFilters: React.FC<StudioFiltersProps> = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [
    { value: 'all', label: 'Tous les quiz' },
    { value: 'draft', label: 'Brouillons' },
    { value: 'public', label: 'Publiés (Public)' },
    { value: 'private', label: 'Publiés (Privé)' },
  ];

  const currentLabel = options.find(o => o.value === statusFilter)?.label;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.filtersBar}>
      <div className={styles.searchBox}>
        <Search size={18} className={styles.searchIcon} />
        <input 
          type="text" 
          placeholder="Rechercher dans vos projets..." 
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className={styles.dropdownContainer} ref={dropdownRef}>
        <button 
          className={`${styles.dropdownTrigger} ${isOpen ? styles.active : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Filter size={16} className={styles.filterIcon} />
          <span>{currentLabel}</span>
          <ChevronDown size={16} className={`${styles.chevron} ${isOpen ? styles.rotate : ''}`} />
        </button>

        {isOpen && (
          <div className={styles.dropdownMenu}>
            {options.map((option) => (
              <div 
                key={option.value}
                className={`${styles.dropdownOption} ${statusFilter === option.value ? styles.selected : ''}`}
                onClick={() => {
                  onStatusChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudioFilters;