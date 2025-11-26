'use client'

import { useState } from 'react';
import { Search, BookOpen, Users, Clock, Zap, Brain, Heart, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Activity {
  id: string;
  title: string;
  description: string;
  duration: number; // en minutos
  subject: string;
  type: 'individual' | 'grupal' | 'pareja';
  difficulty: 'facil' | 'medio' | 'dificil';
  objective: string;
  materials: string[];
  neuroBenefits: {
    dopamine: boolean;
    serotonin: boolean;
    focus: boolean;
  };
}

const predefinedActivities: Activity[] = [
  {
    id: '1',
    title: 'Debate Rápido',
    description: 'Los estudiantes se dividen en dos grupos y debaten un tema específico durante 5 minutos.',
    duration: 10,
    subject: 'general',
    type: 'grupal',
    difficulty: 'medio',
    objective: 'Mejorar pensamiento crítico y participación activa',
    materials: ['pizarra', 'cronómetro'],
    neuroBenefits: { dopamine: true, serotonin: true, focus: true }
  },
  {
    id: '2',
    title: 'Lluvia de Ideas Express',
    description: 'En 3 minutos, cada estudiante escribe todas las ideas que se le ocurran sobre el tema.',
    duration: 5,
    subject: 'general',
    type: 'individual',
    difficulty: 'facil',
    objective: 'Activar creatividad y generar múltiples perspectivas',
    materials: ['papel', 'lápiz'],
    neuroBenefits: { dopamine: true, serotonin: false, focus: true }
  },
  {
    id: '3',
    title: 'Explicación en Parejas',
    description: 'Un estudiante explica el concepto a su compañero, luego intercambian roles.',
    duration: 8,
    subject: 'general',
    type: 'pareja',
    difficulty: 'medio',
    objective: 'Reforzar comprensión y habilidades de comunicación',
    materials: [],
    neuroBenefits: { dopamine: true, serotonin: true, focus: true }
  },
  {
    id: '4',
    title: 'Pregunta Misteriosa',
    description: 'Plantea una pregunta intrigante relacionada al tema y da tiempo para pensar.',
    duration: 3,
    subject: 'general',
    type: 'individual',
    difficulty: 'facil',
    objective: 'Despertar curiosidad y reactivar atención',
    materials: [],
    neuroBenefits: { dopamine: true, serotonin: false, focus: true }
  },
  {
    id: '5',
    title: 'Role Play Rápido',
    description: 'Estudiantes representan diferentes perspectivas o personajes históricos.',
    duration: 12,
    subject: 'historia',
    type: 'grupal',
    difficulty: 'dificil',
    objective: 'Desarrollar empatía y comprensión profunda del contenido',
    materials: ['disfraces opcionales'],
    neuroBenefits: { dopamine: true, serotonin: true, focus: true }
  },
  {
    id: '6',
    title: 'Conexión Personal',
    description: 'Cada estudiante comparte cómo el tema se relaciona con su vida personal.',
    duration: 7,
    subject: 'general',
    type: 'grupal',
    difficulty: 'medio',
    objective: 'Hacer el aprendizaje relevante y significativo',
    materials: [],
    neuroBenefits: { dopamine: false, serotonin: true, focus: true }
  }
];

interface ActivityBankProps {
  currentSubject?: string;
  onActivitySelect: (activity: Activity) => void;
  onClose: () => void;
}

export function ActivityBank({ currentSubject, onActivitySelect, onClose }: ActivityBankProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'individual' | 'grupal' | 'pareja'>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | 'facil' | 'medio' | 'dificil'>('all');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const filteredActivities = predefinedActivities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || activity.type === filterType;
    const matchesDifficulty = filterDifficulty === 'all' || activity.difficulty === filterDifficulty;
    const matchesSubject = !currentSubject || activity.subject === 'general' || activity.subject === currentSubject;
    
    return matchesSearch && matchesType && matchesDifficulty && matchesSubject;
  });

  const handleActivitySelect = (activity: Activity) => {
    setSelectedActivity(activity);
    onActivitySelect(activity);
    toast.success(`Actividad "${activity.title}" preparada para la clase`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facil': return 'text-green-600 bg-green-100';
      case 'medio': return 'text-yellow-600 bg-yellow-100';
      case 'dificil': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'individual': return <Brain className="size-4" />;
      case 'grupal': return <Users className="size-4" />;
      case 'pareja': return <Heart className="size-4" />;
      default: return <BookOpen className="size-4" />;
    }
  };

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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Banco de Actividades</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
          
          {/* Search and Filters */}
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar actividades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Filter className="size-4 text-gray-500" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos los tipos</option>
                  <option value="individual">Individual</option>
                  <option value="grupal">Grupal</option>
                  <option value="pareja">En Pareja</option>
                </select>
              </div>
              
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value as any)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Toda dificultad</option>
                <option value="facil">Fácil</option>
                <option value="medio">Medio</option>
                <option value="dificil">Difícil</option>
              </select>
            </div>
          </div>
        </div>

        {/* Activities Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="size-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron actividades con estos filtros</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {filteredActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handleActivitySelect(activity)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(activity.difficulty)}`}>
                          {activity.difficulty}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{activity.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="size-4" />
                        <span>{activity.duration} min</span>
                        {getTypeIcon(activity.type)}
                        <span className="capitalize">{activity.type}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {activity.neuroBenefits.dopamine && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                            Motivación
                          </span>
                        )}
                        {activity.neuroBenefits.serotonin && (
                          <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">
                            Bienestar
                          </span>
                        )}
                        {activity.neuroBenefits.focus && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                            Concentración
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm font-medium">{activity.objective}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}