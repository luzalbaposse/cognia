'use client'

import { useEffect, useState } from 'react';
import { 
  Sparkles, Droplet, Heart, AlertTriangle, Users, Check, X, 
  Zap, Target, Music, Pause, HelpCircle, Activity, ClipboardCheck,
  Brain, Wind, Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Student } from '../App';
import suggestionsConfig from '../data/ai-suggestions.json';

interface AISuggestionsProps {
  students: Student[];
  onNeurotransmitter: (
    studentId: string,
    type: 'dopamine' | 'serotonin' | 'cortisol',
    change: number
  ) => void;
}

interface Suggestion {
  id: string;
  type: 'neurotransmitter' | 'activity' | 'neuro';
  message: string;
  action?: () => void;
  icon: 'dopamine' | 'serotonin' | 'cortisol' | 'activity' | 'zap' | 'target' | 'users' | 'music' | 'pause' | 'help-circle' | 'sparkles' | 'clipboard-check' | 'brain' | 'wind' | 'moon';
  studentName?: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: number;
}

export function AISuggestions({
  students,
  onNeurotransmitter,
}: AISuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const handleAcceptSuggestion = (suggestion: Suggestion) => {
    if (suggestion.action) {
      suggestion.action();
    }
    setSuggestions(prev => prev.map(s => 
      s.id === suggestion.id ? { ...s, status: 'accepted' as const } : s
    ));
    
    // Show feedback message
    if (suggestion.type === 'neurotransmitter' || suggestion.type === 'neuro') {
      setFeedbackMessage(suggestion.studentName ? 
        `Intervención aplicada a ${suggestion.studentName}` : 
        'Intervención neurológica aplicada');
    } else {
      setFeedbackMessage('Sugerencia aplicada exitosamente');
    }
    
    // Remove accepted suggestion and feedback after configured delay
    setTimeout(() => {
      setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
      setFeedbackMessage(null);
    }, suggestionsConfig.intervals.feedbackDisplayMs);
  };

  const handleRejectSuggestion = (suggestion: Suggestion) => {
    setSuggestions(prev => prev.map(s => 
      s.id === suggestion.id ? { ...s, status: 'rejected' as const } : s
    ));
    
    // Show feedback message
    setFeedbackMessage('Sugerencia descartada');
    
    // Remove rejected suggestion and feedback after configured delay
    setTimeout(() => {
      setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
      setFeedbackMessage(null);
    }, suggestionsConfig.intervals.feedbackDisplayMs);
  };

  useEffect(() => {
    const generateSuggestions = () => {
      const newSuggestions: Suggestion[] = [];

      // Smart contextual suggestions based on class patterns
      const contextualSuggestions = [];
      
      // Check average attention and suggest activities
      const avgAttention = students.reduce((sum, s) => sum + s.attentionLevel, 0) / students.length;
      
      // High attention suggestions
      if (avgAttention >= suggestionsConfig.thresholds.highAttention) {
        const highAttentionSuggestions = suggestionsConfig.contextualSuggestions.highAttention;
        const validSuggestions = highAttentionSuggestions.filter(s => avgAttention >= s.minAttention);
        if (validSuggestions.length > 0) {
          const randomSuggestion = validSuggestions[Math.floor(Math.random() * validSuggestions.length)];
          contextualSuggestions.push({
            id: `high-attention-${Date.now()}`,
            type: 'activity' as 'activity' | 'neuro' | 'neurotransmitter',
            message: randomSuggestion.message,
            icon: randomSuggestion.icon as any,
            status: 'pending' as const,
            timestamp: Date.now(),
          });
        }
      }
      
      // Low attention suggestions
      if (avgAttention <= suggestionsConfig.thresholds.lowAttention) {
        const lowAttentionSuggestions = suggestionsConfig.contextualSuggestions.lowAttention;
        const validSuggestions = lowAttentionSuggestions.filter(s => avgAttention <= s.maxAttention);
        if (validSuggestions.length > 0) {
          const randomSuggestion = validSuggestions[Math.floor(Math.random() * validSuggestions.length)];
          contextualSuggestions.push({
            id: `low-attention-${Date.now()}`,
            type: 'activity' as 'activity' | 'neuro' | 'neurotransmitter',
            message: randomSuggestion.message,
            icon: randomSuggestion.icon as any,
            status: 'pending' as const,
            timestamp: Date.now(),
          });
        }
      }
      
      // Check for high dopamine students
      const highDopamineStudents = students.filter(s => s.neurotransmitters.dopamine >= suggestionsConfig.thresholds.highDopamine);
      suggestionsConfig.contextualSuggestions.highDopamine.forEach(suggestion => {
        if (highDopamineStudents.length >= students.length * suggestion.minStudentPercentage) {
          contextualSuggestions.push({
            id: `dopamine-success-${Date.now()}`,
            type: suggestion.type as 'activity' | 'neuro' | 'neurotransmitter',
            message: suggestion.message,
            icon: suggestion.icon as any,
            status: 'pending' as const,
            timestamp: Date.now(),
          });
        }
      });

      // Check for low dopamine students (new category)
      if (suggestionsConfig.contextualSuggestions.lowDopamine) {
        const avgDopamine = students.reduce((sum, s) => sum + s.neurotransmitters.dopamine, 0) / students.length;
        const lowDopamineSuggestions = suggestionsConfig.contextualSuggestions.lowDopamine;
        const validSuggestions = lowDopamineSuggestions.filter(s => avgDopamine <= s.maxDopamine);
        if (validSuggestions.length > 0) {
          const randomSuggestion = validSuggestions[Math.floor(Math.random() * validSuggestions.length)];
          contextualSuggestions.push({
            id: `low-dopamine-${Date.now()}`,
            type: randomSuggestion.type as 'activity' | 'neuro' | 'neurotransmitter',
            message: randomSuggestion.message,
            icon: randomSuggestion.icon as any,
            status: 'pending' as const,
            timestamp: Date.now(),
          });
        }
      }

      // Check for high stress/cortisol (new category)
      if (suggestionsConfig.contextualSuggestions.highStressCortisol) {
        const highCortisolStudents = students.filter(s => s.neurotransmitters.cortisol >= suggestionsConfig.thresholds.highCortisol);
        suggestionsConfig.contextualSuggestions.highStressCortisol.forEach(suggestion => {
          if (highCortisolStudents.length >= students.length * suggestion.minStudentPercentage) {
            contextualSuggestions.push({
              id: `high-cortisol-${Date.now()}`,
              type: suggestion.type as 'activity' | 'neuro' | 'neurotransmitter',
              message: suggestion.message,
              icon: suggestion.icon as any,
              status: 'pending' as const,
              timestamp: Date.now(),
            });
          }
        });
      }

      // Check for individual students needing attention
      students.forEach((student) => {
        // Low attention + low dopamine
        if (student.attentionLevel < suggestionsConfig.thresholds.lowAttention && 
            student.neurotransmitters.dopamine < suggestionsConfig.thresholds.lowDopamine) {
          const messages = suggestionsConfig.studentSpecificSuggestions.lowAttentionDopamine;
          const randomMessage = messages[Math.floor(Math.random() * messages.length)];
          newSuggestions.push({
            id: `${student.id}-dopamine-${Date.now()}`,
            type: 'neurotransmitter',
            message: randomMessage.replace('{name}', student.name),
            studentName: student.name,
            icon: 'dopamine',
            action: () => onNeurotransmitter(student.id, 'dopamine', 15),
            status: 'pending' as const,
            timestamp: Date.now(),
          });
        }
        
        // High cortisol (stress)
        if (student.neurotransmitters.cortisol > suggestionsConfig.thresholds.highCortisol) {
          const messages = suggestionsConfig.studentSpecificSuggestions.highStressCortisol;
          const randomMessage = messages[Math.floor(Math.random() * messages.length)];
          newSuggestions.push({
            id: `${student.id}-cortisol-${Date.now()}`,
            type: 'neurotransmitter',
            message: randomMessage.replace('{name}', student.name),
            studentName: student.name,
            icon: 'cortisol',
            action: () => onNeurotransmitter(student.id, 'cortisol', -15),
            status: 'pending' as const,
            timestamp: Date.now(),
          });
        }
        
        // Low serotonin (mood)
        if (student.neurotransmitters.serotonin < suggestionsConfig.thresholds.lowSerotonin) {
          const messages = suggestionsConfig.studentSpecificSuggestions.lowMoodSerotonin;
          const randomMessage = messages[Math.floor(Math.random() * messages.length)];
          newSuggestions.push({
            id: `${student.id}-serotonin-${Date.now()}`,
            type: 'neurotransmitter',
            message: randomMessage.replace('{name}', student.name),
            studentName: student.name,
            icon: 'serotonin',
            action: () => onNeurotransmitter(student.id, 'serotonin', 15),
            status: 'pending' as const,
            timestamp: Date.now(),
          });
        }

        // High glutamate (new category) - using high attention with high cortisol as proxy for glutamate overload
        if (suggestionsConfig.studentSpecificSuggestions.highGlutamate && 
            student.attentionLevel > suggestionsConfig.thresholds.highGlutamate &&
            student.neurotransmitters.cortisol > suggestionsConfig.thresholds.highCortisol) {
          const messages = suggestionsConfig.studentSpecificSuggestions.highGlutamate;
          const randomMessage = messages[Math.floor(Math.random() * messages.length)];
          newSuggestions.push({
            id: `${student.id}-glutamate-${Date.now()}`,
            type: 'neuro',
            message: randomMessage.replace('{name}', student.name),
            studentName: student.name,
            icon: 'brain',
            action: () => onNeurotransmitter(student.id, 'cortisol', -10), // Reduce stress to counter glutamate
            status: 'pending' as const,
            timestamp: Date.now(),
          });
        }
      });

      // Add contextual suggestions to the mix
      newSuggestions.push(...contextualSuggestions);

      // Add new suggestions to existing ones (limit to configured max)
      setSuggestions(prev => [...prev.filter(s => s.status === 'pending'), ...newSuggestions].slice(0, suggestionsConfig.intervals.maxActiveSuggestions));
    };

    // Generate initial suggestions
    generateSuggestions();
    
    // Add new suggestions based on configured interval
    const interval = setInterval(() => {
      if (suggestions.filter(s => s.status === 'pending').length < suggestionsConfig.intervals.maxActiveSuggestions) {
        setIsThinking(true);
        setTimeout(() => {
          generateSuggestions();
          setIsThinking(false);
        }, 1500); // Brief thinking animation
      }
    }, suggestionsConfig.intervals.suggestionGenerationMs);

    return () => clearInterval(interval);
  }, [students, onNeurotransmitter]);

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'dopamine':
        return <Droplet className="size-5 text-blue-500" />;
      case 'serotonin':
        return <Heart className="size-5 text-pink-500" />;
      case 'cortisol':
        return <AlertTriangle className="size-5 text-orange-500" />;
      case 'activity':
        return <Activity className="size-5 text-purple-500" />;
      case 'zap':
        return <Zap className="size-5 text-yellow-500" />;
      case 'target':
        return <Target className="size-5 text-red-500" />;
      case 'users':
        return <Users className="size-5 text-indigo-500" />;
      case 'music':
        return <Music className="size-5 text-green-500" />;
      case 'pause':
        return <Pause className="size-5 text-gray-500" />;
      case 'help-circle':
        return <HelpCircle className="size-5 text-blue-500" />;
      case 'sparkles':
        return <Sparkles className="size-5 text-purple-500" />;
      case 'clipboard-check':
        return <ClipboardCheck className="size-5 text-emerald-500" />;
      case 'brain':
        return <Brain className="size-5 text-pink-500" />;
      case 'wind':
        return <Wind className="size-5 text-cyan-500" />;
      case 'moon':
        return <Moon className="size-5 text-indigo-500" />;
      default:
        return <Sparkles className="size-5 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <motion.div
          animate={isThinking ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 1, repeat: isThinking ? Infinity : 0, ease: "linear" }}
        >
          <Sparkles className="size-5 text-purple-600" />
        </motion.div>
        <h3 className="text-gray-900">
          Sugerencias de IA
          {isThinking && <span className="text-gray-500 ml-2 text-sm">• Analizando...</span>}
        </h3>
      </div>

      {/* Feedback Message */}
      <AnimatePresence>
        {feedbackMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg"
          >
            <div className="flex items-center gap-2 text-green-700">
              <Check className="size-4" />
              <span className="text-sm">{feedbackMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {suggestions.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-8 text-gray-500"
          >
            <Sparkles className="size-8 mx-auto mb-2 text-gray-300" />
            <p>¡Todos los estudiantes están concentrados!</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {suggestions.map((suggestion, idx) => (
              <motion.div
                key={suggestion.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-xl border-2 ${
                  suggestion.type === 'neurotransmitter'
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-purple-50 border-purple-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mt-1"
                  >
                    {getIcon(suggestion.icon)}
                  </motion.div>
                  <div className="flex-1">
                    <p className="text-gray-900 mb-3">{suggestion.message}</p>
                    {suggestion.status === 'pending' && (
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAcceptSuggestion(suggestion)}
                          className="flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1 rounded-lg transition-colors"
                        >
                          <Check className="size-3" />
                          <span className="text-xs">
                            {(suggestion.type === 'neurotransmitter' || suggestion.type === 'neuro') ? 'Sí' : 'Aceptar'}
                          </span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRejectSuggestion(suggestion)}
                          className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1 rounded-lg transition-colors"
                        >
                          <X className="size-3" />
                          <span className="text-xs">
                            {(suggestion.type === 'neurotransmitter' || suggestion.type === 'neuro') ? 'No' : 'Rechazar'}
                          </span>
                        </motion.button>
                      </div>
                    )}
                    {suggestion.status === 'accepted' && (
                      <div className="flex items-center gap-1 text-green-600">
                        <Check className="size-4" />
                        <span className="text-sm">Aplicado</span>
                      </div>
                    )}
                    {suggestion.status === 'rejected' && (
                      <div className="flex items-center gap-1 text-red-600">
                        <X className="size-4" />
                        <span className="text-sm">Rechazado</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}