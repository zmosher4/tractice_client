import { createContext, useContext, useEffect, useState } from 'react';
import {
  deleteSession,
  getPracticeSessions,
} from '../managers/practiceSessionManager';

const SessionsContext = createContext();

export const SessionsProvider = ({ children }) => {
  const [mySessions, setMySessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const tokenData = localStorage.getItem('token');
      if (!tokenData) {
        setLoading(false);
        return;
      }

      const sessionData = await getPracticeSessions();
      const userId = JSON.parse(tokenData).id;
      const filteredSessions = sessionData.filter(
        (s) => s.show?.user?.id === userId
      );
      setMySessions(filteredSessions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      setLoading(true);
      await deleteSession(sessionId);
      setMySessions((prev) =>
        prev.filter((session) => session.id !== sessionId)
      );
      await getSessions();
    } catch (err) {
      setError(err.message);
      await getSessions();
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getSessions();
  }, []);

  return (
    <SessionsContext.Provider
      value={{
        mySessions,
        loading,
        handleDeleteSession,
        getSessions,
        error,
        refreshSessions: getSessions,
      }}
    >
      {children}
    </SessionsContext.Provider>
  );
};

export const useSessions = () => {
  return useContext(SessionsContext);
};
