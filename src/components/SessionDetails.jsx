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
        className="list-disc justify-center items-center ml-10"
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
    <div className="flex flex-col items-center">
      <div className="text-4xl w-full max-w-xl flex items-center mb-7">
        Show: {session?.show?.description}
      </div>
      <div className="w-full max-w-xl flex items-start text-2xl m-4">
        Show Date: {readableShowDate}
      </div>
      <div className="w-full max-w-xl flex items-start text-2xl m-4">
        Setlist:
      </div>
      <div className="w-full max-w-xl flex items-start text-2xl m-4 flex-col">
        {renderedSetList}
      </div>
      <div className="w-full max-w-xl flex items-start text-2xl">
        Session Date: {readableSessionDate}
      </div>
      <ul className="w-full max-w-xl flex items-start text-2xl">
        Session Notes: {session.notes}
      </ul>
      <div className="flex">
        <Link
          className=" border rounded border-gray-500 px-2 inline-block m-4 text-lg"
          to={`/edit-session/${session.id}`}
        >
          Edit
        </Link>
        <button
          className="border rounded border-gray-500 px-2 inline-block m-4 text-lg"
          onClick={() => handleDeleteSession(session.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};
