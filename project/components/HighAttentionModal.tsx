'use client'

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Send, Target, X, Zap } from 'lucide-react';
import { Student } from '../App';

interface HighAttentionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendTask: () => void;
  students: Student[];
  averageAttention: number;
}

export function HighAttentionModal({ 
  isOpen, 
  onClose, 
  onSendTask, 
  students, 
  averageAttention 
}: HighAttentionModalProps) {
  const handleSendTask = () => {
    onSendTask();
    onClose();
  };

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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
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
                    <Target className="size-6 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-white font-semibold text-lg">¡Excelente Atención!</h2>
                    <p className="text-white/80 text-sm">Momento ideal para enviar una tarea</p>
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
              {/* Attention Level Display */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 150 }}
                className="flex justify-center mb-6"
              >
                <div className="bg-green-100 p-6 rounded-full relative">
                  <CheckCircle className="size-16 text-green-600" />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -top-2 -right-2 bg-[#0077FF] text-white rounded-full size-8 flex items-center justify-center font-bold text-sm"
                  >
                    {Math.round(averageAttention)}%
                  </motion.div>
                </div>
              </motion.div>

              {/* Message */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center mb-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  ¡La atención es suficiente para que enviemos una tarea!
                </h3>
                <p className="text-gray-600 mb-4">
                  La clase está altamente concentrada ({Math.round(averageAttention)}% de atención promedio). 
                  Este es el momento perfecto para enviar una actividad que aproveche su estado de enfoque.
                </p>
              </motion.div>

              {/* Student Status Overview */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="size-5 text-blue-600" />
                  <h4 className="font-medium text-blue-900">Estado de la Clase</h4>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-blue-700">
                      <span className="font-medium">
                        {students.filter(s => s.attentionLevel >= 80).length}
                      </span> estudiantes con alta atención
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-700">
                      <span className="font-medium">
                        {students.filter(s => s.attentionLevel >= 70).length}
                      </span> estudiantes preparados
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-all"
                >
                  Ahora No
                </motion.button>
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSendTask}
                  className="flex-2 bg-[#0077FF] hover:bg-blue-600 text-white py-3 px-6 rounded-xl font-medium shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Send className="size-5" />
                  Enviar Tarea a la Clase
                </motion.button>
              </div>

              {/* Tip */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200"
              >
                <p className="text-amber-800 text-sm text-center">
                  💡 <strong>Consejo:</strong> Las tareas enviadas durante picos de atención tienen 
                  un 40% más de éxito en la comprensión y retención.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}