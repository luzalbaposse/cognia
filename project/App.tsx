'use client'

import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { CreateClassroom } from './components/CreateClassroom';
import { SyncDevices } from './components/SyncDevices';
import { ActiveClassroom } from './components/ActiveClassroom';
import { ClassReport } from './components/ClassReport';

export type AppState = 'login' | 'dashboard' | 'create-classroom' | 'sync-devices' | 'active-classroom' | 'report';

export interface Classroom {
  id: string;
  name: string;
  subject: string;
  schedule: {
    days: string[]; // ['lunes', 'martes', etc.]
    time: string;
  };
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

  return (
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
  );
}

export default App;