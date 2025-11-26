'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// Spotify Web Playback SDK types
declare global {
  interface Window {
    Spotify: {
      Player: new (options: {
        name: string;
        getOAuthToken: (cb: (token: string) => void) => void;
        volume?: number;
      }) => SpotifyPlayer;
    };
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

interface SpotifyPlayer {
  connect: () => Promise<boolean>;
  disconnect: () => void;
  addListener: (event: string, callback: (state: any) => void) => void;
  removeListener: (event: string, callback?: (state: any) => void) => void;
  getCurrentState: () => Promise<any>;
  setName: (name: string) => Promise<void>;
  getVolume: () => Promise<number>;
  setVolume: (volume: number) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  togglePlay: () => Promise<void>;
  seek: (position_ms: number) => Promise<void>;
  previousTrack: () => Promise<void>;
  nextTrack: () => Promise<void>;
  activateElement: () => Promise<void>;
}

interface SpotifyContextType {
  isAuthenticated: boolean;
  isReady: boolean;
  deviceId: string | null;
  currentTrack: SpotifyTrack | null;
  isPlaying: boolean;
  login: () => void;
  logout: () => void;
  play: (uri: string, studentId?: string) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  getAccessToken: () => string | null;
}

interface SpotifyTrack {
  name: string;
  artists: string[];
  albumArt: string;
  duration: number;
  position: number;
}

const SpotifyContext = createContext<SpotifyContextType | null>(null);

const SPOTIFY_SCOPES = [
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-read-playback-state',
  'user-modify-playback-state',
].join(' ');

export function SpotifyProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [player, setPlayer] = useState<SpotifyPlayer | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Check for token in URL hash on mount (OAuth callback)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get('access_token');
      if (token) {
        setAccessToken(token);
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  // Load Spotify Web Playback SDK
  useEffect(() => {
    if (!accessToken) return;

    // Check if script already exists
    if (document.getElementById('spotify-sdk')) {
      if (window.Spotify) {
        initializePlayer();
      }
      return;
    }

    const script = document.createElement('script');
    script.id = 'spotify-sdk';
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    window.onSpotifyWebPlaybackSDKReady = () => {
      initializePlayer();
    };

    document.body.appendChild(script);

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [accessToken]);

  const initializePlayer = useCallback(() => {
    if (!accessToken || !window.Spotify) return;

    const spotifyPlayer = new window.Spotify.Player({
      name: 'Cognia Classroom Player',
      getOAuthToken: (cb) => cb(accessToken),
      volume: 0.5,
    });

    // Error handling
    spotifyPlayer.addListener('initialization_error', ({ message }) => {
      console.error('Spotify initialization error:', message);
    });

    spotifyPlayer.addListener('authentication_error', ({ message }) => {
      console.error('Spotify authentication error:', message);
      setAccessToken(null);
    });

    spotifyPlayer.addListener('account_error', ({ message }) => {
      console.error('Spotify account error:', message);
    });

    spotifyPlayer.addListener('playback_error', ({ message }) => {
      console.error('Spotify playback error:', message);
    });

    // Ready
    spotifyPlayer.addListener('ready', ({ device_id }) => {
      console.log('Spotify Player ready with Device ID:', device_id);
      setDeviceId(device_id);
      setIsReady(true);
    });

    // Not Ready
    spotifyPlayer.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline:', device_id);
      setIsReady(false);
    });

    // Player state changed
    spotifyPlayer.addListener('player_state_changed', (state) => {
      if (!state) {
        setCurrentTrack(null);
        setIsPlaying(false);
        return;
      }

      const track = state.track_window.current_track;
      setCurrentTrack({
        name: track.name,
        artists: track.artists.map((a: { name: string }) => a.name),
        albumArt: track.album.images[0]?.url || '',
        duration: track.duration_ms,
        position: state.position,
      });
      setIsPlaying(!state.paused);
    });

    spotifyPlayer.connect();
    setPlayer(spotifyPlayer);
  }, [accessToken]);

  const login = useCallback(() => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || window.location.origin;

    if (!clientId) {
      console.error('Spotify Client ID not configured');
      alert('Error: Spotify Client ID no configurado. Por favor configura NEXT_PUBLIC_SPOTIFY_CLIENT_ID en .env.local');
      return;
    }

    const authUrl = new URL('https://accounts.spotify.com/authorize');
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('response_type', 'token');
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('scope', SPOTIFY_SCOPES);
    authUrl.searchParams.append('show_dialog', 'true');

    window.location.href = authUrl.toString();
  }, []);

  const logout = useCallback(() => {
    if (player) {
      player.disconnect();
    }
    setAccessToken(null);
    setPlayer(null);
    setDeviceId(null);
    setIsReady(false);
    setCurrentTrack(null);
    setIsPlaying(false);
  }, [player]);

  const play = useCallback(async (uri: string, studentId?: string) => {
    if (!accessToken || !deviceId) {
      console.error('Cannot play: not authenticated or no device');
      return;
    }

    try {
      // Determine if it's a playlist or track
      const isPlaylist = uri.includes('playlist');
      const body = isPlaylist
        ? { context_uri: uri }
        : { uris: [uri] };

      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      console.log(`Playing ${uri} for student ${studentId || 'all'}`);
    } catch (error) {
      console.error('Error playing:', error);
    }
  }, [accessToken, deviceId]);

  const pause = useCallback(async () => {
    if (player) {
      await player.pause();
    }
  }, [player]);

  const resume = useCallback(async () => {
    if (player) {
      await player.resume();
    }
  }, [player]);

  const getAccessToken = useCallback(() => accessToken, [accessToken]);

  const value: SpotifyContextType = {
    isAuthenticated: !!accessToken,
    isReady,
    deviceId,
    currentTrack,
    isPlaying,
    login,
    logout,
    play,
    pause,
    resume,
    getAccessToken,
  };

  return (
    <SpotifyContext.Provider value={value}>
      {children}
    </SpotifyContext.Provider>
  );
}

export function useSpotify() {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
}

