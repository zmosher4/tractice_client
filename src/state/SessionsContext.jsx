import { createContext, useContext, useEffect, useState } from 'react';
import {
  deleteSession,
  getPracticeSessions,
} from '../managers/practiceSessionManager';

const SessionsContext = createContext();

export const SessionsProvider = ({ children }) => {
  const [mySessions, setMySessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const getSessions = async () => {
    const sessionData = await getPracticeSessions();
    const userId = JSON.parse(localStorage.getItem('token')).id;
    const filteredSessions = sessionData.filter(
      (s) => s.show?.user?.id === userId
    );
    setMySessions(filteredSessions);
    setLoading(false);
  };

  const handleDeleteSession = async (sessionId) => {
    await deleteSession(sessionId);
    await getSessions();
  };
  useEffect(() => {
    getSessions();
  }, []);

  return (
    <SessionsContext.Provider
      value={{ mySessions, loading, handleDeleteSession, getSessions }}
    >
      {children}
    </SessionsContext.Provider>
  );
};

export const useSessions = () => {
  return useContext(SessionsContext);
};
