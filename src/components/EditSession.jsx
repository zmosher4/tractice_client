import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  editSession,
  getSessionById,
} from '../managers/practiceSessionManager';
import { createShowSong, getAllShowSongs } from '../managers/showSongManager';
import { createSong, deleteSong } from '../managers/songManager';

export const EditSession = () => {
  const { sessionId } = useParams();
  const [session, setSession] = useState({});
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [newSongs, setNewSongs] = useState([]);
  const [song, setSong] = useState({ title: '', description: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  const getSession = async () => {
    const sessionData = await getSessionById(parseInt(sessionId));
    const sessionDate = new Date(sessionData.session_date);
    const localDate = new Date(sessionDate.getTime());

    const formattedDate = localDate.toISOString().split('T')[0];
    const time = localDate.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });

    setSession({
      id: sessionData.id,
      notes: sessionData.notes,
      date: formattedDate,
      time: time,
      show_id: sessionData.show.id,
    });
  };

  const getSetList = async () => {
    try {
      // Only fetch if we're not in the middle of a delete operation
      if (!isDeleting) {
        const showSongData = await getAllShowSongs();
        const filteredShowSongs = showSongData.filter(
          (showSong) => showSong.show.id === session.show_id
        );
        const mappedSongs = filteredShowSongs.map((showSong) => showSong.song);
        setSongs(mappedSongs);
      }
    } catch (error) {
      console.error('Error fetching set list:', error);
    }
  };

  const handleSongTitleChange = (e) => {
    const copy = { ...song, title: e.target.value };
    setSong(copy);
  };

  const handleSongNotesChange = (e) => {
    const copy = { ...song, description: e.target.value };
    setSong(copy);
  };

  const handleAddSong = async () => {
    if (song.title) {
      const tempSong = { ...song, id: `temp-${Date.now()}` };
      setNewSongs((prev) => [...prev, tempSong]);
      setSong({ title: '', description: '' });
    }
  };

  const handleDeleteSong = async (songId) => {
    try {
      setIsDeleting(true);
      if (songId.toString().startsWith('temp-')) {
        setNewSongs((prev) => prev.filter((s) => s.id !== songId));
      } else {
        await deleteSong(songId);
        setSongs((prev) => prev.filter((s) => s.id !== songId));
      }
    } catch (error) {
      console.error('Error deleting song:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSession((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Initial load of session data
  useEffect(() => {
    getSession();
  }, [sessionId]);

  // Load set list when show_id is available and not deleting
  useEffect(() => {
    if (session.show_id && !isDeleting) {
      getSetList();
    }
  }, [session.show_id]);

  const postSongs = async () => {
    const songPromises = newSongs.map(async (song) => {
      const songRes = await createSong({
        title: song.title,
        description: song.description,
      });
      await createShowSong({
        song_id: songRes.id,
        show_id: parseInt(session.show_id),
      });
    });
    await Promise.all(songPromises);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const [year, month, day] = session.date.split('-');
      const [hours, minutes] = session.time.split(':');

      const localDateTime = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hours),
        parseInt(minutes)
      );

      const utcDateTime = localDateTime.toISOString();

      const editedSession = { ...session, session_date: utcDateTime };

      await postSongs();
      await editSession(editedSession);
      navigate(`/session/${sessionId}`);
    } catch (error) {
      console.error(error);
      alert('Please enter valid date and time values.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-4xl font-bold flex items-center justify-center">
        Edit a session
      </h1>
      <div className="flex items-center justify-center flex-col m-8">
        <div className="flex flex-col flex-wrap justify-center space-x-4">
          <fieldset className="flex flex-col ml-4 mb-4">
            <label htmlFor="notes">Notes</label>
            <input
              type="text"
              id="notes"
              name="notes"
              placeholder="Session Notes"
              required
              className="border rounded border-gray-400 p-4 w-[40rem]"
              value={session.notes || ''}
              onChange={handleInputChange}
            />
          </fieldset>
          <h3>Add Songs</h3>
          <fieldset className="flex flex-col ml-4 mb-4">
            <label htmlFor="song">Song Title</label>
            <input
              type="text"
              id="song"
              name="song"
              placeholder="Song Title"
              className="border rounded border-gray-400 p-4 w-[40rem]"
              value={song.title}
              onChange={handleSongTitleChange}
            />

            <button
              type="button"
              className="m-2 p-2 border rounded"
              onClick={handleAddSong}
            >
              Add Song
            </button>
          </fieldset>

          <div>
            <h4>Song List:</h4>
            <ul>
              {[...songs, ...newSongs].map((song) => (
                <div key={song.id}>
                  <li>{song.title}</li>
                  <button
                    type="button"
                    onClick={() => handleDeleteSong(song.id)}
                    className="text-red-500"
                  >
                    delete
                  </button>
                </div>
              ))}
            </ul>
          </div>
          <fieldset className="flex flex-col mb-4">
            <label htmlFor="date">Session Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={session.date || ''}
              onChange={handleInputChange}
              className="border rounded border-gray-400 p-4"
              required
            />
          </fieldset>

          <fieldset className="flex flex-col mb-4">
            <label htmlFor="time">Session Time</label>
            <input
              type="time"
              id="time"
              name="time"
              value={session.time || ''}
              onChange={handleInputChange}
              className="border rounded border-gray-400 p-4"
              required
            />
          </fieldset>
        </div>
        <button
          className="m-4 border rounded border-gray-400 px-9 py-2"
          type="submit"
        >
          Submit
        </button>
      </div>
    </form>
  );
};
