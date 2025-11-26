'use client'

import { useState } from 'react';
import { ArrowLeft, BookOpen, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Classroom } from '../App';
import studentsData from '../data/predefined-students.json';

interface CreateClassroomProps {
  onBack: () => void;
  onCreate: (classroom: Classroom) => void;
}

export function CreateClassroom({ onBack, onCreate }: CreateClassroomProps) {
  const [subject, setSubject] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [time, setTime] = useState('');

  const weekDays = [
    { id: 'lunes', name: 'Lunes', short: 'L' },
    { id: 'martes', name: 'Martes', short: 'M' },
    { id: 'miercoles', name: 'Miércoles', short: 'X' },
    { id: 'jueves', name: 'Jueves', short: 'J' },
    { id: 'viernes', name: 'Viernes', short: 'V' },
  ];

  const toggleDay = (dayId: string) => {
    setSelectedDays(prev => 
      prev.includes(dayId) 
        ? prev.filter(day => day !== dayId)
        : [...prev, dayId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subject && selectedDays.length > 0 && time) {
      // Randomly select students for this class
      const shuffled = [...studentsData.availableStudents].sort(() => 0.5 - Math.random());
      const assignedStudents = shuffled.slice(0, studentsData.defaultClassSize);
      
      onCreate({
        id: Date.now().toString(),
        name: subject, // Use subject as name
        subject,
        schedule: {
          days: selectedDays,
          time,
        },
        assignedStudents,
        studentCount: assignedStudents.length,
      });
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          whileHover={{ x: -5 }}
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="size-5" />
          Volver al Panel
        </motion.button>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <h2 className="text-gray-900 mb-2">Crear Nueva Clase</h2>
          <p className="text-gray-600 mb-8">
            Configura una nueva clase para tus estudiantes
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-gray-700 mb-2">Nombre de la Materia</label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0077FF] transition-all"
                  placeholder="ej., Neurociencias"
                  required
                />
              </div>
            </motion.div>

            {/* Days of the Week Selector */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-gray-700 mb-3">Días de la Semana</label>
              <div className="flex gap-3 justify-center mb-6">
                {weekDays.map((day, idx) => (
                  <motion.button
                    key={day.id}
                    type="button"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleDay(day.id)}
                    className={`size-14 rounded-full font-medium transition-all ${
                      selectedDays.includes(day.id)
                        ? 'bg-[#FF1D86] text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={day.name}
                  >
                    {day.short}
                  </motion.button>
                ))}
              </div>
              {selectedDays.length > 0 && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-sm text-gray-600"
                >
                  Seleccionados: {selectedDays.map(dayId => 
                    weekDays.find(d => d.id === dayId)?.name
                  ).join(', ')}
                </motion.p>
              )}
            </motion.div>

            {/* Time Selector */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-gray-700 mb-2">Hora</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0077FF] transition-all"
                  required
                />
              </div>
            </motion.div>

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-[#0077FF] hover:bg-blue-600 text-white py-3 rounded-xl hover:shadow-lg transition-all"
            >
              Continuar a Sincronizar Dispositivos
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}