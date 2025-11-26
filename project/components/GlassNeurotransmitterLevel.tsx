'use client'

import { motion } from 'framer-motion';
import { Droplet, Heart, AlertTriangle } from 'lucide-react';

interface GlassNeurotransmitterLevelProps {
  type: 'dopamine' | 'serotonin' | 'cortisol';
  level: number;
  studentName?: string;
  onAdjust?: (change: number) => void;
}

const neurotransmitterConfig = {
  dopamine: {
    name: 'Dopamina',
    icon: Droplet,
    color: 'from-blue-400 to-cyan-300',
    glowColor: 'rgba(59, 130, 246, 0.6)',
    bgColor: 'rgba(59, 130, 246, 0.1)',
  },
  serotonin: {
    name: 'Serotonina',
    icon: Heart,
    color: 'from-pink-400 to-rose-300',
    glowColor: 'rgba(236, 72, 153, 0.6)',
    bgColor: 'rgba(236, 72, 153, 0.1)',
  },
  cortisol: {
    name: 'Cortisol',
    icon: AlertTriangle,
    color: 'from-orange-400 to-amber-300',
    glowColor: 'rgba(249, 115, 22, 0.6)',
    bgColor: 'rgba(249, 115, 22, 0.1)',
  },
};

export function GlassNeurotransmitterLevel({ 
  type, 
  level, 
  studentName,
  onAdjust 
}: GlassNeurotransmitterLevelProps) {
  const config = neurotransmitterConfig[type];
  const IconComponent = config.icon;

  return (
    <div className="relative w-16 h-48 mx-2">
      {/* Glass container */}
      <motion.div 
        className="w-full h-full relative glass rounded-2xl overflow-hidden ar-hover"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          background: `linear-gradient(135deg, ${config.bgColor}, rgba(255, 255, 255, 0.05))`,
          boxShadow: `0 0 20px ${config.glowColor}, 0 8px 32px 0 rgba(31, 38, 135, 0.37)`,
        }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 p-1">
          <div className="w-full h-full rounded-xl bg-black/20" 
               style={{
                 background: 'linear-gradient(45deg, rgba(0,0,0,0.2) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)'
               }} />
        </div>
        
        {/* Level indicator */}
        <div className="absolute inset-0 flex items-end justify-center p-2">
          <motion.div
            className={`w-full bg-gradient-to-t ${config.color} rounded-lg relative overflow-hidden`}
            style={{ height: `${level}%` }}
            initial={{ height: 0 }}
            animate={{ height: `${level}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Animated particles */}
            <div className="absolute inset-0">
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/60 rounded-full"
                  animate={{
                    y: [0, -20, 0],
                    x: [0, 5, 0],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 2 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                  style={{
                    left: `${20 + i * 20}%`,
                    bottom: `${10 + i * 10}%`,
                  }}
                />
              ))}
            </div>
            
            {/* Glowing top edge */}
            <div 
              className="absolute top-0 left-0 right-0 h-1 blur-sm"
              style={{ 
                background: `linear-gradient(90deg, transparent, ${config.glowColor}, transparent)` 
              }}
            />
          </motion.div>
        </div>
        
        {/* Icon and level display */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <motion.div
            className="p-2 rounded-full glass-bright mb-1"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <IconComponent className="w-4 h-4 text-white" />
          </motion.div>
          <span className="text-xs text-white/80 font-mono font-bold">
            {Math.round(level)}%
          </span>
        </div>
        
        {/* Range slider overlay (rotated) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
          <input
            type="range"
            min="0"
            max="100"
            value={level}
            onChange={(e) => onAdjust && onAdjust(Number(e.target.value) - level)}
            className="w-36 h-2 bg-transparent appearance-none cursor-pointer transform rotate-90 origin-center"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
            }}
          />
        </div>
      </motion.div>
      
      {/* Label */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-xs text-white/60 font-medium whitespace-nowrap">
          {config.name}
        </p>
        {studentName && (
          <p className="text-xs text-white/40 font-mono whitespace-nowrap mt-1">
            {studentName}
          </p>
        )}
      </div>
      
      {/* Adjustment buttons */}
      {onAdjust && (
        <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            onClick={() => onAdjust(10)}
            className="w-6 h-6 rounded-full glass text-white text-xs font-bold ar-hover"
          >
            +
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            onClick={() => onAdjust(-10)}
            className="w-6 h-6 rounded-full glass text-white text-xs font-bold ar-hover"
          >
            -
          </motion.button>
        </div>
      )}
    </div>
  );
}