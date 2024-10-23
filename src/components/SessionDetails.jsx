import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSessionById } from '../managers/practiceSessionManager';
import { getShowById } from '../managers/showManager';
import { getAllShowSongs } from '../managers/showSongManager';

export const SessionDetails = () => {
  const [setList, setSetList] = useState([]);
  const [show, setShow] = useState({});
  const [session, setSession] = useState({});
  const { sessionId } = useParams();

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

  const renderedSetList = setList.map((showSong) => {
    return <div key={showSong.id}>{showSong.song.title}</div>;
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
    <div>
      <div>Show: {session?.show?.description}</div>
      <div>Show Date: {readableShowDate}</div>
      <div>Setlist:</div>
      <div>{renderedSetList}</div>
      <div>Session Date: {readableSessionDate}</div>
      <div>Session Notes: {session.notes}</div>
    </div>
  );
};
