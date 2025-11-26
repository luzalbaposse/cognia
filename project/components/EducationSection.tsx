'use client'

import { useState } from 'react';
import { BookOpen, Brain, Zap, Heart, AlertTriangle, ChevronDown, ChevronRight, Lightbulb, Shield, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EducationSectionProps {
  onClose: () => void;
}

export function EducationSection({ onClose }: EducationSectionProps) {
  const [activeSection, setActiveSection] = useState<string | null>('what-is-cognia');

  const sections = [
    {
      id: 'what-is-cognia',
      title: '¿Qué es Cognia?',
      icon: Brain,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Cognia es una plataforma revolucionaria de neurotecnología educativa que utiliza 
            interfaces cerebro-computadora no invasivas para optimizar el aprendizaje en tiempo real.
          </p>
          <div className="bg-blue-50 p-4 rounded-xl">
            <h4 className="font-semibold text-blue-900 mb-2">Características principales:</h4>
            <ul className="space-y-1 text-blue-800">
              <li>• Monitoreo en tiempo real de estados neurocognitivos</li>
              <li>• Intervenciones personalizadas y grupales</li>
              <li>• Estimulación no invasiva de neurotransmisores</li>
              <li>• Análisis predictivo de rendimiento académico</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'neurotransmitters',
      title: 'Neurotransmisores y Aprendizaje',
      icon: Zap,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 mb-4">
            Los neurotransmisores son químicos cerebrales que afectan directamente 
            la capacidad de aprendizaje, atención y bienestar emocional.
          </p>
          
          <div className="grid gap-4">
            <div className="border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <h4 className="font-semibold text-gray-900">Dopamina</h4>
              </div>
              <p className="text-gray-700 text-sm mb-2">
                Neurotransmisor de la motivación y recompensa. Esencial para mantener 
                el interés y la perseverancia en tareas desafiantes.
              </p>
              <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block">
                Función: Motivación, enfoque, recompensa
              </div>
            </div>

            <div className="border border-pink-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                <h4 className="font-semibold text-gray-900">Serotonina</h4>
              </div>
              <p className="text-gray-700 text-sm mb-2">
                Regulador del estado de ánimo y bienestar. Facilita un ambiente 
                de aprendizaje positivo y reduce la ansiedad académica.
              </p>
              <div className="text-xs text-pink-600 bg-pink-50 px-2 py-1 rounded-full inline-block">
                Función: Bienestar, confianza, estabilidad emocional
              </div>
            </div>

            <div className="border border-orange-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <h4 className="font-semibold text-gray-900">Cortisol</h4>
              </div>
              <p className="text-gray-700 text-sm mb-2">
                Hormona del estrés que en niveles moderados mejora la atención, 
                pero en exceso puede inhibir el aprendizaje y la memoria.
              </p>
              <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full inline-block">
                Función: Alerta, respuesta al estrés
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'technology',
      title: 'Cómo Funciona la Tecnología',
      icon: Cpu,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Cognia utiliza chips neuronales no invasivos y estimulación transcraneal 
            para modular la actividad cerebral de forma segura y efectiva.
          </p>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Cpu className="size-4 text-blue-600" />
                Chips Neuronales No Invasivos
              </h4>
              <p className="text-gray-700 text-sm mb-2">
                Dispositivos colocados en la superficie del cuero cabelludo que detectan 
                y modulan señales eléctricas cerebrales sin penetrar el tejido.
              </p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Lectores de EEG de alta precisión</li>
                <li>• Estimuladores transcranales de corriente directa</li>
                <li>• Sensores de conductividad neuronal</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Zap className="size-4 text-yellow-600" />
                Estimulación Dirigida
              </h4>
              <p className="text-gray-700 text-sm mb-2">
                Microcorrientes eléctricas que estimulan específicamente las áreas 
                cerebrales relacionadas con la producción de neurotransmisores.
              </p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Estimulación del área tegmental ventral (dopamina)</li>
                <li>• Activación del núcleo del rafe (serotonina)</li>
                <li>• Modulación del eje hipotálamo-hipófisis (cortisol)</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'safety',
      title: 'Seguridad y Ética',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
              <Shield className="size-4" />
              Certificaciones y Seguridad
            </h4>
            <ul className="text-green-800 text-sm space-y-1">
              <li>• Aprobado por FDA para uso educativo</li>
              <li>• Certificación CE médica clase IIa</li>
              <li>• Conforme a estándares IEEE para dispositivos neurotecnológicos</li>
              <li>• Supervisión médica continua durante el uso</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Consideraciones Éticas</h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p><strong>Consentimiento informado:</strong> Todos los estudiantes y padres 
                deben aprobar explícitamente el uso de la tecnología.</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p><strong>Privacidad neuronal:</strong> Los datos cerebrales están 
                encriptados y nunca salen del dispositivo del estudiante.</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p><strong>Uso responsable:</strong> La tecnología complementa, no reemplaza, 
                las metodologías pedagógicas tradicionales.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'best-practices',
      title: 'Mejores Prácticas',
      icon: Lightbulb,
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Recomendaciones para Educadores</h4>
          
          <div className="space-y-3">
            <div className="bg-blue-50 rounded-xl p-4">
              <h5 className="font-medium text-blue-900 mb-2">🎯 Intervenciones Pedagógicas Primero</h5>
              <p className="text-blue-800 text-sm">
                Utiliza primero técnicas pedagógicas tradicionales (cambio de ritmo, 
                preguntas, actividades) antes de recurrir a intervenciones neurotecnológicas.
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-4">
              <h5 className="font-medium text-purple-900 mb-2">⚖️ Modulación Gradual</h5>
              <p className="text-purple-800 text-sm">
                Aplica ajustes neurotransmisores de forma gradual y observa la respuesta 
                antes de hacer cambios adicionales.
              </p>
            </div>

            <div className="bg-green-50 rounded-xl p-4">
              <h5 className="font-medium text-green-900 mb-2">📊 Monitoreo Continuo</h5>
              <p className="text-green-800 text-sm">
                Observa tanto los indicadores tecnológicos como las señales conductuales 
                tradicionales de tus estudiantes.
              </p>
            </div>

            <div className="bg-orange-50 rounded-xl p-4">
              <h5 className="font-medium text-orange-900 mb-2">⏰ Pausas Regulares</h5>
              <p className="text-orange-800 text-sm">
                Programa descansos de la tecnología para permitir que el cerebro 
                procese naturalmente la información.
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-xl">
                <BookOpen className="size-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Centro de Educación Cognia</h2>
                <p className="text-gray-600">Todo lo que necesitas saber sobre neurotecnología educativa</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-80 border-r border-gray-200 p-4 overflow-y-auto">
            <nav className="space-y-2">
              {sections.map((section) => {
                const IconComponent = section.icon;
                return (
                  <motion.button
                    key={section.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-900'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="size-5 flex-shrink-0" />
                    <span className="font-medium">{section.title}</span>
                    <motion.div
                      animate={{ rotate: activeSection === section.id ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="size-4 ml-auto" />
                    </motion.div>
                  </motion.button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {activeSection && (
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6"
                >
                  {sections.find(s => s.id === activeSection)?.content}
                </motion.div>
              )}
            </AnimatePresence>
            
            {!activeSection && (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Brain className="size-16 text-gray-300 mx-auto mb-4" />
                  <p>Selecciona una sección para comenzar a aprender</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}