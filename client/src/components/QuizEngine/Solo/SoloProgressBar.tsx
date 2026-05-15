/**
 * @file SoloProgressBar.tsx
 */
import { motion } from "framer-motion";

export const SoloProgressBar = ({ timer }: { timer: number }) => {
  return (
    <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', flexShrink: 0 }}>
      <motion.div 
        style={{ height: '100%' }}
        animate={{ 
          width: `${timer}%`,
          backgroundColor: timer < 30 ? "#ef4444" : "var(--accent)" 
        }}
        transition={{ duration: 0.1, ease: "linear" }}
      />
    </div>
  );
};