'use client'

import { useState } from 'react';
import { Activity, Droplet, Heart, AlertTriangle, Music2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Student } from '../App';
import { SpotifyPlaylistModal } from './SpotifyPlaylistModal';

interface StudentGridProps {
  students: Student[];
  onNeurotransmitter: (
    studentId: string,
    type: 'dopamine' | 'serotonin' | 'cortisol',
    change: number
  ) => void;
}

export function StudentGrid({ students, onNeurotransmitter }: StudentGridProps) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const getAttentionColor = (level: number) => {
    if (level >= 80) return 'from-green-400 to-green-600';
    if (level >= 60) return 'from-blue-400 to-blue-600';
    if (level >= 40) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  const getAttentionBorderColor = (level: number) => {
    if (level >= 80) return 'border-green-300';
    if (level >= 60) return 'border-blue-300';
    if (level >= 40) return 'border-yellow-300';
    return 'border-red-300';
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-gray-900 mb-6">Vista General de Estudiantes</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {students.map((student, idx) => (
          <motion.div
            key={student.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className={`border-2 ${getAttentionBorderColor(
              student.attentionLevel
            )} rounded-xl p-4 bg-gradient-to-br from-white to-gray-50 hover:shadow-md transition-all`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={`size-12 bg-gradient-to-br ${getAttentionColor(
                    student.attentionLevel
                  )} rounded-full flex items-center justify-center text-white`}
                >
                  {student.name.charAt(0)}
                </motion.div>
                <div>
                  <p className="text-gray-900">{student.name}</p>
                  <p className="text-gray-500">{student.deviceId}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <Activity className="size-4 text-gray-500" />
                  <p className="text-gray-900">
                    {student.attentionLevel.toFixed(0)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Neurotransmitter Levels */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplet className="size-4 text-blue-500" />
                  <span className="text-gray-600">Dopamine</span>
                </div>
                <span className="text-gray-900">
                  {student.neurotransmitters.dopamine.toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="size-4 text-pink-500" />
                  <span className="text-gray-600">Serotonin</span>
                </div>
                <span className="text-gray-900">
                  {student.neurotransmitters.serotonin.toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="size-4 text-orange-500" />
                  <span className="text-gray-600">Cortisol</span>
                </div>
                <span className="text-gray-900">
                  {student.neurotransmitters.cortisol.toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onNeurotransmitter(student.id, 'dopamine', 10)}
                className="flex-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors text-center"
                title="Enviar Dopamina"
              >
                <Droplet className="size-4 inline" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onNeurotransmitter(student.id, 'serotonin', 10)}
                className="flex-1 px-2 py-1 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-lg transition-colors text-center"
                title="Enviar Serotonina"
              >
                <Heart className="size-4 inline" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedStudent(student)}
                className="flex-1 px-2 py-1 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg transition-colors text-center"
                title="Reducir Cortisol con Música"
              >
                <Music2 className="size-4 inline" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Spotify Playlist Modal */}
      {selectedStudent && (
        <SpotifyPlaylistModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
}