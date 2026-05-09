/**
 * @file AuthModal.tsx
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, ArrowRight, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import styles from "./AuthModal.module.css";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, pass: string) => void;
  onSignUp: (username: string, email: string, pass: string) => void;
  onForgotPassword: (email: string) => void;
  error: string | null;
  isLoading: boolean;
}

type ViewState = 'login' | 'signup' | 'forgot';

export const AuthModal = ({ 
  isOpen, onClose, onLogin, onSignUp, onForgotPassword, error, isLoading 
}: AuthModalProps) => {
  const [view, setView] = useState<ViewState>('login');
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  // Reset quand on ferme
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setView('login'), 300);
    }
  }, [isOpen]);

  const handleForgotClick = () => {
    if (!email) {
      setView('forgot');
    } else {
      setView('forgot');
      onForgotPassword(email);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (view === 'login') onLogin(email, password);
    else if (view === 'signup') onSignUp(username, email, password);
    else if (view === 'forgot') onForgotPassword(email);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.overlay}>
          <motion.div className={styles.backdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          
          <motion.div 
            className={styles.modalCard}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
          >
            {/* TOP NAVIGATION */}
            <div className={styles.topNav}>
                {view === 'forgot' && (
                    <button className={styles.backBtn} onClick={() => setView('login')} disabled={isLoading}>
                        <ArrowLeft size={20} />
                    </button>
                )}
                <button className={styles.closeBtn} onClick={onClose} disabled={isLoading}>
                    <X size={20}/>
                </button>
            </div>
            
            <div className={styles.header}>
              <h2>
                {view === 'login' && "Bon retour !"}
                {view === 'signup' && "Rejoins la Battle"}
                {view === 'forgot' && "Vérification..."}
              </h2>
              <p>
                {view === 'login' && "Connecte-toi pour retrouver ton profil"}
                {view === 'signup' && "Crée un compte pour sauvegarder tes records"}
                {view === 'forgot' && `Un mail de récupération est en cours d'envoi à ${email || "votre adresse"}`}
              </p>
            </div>

            {error && (
              <motion.div className={styles.errorBox} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </motion.div>
            )}

            {/* VUE FORGOT : L'enveloppe animée */}
            {view === 'forgot' ? (
                <div className={styles.forgotLoadingArea}>
                    <motion.div 
                        className={styles.envelopeWrapper}
                        animate={{ 
                            y: [0, -15, 0],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                            duration: 2, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                        }}
                    >
                        <Mail size={60} className={styles.floatingMail} />
                        <motion.div 
                            className={styles.mailShadow}
                            animate={{ scale: [1, 0.8, 1], opacity: [0.3, 0.1, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </motion.div>
                    
                    <p className={styles.loadingText}>Envoi sécurisé...</p>
                    
                    {!email && (
                         <form className={styles.form} onSubmit={handleSubmit} style={{width: '100%'}}>
                            <div className={styles.inputGroup}>
                                <Mail className={styles.icon} size={20} />
                                <input type="email" placeholder="Saisis ton email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <button type="submit" className={styles.submitBtn}>Renvoyer</button>
                         </form>
                    )}
                </div>
            ) : (
                <form className={styles.form} onSubmit={handleSubmit}>
                    {view === 'signup' && (
                        <div className={styles.inputGroup}>
                            <User className={styles.icon} size={20} />
                            <input type="text" placeholder="Pseudo unique" value={username} onChange={(e) => setUsername(e.target.value)} required disabled={isLoading} />
                        </div>
                    )}

                    <div className={styles.inputGroup}>
                        <Mail className={styles.icon} size={20} />
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
                    </div>

                    <div className={styles.inputGroup}>
                        <Lock className={styles.icon} size={20} />
                        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
                    </div>

                    {view === 'login' && (
                        <button type="button" className={styles.forgotLink} onClick={handleForgotClick}>
                            Mot de passe oublié ?
                        </button>
                    )}

                    <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                        {isLoading ? <Loader2 className={styles.spinner} size={20} /> : (
                            <>
                                {view === 'login' ? "Se connecter" : "Créer mon compte"}
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>
            )}

            <div className={styles.footer}>
              <span>{view === 'signup' ? "Déjà inscrit ?" : "Pas encore de compte ?"}</span>
              <button 
                className={styles.switchBtn} 
                onClick={() => setView(view === 'signup' ? 'login' : 'signup')}
                disabled={isLoading}
              >
                {view === 'signup' ? "Se connecter" : "S'inscrire"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};