import { useEffect, useRef, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { modalBackdrop, modalContent } from '@/lib/animation-variants';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;
    const previouslyFocused = document.activeElement as HTMLElement;
    modalRef.current.focus();
    return () => {
      previouslyFocused?.focus?.();
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-white/60 dark:bg-black/50 backdrop-blur-sm"
            variants={modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={modalRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            variants={modalContent}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 w-full max-w-md max-h-[90vh] overflow-y-auto bg-surface rounded-2xl border border-border shadow-xl"
          >
            {title && (
              <div className="flex items-center justify-between p-6 pb-0">
                <h2 className="text-h4 font-serif text-text-primary">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-grey-100 dark:hover:bg-grey-800 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-text-secondary" aria-label="Close" />
                </button>
              </div>
            )}
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
