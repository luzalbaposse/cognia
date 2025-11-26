'use client'

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Sparkles, Heart, TrendingDown, X } from 'lucide-react';

interface ActivityFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ActivityFeedbackModal({ isOpen, onClose }: ActivityFeedbackModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#0077FF] p-6 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="bg-white/20 p-3 rounded-full"
                  >
                    <Sparkles className="size-6 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-white font-semibold text-lg">¡Actividad Iniciada!</h2>
                    <p className="text-white/80 text-sm">Efectos aplicados exitosamente</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
                >
                  <X className="size-5 text-white" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Success Animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 150 }}
                  className="flex justify-center mb-6"
                >
                  <div className="bg-green-100 p-4 rounded-full">
                    <CheckCircle className="size-12 text-green-600" />
                  </div>
                </motion.div>

                {/* Effects List */}
                <div className="space-y-3">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg"
                  >
                    <div className="bg-blue-100 p-2 rounded-full">
                      <TrendingDown className="size-5 text-blue-600 rotate-180" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">Atención Aumentada</p>
                      <p className="text-gray-600 text-sm">+8% en todos los estudiantes</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg"
                  >
                    <div className="bg-pink-100 p-2 rounded-full">
                      <Heart className="size-5 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">Serotonina Elevada</p>
                      <p className="text-gray-600 text-sm">+12% bienestar y motivación</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg"
                  >
                    <div className="bg-orange-100 p-2 rounded-full">
                      <TrendingDown className="size-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">Cortisol Reducido</p>
                      <p className="text-gray-600 text-sm">-8% menos estrés</p>
                    </div>
                  </motion.div>
                </div>

                {/* Tips */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100"
                >
                  <div className="flex items-start gap-3">
                    <Sparkles className="size-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-blue-900 font-medium text-sm">Consejo de IA</p>
                      <p className="text-blue-700 text-sm mt-1">
                        Los efectos se mantendrán por aproximadamente 10-15 minutos. 
                        Observa cómo responden los estudiantes a la actividad.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Close Button */}
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full mt-6 bg-[#0077FF] hover:bg-blue-600 text-white py-3 rounded-xl font-medium shadow-lg transition-all"
              >
                Continuar
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}