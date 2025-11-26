'use client'

import { useState, useEffect } from 'react';
import { ArrowLeft, Wifi, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Classroom, Student } from '../App';
import { WifiLoader } from './WifiLoader';

interface SyncDevicesProps {
  classroom: Classroom;
  onBack: () => void;
  onSynced: (students: Student[]) => void;
}

export function SyncDevices({ classroom, onBack, onSynced }: SyncDevicesProps) {
  // Use students assigned to this classroom
  const assignedStudents = classroom.assignedStudents;
  const [syncing, setSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);
  const [syncedDevices, setSyncedDevices] = useState<string[]>([]);

  useEffect(() => {
    if (syncing) {
      const interval = setInterval(() => {
        setSyncedDevices((prev) => {
          if (prev.length >= assignedStudents.length) {
            clearInterval(interval);
            // Wait a bit before showing completion
            setTimeout(() => setSyncComplete(true), 500);
            return prev;
          }
          return [...prev, assignedStudents[prev.length].deviceId];
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [syncing]);

  const handleStartSync = () => {
    setSyncing(true);
  };

  const handleComplete = () => {
    const students: Student[] = assignedStudents.map((student, idx) => ({
      id: `student-${idx}`,
      name: student.name,
      deviceId: student.deviceId,
      attentionLevel: 70 + Math.random() * 20,
      neurotransmitters: {
        dopamine: 60 + Math.random() * 30,
        serotonin: 50 + Math.random() * 30,
        cortisol: 30 + Math.random() * 20,
      },
    }));
    onSynced(students);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
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
          <div className="text-center mb-8">
            {!syncing ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center justify-center size-16 bg-gradient-to-br from-[#0077FF] to-[#FF1D86] rounded-2xl mb-4"
              >
                <Wifi className="size-8 text-white" />
              </motion.div>
            ) : syncComplete ? (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center size-16 bg-green-500 rounded-2xl mb-4"
              >
                <CheckCircle2 className="size-8 text-white" />
              </motion.div>
            ) : (
              <div className="mb-4">
                <WifiLoader />
              </div>
            )}
            <h2 className="text-gray-900 mb-2">
              {syncComplete ? "¡Dispositivos Sincronizados!" : "Sincronizar Dispositivos de Estudiantes"}
            </h2>
            <p className="text-gray-600">
              {classroom.name} • {classroom.schedule?.days.join(', ')} a las {classroom.schedule?.time}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!syncing ? (
              <motion.div
                key="start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <p className="text-gray-600 mb-6">
                  Haz clic abajo para comenzar a escanear dispositivos neurales de estudiantes en rango
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartSync}
                  className="bg-[#0077FF] hover:bg-blue-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all"
                >
                  Iniciar Sincronización
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="syncing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-500">
                      {syncedDevices.length}/{assignedStudents.length}
                    </p>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(syncedDevices.length / assignedStudents.length) * 100}%`,
                      }}
                      className="h-full bg-[#0077FF]"
                    />
                  </div>
                </div>

                <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
                  {assignedStudents.map((student, idx) => {
                    const isSynced = syncedDevices.includes(student.deviceId);
                    return (
                      <motion.div
                        key={student.deviceId}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                          isSynced ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <motion.div
                            animate={{
                              scale: isSynced ? [1, 1.2, 1] : 1,
                            }}
                            transition={{ duration: 0.3 }}
                            className={`size-10 rounded-full flex items-center justify-center text-white ${
                              isSynced
                                ? 'bg-gradient-to-br from-green-400 to-green-600'
                                : 'bg-gray-300'
                            }`}
                          >
                            {student.name.charAt(0)}
                          </motion.div>
                          <div>
                            <p className="text-gray-900">{student.name}</p>
                            <p className="text-gray-500">{student.deviceId}</p>
                          </div>
                        </div>
                        {isSynced ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500 }}
                          >
                            <CheckCircle2 className="size-6 text-green-600" />
                          </motion.div>
                        ) : (
                          <Loader2 className="size-6 text-gray-400 animate-spin" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {syncedDevices.length === assignedStudents.length && (
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleComplete}
                    className="w-full bg-[#0077FF] hover:bg-blue-600 text-white py-3 rounded-xl hover:shadow-lg transition-all"
                  >
                    Iniciar Sesión de Aula
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}