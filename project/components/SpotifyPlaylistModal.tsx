'use client'

import { useState } from 'react';
import { X, Play, Pause, Music2, Headphones, Brain, Coffee, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpotify } from '../contexts/SpotifyContext';
import { Student } from '../App';

interface SpotifyPlaylistModalProps {
  student: Student;
  onClose: () => void;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  uri: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const PREDEFINED_PLAYLISTS: Playlist[] = [
  {
    id: 'focus',
    name: 'Deep Focus',
    description: 'Música para concentración profunda',
    uri: 'spotify:playlist:37i9dQZF1DWZeKCadgRdKQ',
    icon: <Brain className="size-6" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 hover:bg-blue-100',
  },
  {
    id: 'calm',
    name: 'Peaceful Piano',
    description: 'Piano relajante para reducir estrés',
    uri: 'spotify:playlist:37i9dQZF1DX4sWSpwq3LiO',
    icon: <Sparkles className="size-6" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 hover:bg-purple-100',
  },
  {
    id: 'lofi',
    name: 'Lo-Fi Beats',
    description: 'Beats relajantes para estudiar',
    uri: 'spotify:playlist:37i9dQZF1DWWQRwui0ExPn',
    icon: <Headphones className="size-6" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 hover:bg-orange-100',
  },
  {
    id: 'classical',
    name: 'Classical Focus',
    description: 'Música clásica para el estudio',
    uri: 'spotify:playlist:37i9dQZF1DWV0gynK7G6pD',
    icon: <Music2 className="size-6" />,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 hover:bg-emerald-100',
  },
  {
    id: 'nature',
    name: 'Nature Sounds',
    description: 'Sonidos de la naturaleza',
    uri: 'spotify:playlist:37i9dQZF1DX4PP3DA4J0N8',
    icon: <Coffee className="size-6" />,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50 hover:bg-teal-100',
  },
];

export function SpotifyPlaylistModal({ student, onClose }: SpotifyPlaylistModalProps) {
  const { isAuthenticated, isReady, isPlaying, currentTrack, play, pause, resume } = useSpotify();
  const [playingPlaylistId, setPlayingPlaylistId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlayPlaylist = async (playlist: Playlist) => {
    if (!isAuthenticated || !isReady) {
      return;
    }

    setIsLoading(true);
    try {
      if (playingPlaylistId === playlist.id && isPlaying) {
        await pause();
        setPlayingPlaylistId(null);
      } else {
        await play(playlist.uri, student.id);
        setPlayingPlaylistId(playlist.id);
      }
    } catch (error) {
      console.error('Error playing playlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResume = async () => {
    await resume();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1DB954] to-[#1ed760] p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ duration: 3, repeat: isPlaying ? Infinity : 0, ease: 'linear' }}
                  className="bg-white/20 p-3 rounded-full"
                >
                  <Music2 className="size-6 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-white font-semibold text-lg">Música para {student.name}</h2>
                  <p className="text-white/80 text-sm">Selecciona una playlist</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
              >
                <X className="size-5 text-white" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {!isAuthenticated ? (
              <div className="text-center py-8">
                <Music2 className="size-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Spotify no conectado</p>
                <p className="text-gray-400 text-sm">
                  Conecta Spotify desde el panel de Acciones Rápidas
                </p>
              </div>
            ) : !isReady ? (
              <div className="text-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="size-12 border-4 border-[#1DB954] border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="text-gray-600">Conectando con Spotify...</p>
              </div>
            ) : (
              <>
                {/* Currently Playing */}
                {currentTrack && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      {currentTrack.albumArt && (
                        <img
                          src={currentTrack.albumArt}
                          alt="Album art"
                          className="size-14 rounded-lg shadow-md"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{currentTrack.name}</p>
                        <p className="text-sm text-gray-500 truncate">
                          {currentTrack.artists.join(', ')}
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => isPlaying ? pause() : handleResume()}
                        className="bg-[#1DB954] hover:bg-[#1ed760] text-white p-3 rounded-full shadow-lg"
                      >
                        {isPlaying ? <Pause className="size-5" /> : <Play className="size-5" />}
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Playlists */}
                <div className="space-y-3">
                  {PREDEFINED_PLAYLISTS.map((playlist, index) => (
                    <motion.button
                      key={playlist.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePlayPlaylist(playlist)}
                      disabled={isLoading}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${playlist.bgColor} group`}
                    >
                      <div className={`p-3 rounded-xl bg-white shadow-sm ${playlist.color}`}>
                        {playlist.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-900">{playlist.name}</p>
                        <p className="text-sm text-gray-500">{playlist.description}</p>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className={`p-2 rounded-full ${
                          playingPlaylistId === playlist.id && isPlaying
                            ? 'bg-[#1DB954] text-white'
                            : 'bg-white text-gray-600 group-hover:text-[#1DB954]'
                        } shadow-sm transition-colors`}
                      >
                        {playingPlaylistId === playlist.id && isPlaying ? (
                          <Pause className="size-5" />
                        ) : (
                          <Play className="size-5" />
                        )}
                      </motion.div>
                    </motion.button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-center text-xs text-gray-400">
              Powered by Spotify • Requiere cuenta Premium
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

