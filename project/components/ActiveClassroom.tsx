'use client'

import { useState, useEffect } from 'react';
import {
  Brain,
  Activity,
  Zap,
  Send,
  AlertCircle,
  CheckCircle,
  Users,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Classroom, Student } from '../App';
import { StudentGrid } from './StudentGrid';
import { AISuggestions } from './AISuggestions';
import { SendTaskModal } from './SendTaskModal';

interface ActiveClassroomProps {
  classroom: Classroom;
  students: Student[];
  onStudentsUpdate: (students: Student[]) => void;
  onFinalize: () => void;
}

export function ActiveClassroom({
  classroom,
  students,
  onStudentsUpdate,
  onFinalize,
}: ActiveClassroomProps) {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [medianAttention, setMedianAttention] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    // Update attention levels periodically
    const interval = setInterval(() => {
      onStudentsUpdate(
        students.map((student) => ({
          ...student,
          attentionLevel: Math.max(
            20,
            Math.min(100, student.attentionLevel + (Math.random() - 0.5) * 10)
          ),
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [students, onStudentsUpdate]);

  useEffect(() => {
    // Calculate median attention
    const sorted = [...students]
      .map((s) => s.attentionLevel)
      .sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median =
      sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid];
    setMedianAttention(median);
  }, [students]);

  const handleNeurotransmitter = (
    studentId: string,
    type: 'dopamine' | 'serotonin' | 'cortisol',
    change: number
  ) => {
    onStudentsUpdate(
      students.map((student) =>
        student.id === studentId
          ? {
              ...student,
              neurotransmitters: {
                ...student.neurotransmitters,
                [type]: Math.max(
                  0,
                  Math.min(100, student.neurotransmitters[type] + change)
                ),
              },
              attentionLevel:
                type === 'dopamine' || type === 'serotonin'
                  ? Math.min(100, student.attentionLevel + change / 2)
                  : student.attentionLevel,
            }
          : student
      )
    );
  };

  const getAttentionColor = (level: number) => {
    if (level >= 80) return 'text-green-600';
    if (level >= 60) return 'text-blue-600';
    if (level >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAttentionBg = (level: number) => {
    if (level >= 80) return 'bg-green-100';
    if (level >= 60) return 'bg-blue-100';
    if (level >= 40) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const handleBoostAllAttention = () => {
    onStudentsUpdate(
      students.map((student) => ({
        ...student,
        attentionLevel: Math.min(100, student.attentionLevel + 15),
        neurotransmitters: {
          ...student.neurotransmitters,
          dopamine: Math.min(100, student.neurotransmitters.dopamine + 10),
        },
      }))
    );
    setFeedbackMessage('¡Atención aumentada para todos los estudiantes!');
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleStartActivity = () => {
    onStudentsUpdate(
      students.map((student) => ({
        ...student,
        attentionLevel: Math.min(100, student.attentionLevel + 8),
        neurotransmitters: {
          ...student.neurotransmitters,
          serotonin: Math.min(100, student.neurotransmitters.serotonin + 12),
          cortisol: Math.max(0, student.neurotransmitters.cortisol - 8),
        },
      }))
    );
    setFeedbackMessage('¡Actividad colaborativa iniciada! Los estudiantes están más relajados y enfocados.');
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-[#0077FF] to-[#FF1D86] p-2 rounded-xl">
                <Brain className="size-8 text-white" />
              </div>
              <div>
                <h2 className="text-gray-900">{classroom.name}</h2>
                <p className="text-gray-500">
                  {classroom.date} • {classroom.time}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onFinalize}
              className="bg-[#0077FF] hover:bg-blue-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all"
            >
              Finalizar Clase
            </motion.button>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Feedback Message */}
        {feedbackMessage && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="size-5 text-green-600" />
              <p>{feedbackMessage}</p>
            </div>
          </motion.div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Activity className="size-6 text-blue-600" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`px-3 py-1 rounded-full ${getAttentionBg(medianAttention)}`}
              >
                <p className={`${getAttentionColor(medianAttention)}`}>
                  {medianAttention.toFixed(1)}%
                </p>
              </motion.div>
            </div>
            <p className="text-gray-500 mb-1">Atención Promedio</p>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${medianAttention}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-[#0077FF] to-[#FF1D86]"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Users className="size-6 text-purple-600" />
              </div>
            </div>
            <p className="text-gray-500 mb-1">Estudiantes Activos</p>
            <p className="text-gray-900">{students.length}</p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <TrendingUp className="size-6 text-green-600" />
              </div>
            </div>
            <p className="text-gray-500 mb-1">Alta Concentración</p>
            <p className="text-gray-900">
              {students.filter((s) => s.attentionLevel >= 80).length} estudiantes
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Students Grid */}
          <div className="lg:col-span-2">
            <StudentGrid
              students={students}
              onNeurotransmitter={handleNeurotransmitter}
            />
          </div>

          {/* AI Suggestions & Actions */}
          <div className="space-y-6">
            <AISuggestions
              students={students}
              onNeurotransmitter={handleNeurotransmitter}
            />

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <h3 className="text-gray-900 mb-4">Acciones Rápidas</h3>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowTaskModal(true)}
                  className="w-full flex items-center gap-3 p-4 bg-[#0077FF] hover:bg-blue-600 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  <Send className="size-5" />
                  <span>Enviar Tarea a la Clase</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBoostAllAttention}
                  className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <Zap className="size-5 text-yellow-600" />
                  <span className="text-gray-900">Aumentar Toda la Atención</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStartActivity}
                  className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <Sparkles className="size-5 text-purple-600" />
                  <span className="text-gray-900">Iniciar Actividad</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {showTaskModal && (
        <SendTaskModal
          students={students}
          onClose={() => setShowTaskModal(false)}
        />
      )}
    </div>
  );
}