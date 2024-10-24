import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteShow, getShowById } from '../managers/showManager';
import { getPracticeSessions } from '../managers/practiceSessionManager';
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
      <div key={s.id}>
        <Link to={`/session/${s.id}`}>
          <div>Session Date: {readableSessionDate}</div>
          <div>Session Notes: {s.notes}</div>
        </Link>
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
        <h1>Practice sessions for this show:</h1>
        {renderedSessionList}
      </div>
      <div className="flex justify-center items-center mt-6">
        <Link to={`/session/${showId}/create`}>
          Create a Practice session for this show
        </Link>
      </div>
    </>
  );
};
