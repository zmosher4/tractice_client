import { useEffect, useState } from 'react';
import { getPracticeSessions } from '../managers/practiceSessionManager';
import { getAllShowSongs } from '../managers/showSongManager';
import { Link } from 'react-router-dom';

export const Sessions = () => {
  const [mySessions, setMySessions] = useState([]);

  const getSessions = async () => {
    const sessionData = await getPracticeSessions();
    const filteredSessions = sessionData.filter(
      (s) => s.show?.user?.id === JSON.parse(localStorage.getItem('token')).id
    );
    setMySessions(filteredSessions);
  };

  useEffect(() => {
    getSessions();
  }, []);

  const renderedSessions = mySessions.map((s) => {
    const readableShowDate = new Date(s.show?.performance_date).toLocaleString(
      'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }
    );
    const readableSessionDate = new Date(s.session_date).toLocaleString(
      'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }
    );
    return (
      <div key={s.id}>
        <Link to={`/session/${s.id}`}>
          <div>Show Date: {readableShowDate}</div>
          <div>Artist: {s.show?.artist?.name}</div>
          <div>Session Date: {readableSessionDate}</div>
          <div>Notes: {s.notes}</div>
        </Link>
      </div>
    );
  });
  return renderedSessions;
};
