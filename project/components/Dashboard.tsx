'use client'

import { Brain, Plus, BookOpen, Calendar, Users, Clock, Play, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Classroom, ClassSession } from '../App';

interface DashboardProps {
  onCreateClassroom: () => void;
  onStartSession: (classroom: Classroom, topic?: string) => void;
  classrooms: Classroom[];
  sessions: ClassSession[];
}

export function Dashboard({ onCreateClassroom, onStartSession, classrooms, sessions }: DashboardProps) {
  const totalStudents = sessions.reduce((sum, session) => sum + (session.studentCount || 0), 0);
  const thisWeekSessions = sessions.filter(session => {
    const sessionDate = new Date(session.date);
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return sessionDate >= weekAgo && sessionDate <= today;
  }).length;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="bg-[#0077FF] p-2 rounded-xl"
            >
              <Brain className="size-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-gray-900">Cognia</h1>
              <p className="text-gray-500">Panel del Profesor</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="size-12 bg-blue-100 rounded-full flex items-center justify-center cursor-pointer"
            >
              <span className="text-blue-600">PA</span>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-[#0077FF] to-[#FF1D86] rounded-3xl p-8 mb-8 text-white"
        >
          <h2 className="mb-2">¡Bienvenido de vuelta, Profesor! 👋</h2>
          <p className="text-blue-100 mb-6">
¿Listo para mejorar la experiencia de aprendizaje de tus estudiantes con neurotecnología?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreateClassroom}
            className="bg-[#0077FF] hover:bg-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="size-5" />
            Crear Nueva Clase
          </motion.button>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <BookOpen className="size-6 text-blue-600" />
              </div>
            </div>
            <p className="text-gray-500 mb-1">Total Clases</p>
            <p className="text-gray-900">{classrooms.length}</p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Users className="size-6 text-purple-600" />
              </div>
            </div>
            <p className="text-gray-500 mb-1">Total Estudiantes</p>
            <p className="text-gray-900">{totalStudents}</p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <Calendar className="size-6 text-green-600" />
              </div>
            </div>
            <p className="text-gray-500 mb-1">Esta Semana</p>
            <p className="text-gray-900">{thisWeekSessions} Sesiones</p>
          </motion.div>
        </div>

        {/* Recent Classes */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-gray-900 mb-4">Materias Creadas</h3>
          {classrooms.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center size-16 bg-gray-100 rounded-full mb-4">
                <BookOpen className="size-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-2">Aún no hay clases</p>
              <p className="text-gray-400">¡Crea tu primera clase para comenzar!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {classrooms.map((cls, idx) => (
                <motion.div
                  key={cls.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                  whileHover={{ x: 5, backgroundColor: 'rgb(249 250 251)' }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="size-12 bg-[#0077FF] rounded-xl flex items-center justify-center text-white"
                    >
                      {cls.name.charAt(0)}
                    </motion.div>
                    <div>
                      <p className="text-gray-900">{cls.name}</p>
                      <p className="text-sm text-gray-600 mb-1">{cls.subject}</p>
                      <div className="flex items-center gap-3 text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {cls.schedule?.days.join(', ')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {cls.schedule?.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onStartSession(cls)}
                      className="flex items-center gap-1 px-3 py-1 bg-[#0077FF] hover:bg-blue-600 text-white rounded-lg transition-all"
                    >
                      <Play className="size-4" />
                      Iniciar
                    </motion.button>
                    <ChevronRight className="size-5 text-gray-400" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}