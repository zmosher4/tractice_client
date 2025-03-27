import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteShow, getShowById } from '../managers/showManager';
import {
  deleteSession,
  getPracticeSessions,
} from '../managers/practiceSessionManager';
import { useSessions } from '../state/SessionsContext';

export const ShowDetails = () => {
  const [show, setShow] = useState();
  const { showId } = useParams();
  const navigate = useNavigate();
  const [showSessions, setShowSessions] = useState([]);
  const { mySessions } = useSessions();

  //fetch a specific show based on the url the user is on
  const getShow = async () => {
    const data = await getShowById(parseInt(showId));
    setShow(data);
  };

  //since sessions have a show id foreign key, get all the sessions that have the current shows id
  const getShowSessions = () => {
    const filteredSessions = mySessions.filter(
      (session) => session.show?.id === parseInt(showId)
    );
    setShowSessions(filteredSessions);
  };

  //fetch and set current show and session state on initial render
  useEffect(() => {
    getShow();
    getShowSessions();
  }, []);

  //deleting the show the user is currently viewing
  const handleDelete = async (id) => {
    await deleteShow(id);
    navigate('/');
  };

  //deleting a session listed under show details
  const handleDeleteSession = async (sessionId) => {
    await deleteSession(sessionId);
    getShowSessions();
  };

  //taking the performance date from database and turning it into a readable string for the user
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

  //rendering out the sessions assinged the the show the user is viewing
  const renderedSessionList = showSessions.map((s) => {
    //making the session date readable
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
    <div className="flex flex-col items-center p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Show Details
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8 w-full max-w-2xl">
        <div className="flex justify-between text-2xl text-gray-700 mb-4">
          <span>Show Date:</span>
          <span className="font-semibold">{readableDate}</span>
        </div>
        <div className="flex justify-between text-2xl text-gray-700 mb-4">
          <span>Artist:</span>
          <span className="font-semibold">{show?.artist.name}</span>
        </div>
        <div className="flex justify-between text-2xl text-gray-700 mb-4">
          <span>Description:</span>
          <span className="font-semibold">{show?.description}</span>
        </div>
      </div>

      <div className="flex justify-center items-center space-x-4 mb-8">
        <Link
          className="bg-blue-600 text-white rounded-lg px-6 py-2 hover:bg-blue-500 transition duration-300"
          to={`/edit-show/${show?.id}`}
        >
          Edit
        </Link>
        <button
          className="bg-red-600 text-white rounded-lg px-6 py-2 hover:bg-red-500 transition duration-300"
          onClick={() => handleDelete(show.id)}
        >
          Delete
        </button>
      </div>

      {renderedSessionList.length > 0 && (
        <div className="flex flex-col items-center mb-8">
          <p className="text-2xl text-gray-800 mb-4">
            Practice sessions for this show:
          </p>
          <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-2xl">
            {renderedSessionList}
          </div>
        </div>
      )}

      <div className="text-lg border rounded border-gray-500 px-4 py-3 bg-gray-100 w-full max-w-2xl text-center">
        Create a New Practice session for this show{' '}
        <Link
          className="text-blue-600 hover:text-blue-500"
          to={`/session/${showId}/create`}
        >
          here
        </Link>
      </div>
    </div>
  );
};
