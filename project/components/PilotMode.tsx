'use client'

import { useState, useEffect } from 'react';
import { Plane, Settings, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface PilotModeProps {
  isActive: boolean;
  onToggle: (active: boolean) => void;
  currentAttention: number;
  onAutoAdjust: () => void;
}

export function PilotMode({ isActive, onToggle, currentAttention, onAutoAdjust }: PilotModeProps) {
  const [targetThreshold, setTargetThreshold] = useState(70);
  const [autoInterventions, setAutoInterventions] = useState(0);

  useEffect(() => {
    if (isActive && currentAttention < targetThreshold) {
      // Simulate automatic intervention
      const timer = setTimeout(() => {
        onAutoAdjust();
        setAutoInterventions(prev => prev + 1);
        toast.success('Modo Piloto: Intervención automática aplicada');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isActive, currentAttention, targetThreshold, onAutoAdjust]);

  const getStatusColor = () => {
    if (!isActive) return 'bg-gray-100 text-gray-600';
    if (currentAttention >= targetThreshold) return 'bg-green-100 text-green-700';
    return 'bg-orange-100 text-orange-700';
  };

  const getStatusText = () => {
    if (!isActive) return 'Desactivado';
    if (currentAttention >= targetThreshold) return 'Objetivo Alcanzado';
    return 'Intervención Necesaria';
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <motion.div
            animate={isActive ? { rotate: [0, 10, -10, 0] } : { rotate: 0 }}
            transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
          >
            <Plane className="size-5 text-blue-600" />
          </motion.div>
          <h3 className="text-gray-900">Modo Piloto</h3>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onToggle(!isActive)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isActive ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <motion.span
            layout
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isActive ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </motion.button>
      </div>

      {/* Status Indicator */}
      <div className="mb-4">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
          {isActive ? (
            currentAttention >= targetThreshold ? (
              <CheckCircle className="size-4" />
            ) : (
              <AlertTriangle className="size-4" />
            )
          ) : (
            <Settings className="size-4" />
          )}
          <span>{getStatusText()}</span>
        </div>
      </div>

      {/* Configuration */}
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm mb-2">
            Umbral de Atención Objetivo
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="60"
              max="90"
              value={targetThreshold}
              onChange={(e) => setTargetThreshold(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              disabled={isActive}
            />
            <span className="font-semibold text-gray-900 w-12 text-right">
              {targetThreshold}%
            </span>
          </div>
        </div>

        {/* Current Status */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Atención Actual</p>
              <p className="text-xl font-semibold text-gray-900">
                {currentAttention.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Intervenciones Automáticas</p>
              <p className="text-xl font-semibold text-blue-600">
                {autoInterventions}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progreso hacia objetivo</span>
            <span>{Math.min(100, (currentAttention / targetThreshold) * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ 
                width: `${Math.min(100, (currentAttention / targetThreshold) * 100)}%` 
              }}
              transition={{ duration: 0.5 }}
              className={`h-2 rounded-full ${
                currentAttention >= targetThreshold 
                  ? 'bg-green-500' 
                  : currentAttention >= targetThreshold * 0.8 
                    ? 'bg-yellow-500' 
                    : 'bg-red-500'
              }`}
            />
          </div>
        </div>

        {/* Description */}
        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <p className="font-medium text-blue-800 mb-1">¿Cómo funciona?</p>
          <p>
            El Modo Piloto monitorea automáticamente la atención de la clase y 
            aplica intervenciones neurocognitivas cuando cae por debajo del umbral establecido.
          </p>
        </div>

        {/* Manual Intervention Button */}
        {isActive && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAutoAdjust}
            className="w-full flex items-center justify-center gap-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
          >
            <Zap className="size-4" />
            <span>Intervención Manual</span>
          </motion.button>
        )}
      </div>
    </div>
  );
}