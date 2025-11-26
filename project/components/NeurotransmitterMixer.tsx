'use client'

import { useState } from 'react';
import { Droplet, Heart, AlertTriangle, Zap, Users, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Student } from '../App';
import { toast } from 'sonner';

interface NeurotransmitterMixerProps {
  students: Student[];
  onBulkNeurotransmitter: (
    type: 'dopamine' | 'serotonin' | 'cortisol',
    change: number,
    targets?: 'all' | 'low' | 'high'
  ) => void;
}

export function NeurotransmitterMixer({ students, onBulkNeurotransmitter }: NeurotransmitterMixerProps) {
  const [dopamineLevel, setDopamineLevel] = useState(50);
  const [serotoninLevel, setSerotoninLevel] = useState(50);
  const [cortisolLevel, setCortisolLevel] = useState(50);

  const avgDopamine = students.reduce((sum, s) => sum + s.neurotransmitters.dopamine, 0) / students.length;
  const avgSerotonin = students.reduce((sum, s) => sum + s.neurotransmitters.serotonin, 0) / students.length;
  const avgCortisol = students.reduce((sum, s) => sum + s.neurotransmitters.cortisol, 0) / students.length;

  const handleBulkAdjustment = (type: 'dopamine' | 'serotonin' | 'cortisol', level: number) => {
    const currentAvg = type === 'dopamine' ? avgDopamine : type === 'serotonin' ? avgSerotonin : avgCortisol;
    const change = level - currentAvg;
    
    if (Math.abs(change) > 2) { // Only apply significant changes
      onBulkNeurotransmitter(type, change, 'all');
      toast.success(`${type === 'dopamine' ? 'Dopamina' : type === 'serotonin' ? 'Serotonina' : 'Cortisol'} ajustado para toda la clase`);
    }
  };

  const handleTargetedAdjustment = (type: 'dopamine' | 'serotonin' | 'cortisol', target: 'low' | 'high') => {
    const change = target === 'low' ? 15 : -10;
    onBulkNeurotransmitter(type, change, target);
    const targetText = target === 'low' ? 'estudiantes con niveles bajos' : 'estudiantes con niveles altos';
    toast.success(`${type === 'dopamine' ? 'Dopamina' : type === 'serotonin' ? 'Serotonina' : 'Cortisol'} ajustado para ${targetText}`);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <Volume2 className="size-5 text-purple-600" />
        <h3 className="text-gray-900">Mezclador de Neurotransmisores</h3>
      </div>

      {/* Current Class Levels */}
      <div className="mb-6 p-4 bg-gray-50 rounded-xl">
        <p className="text-gray-600 text-sm mb-3">Niveles Promedio de la Clase</p>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Droplet className="size-4 text-blue-500" />
              <span className="text-sm text-gray-600">Dopamina</span>
            </div>
            <p className="text-lg font-medium text-gray-900">{avgDopamine.toFixed(0)}%</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Heart className="size-4 text-pink-500" />
              <span className="text-sm text-gray-600">Serotonina</span>
            </div>
            <p className="text-lg font-medium text-gray-900">{avgSerotonin.toFixed(0)}%</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <AlertTriangle className="size-4 text-orange-500" />
              <span className="text-sm text-gray-600">Cortisol</span>
            </div>
            <p className="text-lg font-medium text-gray-900">{avgCortisol.toFixed(0)}%</p>
          </div>
        </div>
      </div>

      {/* Mixer Controls */}
      <div className="space-y-6">
        {/* Dopamine */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Droplet className="size-4 text-blue-500" />
              <label className="text-gray-700 text-sm">Dopamina (Motivación)</label>
            </div>
            <span className="text-gray-900 font-medium">{dopamineLevel}%</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="100"
              value={dopamineLevel}
              onChange={(e) => setDopamineLevel(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBulkAdjustment('dopamine', dopamineLevel)}
              className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm transition-colors"
            >
              Aplicar
            </motion.button>
          </div>
          <div className="flex gap-2 mt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTargetedAdjustment('dopamine', 'low')}
              className="flex-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs transition-colors"
            >
              Subir en Bajos
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTargetedAdjustment('dopamine', 'high')}
              className="flex-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs transition-colors"
            >
              Bajar en Altos
            </motion.button>
          </div>
        </div>

        {/* Serotonin */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Heart className="size-4 text-pink-500" />
              <label className="text-gray-700 text-sm">Serotonina (Bienestar)</label>
            </div>
            <span className="text-gray-900 font-medium">{serotoninLevel}%</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="100"
              value={serotoninLevel}
              onChange={(e) => setSerotoninLevel(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pink-500"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBulkAdjustment('serotonin', serotoninLevel)}
              className="px-3 py-1 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-lg text-sm transition-colors"
            >
              Aplicar
            </motion.button>
          </div>
          <div className="flex gap-2 mt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTargetedAdjustment('serotonin', 'low')}
              className="flex-1 px-2 py-1 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-lg text-xs transition-colors"
            >
              Subir en Bajos
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTargetedAdjustment('serotonin', 'high')}
              className="flex-1 px-2 py-1 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-lg text-xs transition-colors"
            >
              Bajar en Altos
            </motion.button>
          </div>
        </div>

        {/* Cortisol */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-orange-500" />
              <label className="text-gray-700 text-sm">Cortisol (Estrés)</label>
            </div>
            <span className="text-gray-900 font-medium">{cortisolLevel}%</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="100"
              value={cortisolLevel}
              onChange={(e) => setCortisolLevel(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBulkAdjustment('cortisol', cortisolLevel)}
              className="px-3 py-1 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg text-sm transition-colors"
            >
              Aplicar
            </motion.button>
          </div>
          <div className="flex gap-2 mt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTargetedAdjustment('cortisol', 'high')}
              className="flex-1 px-2 py-1 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg text-xs transition-colors"
            >
              Reducir en Altos
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTargetedAdjustment('cortisol', 'low')}
              className="flex-1 px-2 py-1 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg text-xs transition-colors"
            >
              Subir en Bajos
            </motion.button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-gray-600 text-sm mb-3">Acciones Rápidas</p>
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onBulkNeurotransmitter('dopamine', 15, 'all');
              onBulkNeurotransmitter('serotonin', 10, 'all');
              toast.success('¡Energía positiva enviada a toda la clase!');
            }}
            className="flex items-center gap-2 p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl transition-colors"
          >
            <Zap className="size-4" />
            <span className="text-sm">Energizar Clase</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onBulkNeurotransmitter('cortisol', -15, 'all');
              onBulkNeurotransmitter('serotonin', 12, 'all');
              toast.success('Calma aplicada a toda la clase');
            }}
            className="flex items-center gap-2 p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl transition-colors"
          >
            <Users className="size-4" />
            <span className="text-sm">Calmar Clase</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}