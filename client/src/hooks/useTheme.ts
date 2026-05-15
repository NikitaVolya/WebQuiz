/**
 * @file useTheme.ts
 * @description Hook pour gérer le thème Light/Dark avec détection système et persistance.
 */

import { useEffect, useState } from 'react';

/**
 * Gère le basculement entre le mode clair et sombre.
 * @returns {Object} Le thème actuel et la fonction pour le changer.
 */
export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
};