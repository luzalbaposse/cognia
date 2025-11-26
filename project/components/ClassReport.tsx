'use client'

import {
  Brain,
  TrendingUp,
  Users,
  Award,
  Activity,
  BarChart3,
  Download,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Classroom, Student } from '../App';

interface ClassReportProps {
  classroom: Classroom;
  students: Student[];
  onBackToDashboard: () => void;
}

export function ClassReport({
  classroom,
  students,
  onBackToDashboard,
}: ClassReportProps) {
  const avgAttention =
    students.reduce((sum, s) => sum + s.attentionLevel, 0) / students.length;

  const topPerformers = [...students]
    .sort((a, b) => b.attentionLevel - a.attentionLevel)
    .slice(0, 3);

  const needsSupport = [...students]
    .sort((a, b) => a.attentionLevel - b.attentionLevel)
    .slice(0, 3);

  // Generate mock attention flow data for the entire class session
  const attentionFlowData = Array.from({ length: 30 }, (_, i) => {
    const minute = i * 2; // Every 2 minutes
    const baseAttention = avgAttention;
    const variation = Math.sin((i * Math.PI) / 10) * 15 + Math.random() * 10 - 5;
    return {
      minute,
      attention: Math.max(20, Math.min(100, baseAttention + variation)),
      time: `${Math.floor(minute / 60)}:${(minute % 60).toString().padStart(2, '0')}`
    };
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, ease: "linear" }}
              className="bg-gradient-to-br from-[#0077FF] to-[#FF1D86] p-2 rounded-xl"
            >
              <Brain className="size-8 text-white" />
            </motion.div>
            <div>
              <h2 className="text-gray-900">Reporte de Clase</h2>
              <p className="text-gray-500">
                {classroom.name} • {classroom.date}
              </p>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Summary Banner */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-[#0077FF] to-[#FF1D86] rounded-3xl p-8 mb-8 text-white"
        >
          <div className="flex items-center gap-3 mb-4">
            <Award className="size-8" />
            <h2>¡Sesión Completa!</h2>
          </div>
          <p className="text-blue-100 mb-6">
¡Excelente trabajo! Aquí tienes un resumen de tu sesión de clase.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
            >
              <p className="text-blue-100 mb-1">Atención Promedio</p>
              <p className="text-white">{avgAttention.toFixed(1)}%</p>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
            >
              <p className="text-blue-100 mb-1">Total Estudiantes</p>
              <p className="text-white">{students.length}</p>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
            >
              <p className="text-blue-100 mb-1">Alto Compromiso</p>
              <p className="text-white">
                {students.filter((s) => s.attentionLevel >= 80).length} estudiantes
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Attention Flow Graph */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="size-5 text-[#0077FF]" />
            <h3 className="text-gray-900">Flujo de Atención Durante la Clase</h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attentionFlowData}>
                <defs>
                  <linearGradient id="attentionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0077FF" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FF1D86" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <YAxis 
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  labelFormatter={(value) => `Tiempo: ${value}`}
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Atención']}
                />
                <Area
                  type="monotone"
                  dataKey="attention"
                  stroke="#0077FF"
                  strokeWidth={3}
                  fill="url(#attentionGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center text-gray-500 text-sm">
            La atención promedio de la clase fue de {avgAttention.toFixed(1)}%
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Performers */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="size-5 text-green-600" />
              <h3 className="text-gray-900">Mejores Rendimientos</h3>
            </div>
            <div className="space-y-4">
              {topPerformers.map((student, idx) => (
                <motion.div
                  key={student.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                  whileHover={{ x: 5 }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-gray-900">{student.name}</p>
                      <p className="text-gray-500">{student.deviceId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600">
                      {student.attentionLevel.toFixed(0)}%
                    </p>
                    <p className="text-gray-500">Atención</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Needs Support */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-2 mb-6">
              <Activity className="size-5 text-orange-600" />
              <h3 className="text-gray-900">Necesita Apoyo</h3>
            </div>
            <div className="space-y-4">
              {needsSupport.map((student, idx) => (
                <motion.div
                  key={student.id}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                  whileHover={{ x: -5 }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-gray-900">{student.name}</p>
                      <p className="text-gray-500">{student.deviceId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-orange-600">
                      {student.attentionLevel.toFixed(0)}%
                    </p>
                    <p className="text-gray-500">Atención</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* All Students */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <Users className="size-5 text-blue-600" />
            <h3 className="text-gray-900">Todos los Estudiantes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 text-gray-700">Estudiante</th>
                  <th className="text-left py-3 text-gray-700">ID Dispositivo</th>
                  <th className="text-right py-3 text-gray-700">Atención</th>
                  <th className="text-right py-3 text-gray-700">Dopamine</th>
                  <th className="text-right py-3 text-gray-700">Serotonin</th>
                  <th className="text-right py-3 text-gray-700">Cortisol</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0 + idx * 0.05 }}
                    className="border-b border-gray-100"
                  >
                    <td className="py-3 text-gray-900">{student.name}</td>
                    <td className="py-3 text-gray-600">{student.deviceId}</td>
                    <td className="py-3 text-right text-gray-900">
                      {student.attentionLevel.toFixed(0)}%
                    </td>
                    <td className="py-3 text-right text-gray-900">
                      {student.neurotransmitters.dopamine.toFixed(0)}%
                    </td>
                    <td className="py-3 text-right text-gray-900">
                      {student.neurotransmitters.serotonin.toFixed(0)}%
                    </td>
                    <td className="py-3 text-right text-gray-900">
                      {student.neurotransmitters.cortisol.toFixed(0)}%
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-[#0077FF] hover:bg-blue-600 text-white py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Download className="size-5" />
            Descargar Reporte
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBackToDashboard}
            className="flex-1 bg-white text-gray-700 py-3 rounded-xl hover:shadow-lg transition-all border border-gray-200"
          >
            Volver al Panel
          </motion.button>
        </motion.div>
      </main>
    </div>
  );
}