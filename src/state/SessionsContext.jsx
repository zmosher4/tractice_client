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
      //if no user data, return early
      const tokenData = localStorage.getItem('token');
      if (!tokenData) {
        setLoading(false);
        return;
      }

      //fetch all sessions from database, then set state based on the sessions that belong to the logged in user
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
      //delete session from database
      await deleteSession(sessionId);
      //ensure the deleted session is removed from local state and reset state
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
  //fetch and set sessions on initial render
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
