import { useEffect, useState } from 'react';
import {
  deleteSession,
  getPracticeSessions,
} from '../managers/practiceSessionManager';
import { Link } from 'react-router-dom';
import { useShows } from '../state/ShowsContext';

export const Sessions = () => {
  const [mySessions, setMySessions] = useState([]);
  const { myShows, getMyShows } = useShows();
  const [loading, setLoading] = useState(true);

  const getSessions = async () => {
    const sessionData = await getPracticeSessions();
    const filteredSessions = sessionData.filter(
      (s) => s.show?.user?.id === JSON.parse(localStorage.getItem('token')).id
    );
    setMySessions(filteredSessions);
    setLoading(false);
  };

  useEffect(() => {
    getMyShows();
  }, []);

  useEffect(() => {
    getSessions();
  }, []);

  const handleDeleteSession = async (sessionId) => {
    await deleteSession(sessionId);
    getSessions();
  };

  // Moved `renderedShows` outside of `renderedSessions` to make it accessible in the return block
  const renderedShows = myShows.map((show) => {
    const readableDate = new Date(show.performance_date).toLocaleString(
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
      <div
        className="m-4 border border-gray-700 shadow-md rounded w-[20rem] p-4"
        key={show.id}
      >
        <div>
          <div>{show.description}</div>
          <div>{readableDate}</div>
          <div>Artist: {show.artist.name}</div>
        </div>
        <Link
          className="border rounded border-gray-500 px-2"
          to={`/session/${show.id}/create`}
        >
          New Session
        </Link>
      </div>
    );
  });

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
      <div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="m-4 border border-gray-700 shadow-md rounded w-[20rem] p-4 hover:translate-y-0.5 transition-transform key={s.id}">
            <Link to={`/session/${s.id}`}>
              <div className="text-lg p-2">
                Show Info: {s.show?.description}
              </div>
              <div className="text-lg p-2">Show Date: {readableShowDate}</div>
              <div className="text-lg p-2">Artist: {s.show?.artist?.name}</div>
              <div className="text-lg p-2">
                Session Date: {readableSessionDate}
              </div>
              <div className="text-lg p-2">Notes: {s.notes}</div>
            </Link>
            <Link
              className=" border rounded border-gray-500 px-2 inline-block m-4 text-lg"
              to={`/edit-session/${s.id}`}
            >
              Edit{' '}
            </Link>
            <button
              className=" border rounded border-gray-500 px-2 inline-block m-4 text-lg"
              onClick={() => handleDeleteSession(s.id)}
            >
              {' '}
              Delete
            </button>
          </div>
        )}
      </div>
    );
  });

  return (
    <div className="space-y-24">
      <h1 className="flex justify-center items-center text-4xl font-bold">
        My Sessions
      </h1>

      {loading ? (
        <div className="flex justify-center items-center text-2xl">
          Loading sessions...
        </div>
      ) : (
        <>
          {renderedSessions.length > 0 ? (
            renderedSessions
          ) : (
            <div className="flex flex-col justify-center items-center text-2xl">
              <p>
                No sessions yet. Create a show to make sessions
                <Link className="ml-1.5 text-blue-400" to="/new-show">
                  here
                </Link>
              </p>
              {myShows.length > 0 && (
                <div className="flex flex-col items-center text-xl mt-4">
                  <p>Or choose from your shows below to create a session</p>
                  <div className="flex items-center">{renderedShows}</div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
