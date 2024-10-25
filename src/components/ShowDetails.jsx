import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteShow, getShowById } from '../managers/showManager';
import {
  deleteSession,
  getPracticeSessions,
} from '../managers/practiceSessionManager';
import { Sessions } from './Sessions';

export const ShowDetails = () => {
  const [show, setShow] = useState();
  const { showId } = useParams();
  const navigate = useNavigate();
  const [showSessions, setShowSessions] = useState([]);

  const getShow = async () => {
    const data = await getShowById(parseInt(showId));
    setShow(data);
  };

  const getShowSessions = async () => {
    const allSessions = await getPracticeSessions();
    const filteredSessions = allSessions.filter(
      (session) => session.show?.id === parseInt(showId)
    );
    setShowSessions(filteredSessions);
  };

  useEffect(() => {
    getShow();
    getShowSessions();
  }, []);

  const handleDelete = async (id) => {
    await deleteShow(id);
    navigate('/');
  };

  const handleDeleteSession = async (sessionId) => {
    await deleteSession(sessionId);
    getShowSessions();
  };

  const readableDate = show?.performance_date
    ? new Date(show.performance_date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : 'Loading...';

  const renderedSessionList = showSessions.map((s) => {
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
      <div
        className="m-4 border rounded border-gray-600 shadow-md w-[20rem] p-4 hover:shadow-lg transition-shadow"
        key={s.id}
      >
        <Link
          to={`/session/${s.id}`}
          className="block text-lg font-semibold mb-2 text-blue-600 hover:underline"
        >
          Session Date: {readableSessionDate}
        </Link>
        <div className="text-gray-600 mb-2">Session Notes: {s.notes}</div>
        <div className="flex justify-end space-x-3">
          <Link
            className="border rounded border-gray-500 px-2 py-1 hover:bg-blue-500 hover:text-white transition"
            to={`/edit-session/${s.id}`}
          >
            Edit
          </Link>
          <button
            className="border rounded border-red-500 px-2 py-1 text-red-500 hover:bg-red-500 hover:text-white transition"
            onClick={() => handleDeleteSession(s.id)}
          >
            Delete
          </button>
        </div>
      </div>
    );
  });

  return (
    <>
      <h1 className="text-4xl flex justify-center items-center">
        Show Details
      </h1>
      <div className="flex justify-center items-center text-2xl m-4">
        Show Date: {readableDate}
      </div>
      <div className="flex justify-center items-center text-2xl m-4">
        Artist: {show?.artist.name}
      </div>
      <div className="flex justify-center items-center text-2xl m-4">
        Description: {show?.description}
      </div>
      <div className="flex justify-center items-center space-x-3 text-lg">
        <Link
          className="border rounded border-gray-500 px-2"
          to={`/edit-show/${show?.id}`}
        >
          Edit{' '}
        </Link>
        <button
          className="border rounded border-gray-500 px-2"
          onClick={() => handleDelete(show.id)}
        >
          {' '}
          Delete
        </button>
      </div>
      <div>
        {renderedSessionList.length > 0 && (
          <div className="flex justify-center items-center flex-col">
            <p className="text-2xl m-4 mt-32">
              Practice sessions for this show:
            </p>
            {renderedSessionList}
          </div>
        )}
      </div>
      <div className="flex justify-center items-center mt-6">
        <div className="text-lg border rounded border-gray-500 px-2 inline-block">
          Create a New Practice session for this show{' '}
          <Link className="text-blue-500" to={`/session/${showId}/create`}>
            here
          </Link>
        </div>
      </div>
    </>
  );
};
