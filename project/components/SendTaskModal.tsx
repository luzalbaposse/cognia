'use client'

import { useState } from 'react';
import { X, Send, CheckCircle, Plus, Minus, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Student } from '../App';

interface SendTaskModalProps {
  students: Student[];
  onClose: () => void;
}

export function SendTaskModal({ students, onClose }: SendTaskModalProps) {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskType, setTaskType] = useState<'texto' | 'quiz' | 'multiple'>('texto');
  const [questions, setQuestions] = useState<string[]>(['']);
  const [answers, setAnswers] = useState<string[][]>([['', '', '', '']]);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([0]);
  const [sent, setSent] = useState(false);

  const addQuestion = () => {
    setQuestions([...questions, '']);
    setAnswers([...answers, ['', '', '', '']]);
    setCorrectAnswers([...correctAnswers, 0]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
      setAnswers(answers.filter((_, i) => i !== index));
      setCorrectAnswers(correctAnswers.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const updateAnswer = (questionIndex: number, answerIndex: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex][answerIndex] = value;
    setAnswers(newAnswers);
  };

  const setCorrectAnswer = (questionIndex: number, answerIndex: number) => {
    const newCorrectAnswers = [...correctAnswers];
    newCorrectAnswers[questionIndex] = answerIndex;
    setCorrectAnswers(newCorrectAnswers);
  };

  const handleSend = () => {
    let isValid = false;
    
    if (taskType === 'texto') {
      isValid = taskTitle && taskDescription;
    } else if (taskType === 'quiz') {
      isValid = taskTitle && questions[0];
    } else if (taskType === 'multiple') {
      isValid = taskTitle && questions.every(q => q && answers[questions.indexOf(q)].some(a => a.trim()));
    }
    
    if (isValid) {
      setSent(true);
      setTimeout(() => {
        onClose();
      }, 2000);
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
        className="bg-white rounded-3xl max-w-lg w-full p-8"
      >
        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-gray-900">Enviar Tarea a Estudiantes</h3>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="size-6" />
                </motion.button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2">Título de la Tarea</label>
                  <input
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0077FF] transition-all"
                    placeholder="ej., Examen Capítulo 5"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Tipo de Tarea</label>
                  <div className="flex gap-2">
                    {[
                      { id: 'texto', label: 'Texto Libre' },
                      { id: 'quiz', label: 'Pregunta Abierta' },
                      { id: 'multiple', label: 'Múltiple Opción' }
                    ].map((type) => (
                      <motion.button
                        key={type.id}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setTaskType(type.id as any)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          taskType === type.id
                            ? 'bg-[#0077FF] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {type.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {taskType === 'texto' && (
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Descripción de la Tarea
                    </label>
                    <textarea
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0077FF] resize-none transition-all"
                      rows={4}
                      placeholder="Describe la tarea..."
                    />
                  </div>
                )}

                {taskType === 'quiz' && (
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Pregunta Abierta
                    </label>
                    <textarea
                      value={questions[0]}
                      onChange={(e) => updateQuestion(0, e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0077FF] resize-none transition-all"
                      rows={3}
                      placeholder="¿Cuáles son los principales neurotransmisores?"
                    />
                  </div>
                )}

                {taskType === 'multiple' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-gray-700">Preguntas de Múltiple Opción</label>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={addQuestion}
                        className="flex items-center gap-1 px-3 py-1 bg-[#0077FF] text-white rounded-lg hover:bg-blue-600"
                      >
                        <Plus className="size-4" />
                        Agregar
                      </motion.button>
                    </div>
                    
                    <div className="space-y-4 max-h-64 overflow-y-auto">
                      {questions.map((question, qIndex) => (
                        <motion.div
                          key={qIndex}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border border-gray-200 rounded-xl p-4"
                        >
                          <div className="flex items-start gap-2 mb-3">
                            <GripVertical className="size-5 text-gray-400 mt-1" />
                            <div className="flex-1">
                              <input
                                type="text"
                                value={question}
                                onChange={(e) => updateQuestion(qIndex, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0077FF]"
                                placeholder={`Pregunta ${qIndex + 1}`}
                              />
                            </div>
                            {questions.length > 1 && (
                              <motion.button
                                type="button"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => removeQuestion(qIndex)}
                                className="p-1 text-red-500 hover:bg-red-50 rounded"
                              >
                                <Minus className="size-4" />
                              </motion.button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            {answers[qIndex]?.map((answer, aIndex) => (
                              <div key={aIndex} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`correct-${qIndex}`}
                                  checked={correctAnswers[qIndex] === aIndex}
                                  onChange={() => setCorrectAnswer(qIndex, aIndex)}
                                  className="text-[#0077FF]"
                                />
                                <input
                                  type="text"
                                  value={answer}
                                  onChange={(e) => updateAnswer(qIndex, aIndex, e.target.value)}
                                  className="flex-1 px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#0077FF]"
                                  placeholder={`Opción ${aIndex + 1}`}
                                />
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-gray-600 mb-2">
                    Enviando a {students.length} estudiantes
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {students.map((student, idx) => (
                      <motion.div
                        key={student.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white px-3 py-1 rounded-full border border-gray-200"
                      >
                        <span className="text-gray-700">{student.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSend}
                disabled={!taskTitle || (taskType === 'texto' && !taskDescription) || (taskType === 'quiz' && !questions[0]) || (taskType === 'multiple' && !questions.every(q => q))}
                className="w-full bg-[#0077FF] hover:bg-blue-600 disabled:hover:bg-[#0077FF] text-white py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send className="size-5" />
                Enviar Tarea a Dispositivos
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center size-16 bg-green-100 rounded-full mb-4"
              >
                <CheckCircle className="size-8 text-green-600" />
              </motion.div>
              <h3 className="text-gray-900 mb-2">¡Tarea Enviada Exitosamente!</h3>
              <p className="text-gray-600">
                Todos los dispositivos de estudiantes recibieron la tarea
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}