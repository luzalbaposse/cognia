'use client'

import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { CreateClassroom } from './components/CreateClassroom';
import { SyncDevices } from './components/SyncDevices';
import { ActiveClassroom } from './components/ActiveClassroom';
import { ClassReport } from './components/ClassReport';
import { SpotifyProvider } from './contexts/SpotifyContext';

export type AppState = 'login' | 'dashboard' | 'create-classroom' | 'sync-devices' | 'active-classroom' | 'report';

// Key for localStorage
const APP_STATE_KEY = 'cognia_app_state';

export interface Classroom {
  id: string;
  name: string;
  subject: string;
  schedule: {
    days: string[]; // ['lunes', 'martes', etc.]
    time: string;
  };
  assignedStudents: Array<{
    name: string;
    deviceId: string;
  }>;
  studentCount?: number;
  completed?: boolean;
}

export interface ClassSession {
  id: string;
  classroomId: string;
  date: string;
  topic?: string;
  completed: boolean;
  studentCount?: number;
  averageAttention?: number;
}

export interface Student {
  id: string;
  name: string;
  deviceId: string;
  attentionLevel: number;
  neurotransmitters: {
    dopamine: number;
    serotonin: number;
    cortisol: number;
  };
}

function App() {
  const [appState, setAppState] = useState<AppState>('login');
  const [currentClassroom, setCurrentClassroom] = useState<Classroom | null>(null);
  const [currentSession, setCurrentSession] = useState<ClassSession | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Restore state from localStorage on mount (handles Spotify OAuth redirect)
  useEffect(() => {
    const savedState = localStorage.getItem(APP_STATE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.appState) setAppState(parsed.appState);
        if (parsed.currentClassroom) setCurrentClassroom(parsed.currentClassroom);
        if (parsed.currentSession) setCurrentSession(parsed.currentSession);
        if (parsed.students) setStudents(parsed.students);
        if (parsed.classrooms) setClassrooms(parsed.classrooms);
        if (parsed.sessions) setSessions(parsed.sessions);
      } catch (e) {
        console.error('Failed to restore app state:', e);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save state to localStorage whenever it changes (after hydration)
  useEffect(() => {
    if (!isHydrated) return;
    
    const stateToSave = {
      appState,
      currentClassroom,
      currentSession,
      students,
      classrooms,
      sessions,
    };
    localStorage.setItem(APP_STATE_KEY, JSON.stringify(stateToSave));
  }, [isHydrated, appState, currentClassroom, currentSession, students, classrooms, sessions]);

  const handleLogin = () => {
    setAppState('dashboard');
  };

  const handleCreateClassroom = (classroom: Classroom) => {
    setClassrooms([...classrooms, classroom]);
    // Automatically start a session when creating a new classroom
    const newSession: ClassSession = {
      id: Date.now().toString(),
      classroomId: classroom.id,
      date: new Date().toLocaleDateString('es-AR'),
      topic: '',
      completed: false,
    };
    setCurrentSession(newSession);
    setCurrentClassroom(classroom);
    setAppState('sync-devices');
  };

  const handleStartSession = (classroom: Classroom, topic?: string) => {
    const newSession: ClassSession = {
      id: Date.now().toString(),
      classroomId: classroom.id,
      date: new Date().toLocaleDateString('es-AR'),
      topic: topic || '',
      completed: false,
    };
    setCurrentSession(newSession);
    setCurrentClassroom(classroom);
    setAppState('sync-devices');
  };

  const handleDevicesSynced = (syncedStudents: Student[]) => {
    setStudents(syncedStudents);
    setAppState('active-classroom');
  };

  const handleFinalizeClass = () => {
    if (currentSession && currentClassroom) {
      const avgAttention = students.reduce((sum, s) => sum + s.attentionLevel, 0) / students.length;
      const completedSession: ClassSession = {
        ...currentSession,
        completed: true,
        studentCount: students.length,
        averageAttention: avgAttention,
      };
      setSessions([completedSession, ...sessions]);
    }
    setAppState('report');
  };

  const handleBackToDashboard = () => {
    setCurrentClassroom(null);
    setCurrentSession(null);
    setStudents([]);
    setAppState('dashboard');
  };

  const handleLogout = () => {
    // Clear all state and localStorage
    localStorage.removeItem(APP_STATE_KEY);
    setAppState('login');
    setCurrentClassroom(null);
    setCurrentSession(null);
    setStudents([]);
    setClassrooms([]);
    setSessions([]);
  };

  // Show nothing until hydrated to avoid flash of login screen
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <SpotifyProvider>
      <div className="min-h-screen">
        {appState === 'login' && <LoginPage onLogin={handleLogin} />}
        {appState === 'dashboard' && (
          <Dashboard
            onCreateClassroom={() => setAppState('create-classroom')}
            onStartSession={handleStartSession}
            classrooms={classrooms}
            sessions={sessions}
          />
        )}
        {appState === 'create-classroom' && (
          <CreateClassroom
            onBack={() => setAppState('dashboard')}
            onCreate={handleCreateClassroom}
          />
        )}
        {appState === 'sync-devices' && currentClassroom && (
          <SyncDevices
            classroom={currentClassroom}
            onBack={() => setAppState('dashboard')}
            onSynced={handleDevicesSynced}
          />
        )}
        {appState === 'active-classroom' && currentClassroom && (
          <ActiveClassroom
            classroom={currentClassroom}
            students={students}
            onStudentsUpdate={setStudents}
            onFinalize={handleFinalizeClass}
          />
        )}
        {appState === 'report' && currentClassroom && (
          <ClassReport
            classroom={currentClassroom}
            students={students}
            onBackToDashboard={handleBackToDashboard}
          />
        )}
      </div>
    </SpotifyProvider>
  );
}

export default App;