import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  deleteSession,
  getSessionById,
} from '../managers/practiceSessionManager';
import { getShowById } from '../managers/showManager';
import { getAllShowSongs } from '../managers/showSongManager';

export const SessionDetails = () => {
  const [setList, setSetList] = useState([]);
  const [show, setShow] = useState({});
  const [session, setSession] = useState({});
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const getSession = async () => {
    const sessionData = await getSessionById(parseInt(sessionId));
    setSession(sessionData);
  };

  const getShowSongs = async () => {
    const showSongData = await getAllShowSongs();
    const filteredShowSongs = showSongData.filter(
      (showSong) => showSong.show?.id === session?.show?.id
    );
    setSetList(filteredShowSongs);
  };

  useEffect(() => {
    getSession();
  }, [sessionId]);

  useEffect(() => {
    if (session?.show?.id) {
      getShowSongs(session.show.id);
    }
  }, [session]);

  const handleDeleteSession = async (sessionId) => {
    const showId = session.show?.id;
    await deleteSession(sessionId);
    navigate(`/show/${showId}`);
  };

  const renderedSetList = setList.map((showSong) => {
    return (
      <li
        className="list-disc ml-6 mb-2 text-lg text-gray-700"
        key={showSong.id}
      >
        {showSong.song.title}
      </li>
    );
  });

  const readableShowDate = new Date(
    session.show?.performance_date
  ).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const readableSessionDate = new Date(session.session_date).toLocaleString(
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
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 mb-6 text-center">
        <h1 className="text-4xl font-semibold text-gray-800 mb-4">
          Show: {session?.show?.description}
        </h1>
        <p className="text-lg text-gray-600">
          Show Date: <span className="font-medium">{readableShowDate}</span>
        </p>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Setlist</h2>
        <ul className="list-inside space-y-2">{renderedSetList}</ul>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 mb-6">
        <p className="text-lg text-gray-600 mb-2">
          Session Date:{' '}
          <span className="font-medium">{readableSessionDate}</span>
        </p>
        <p className="text-lg text-gray-600">Session Notes: {session.notes}</p>
      </div>

      <div className="flex space-x-4 mt-4">
        <Link
          className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition"
          to={`/edit-session/${session.id}`}
        >
          Edit
        </Link>
        <button
          className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600 transition"
          onClick={() => handleDeleteSession(session.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};
