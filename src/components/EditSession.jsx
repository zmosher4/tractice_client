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
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-8 m-4 max-w-lg mx-auto"
    >
      <h1 className="text-4xl font-bold text-center mb-6">Edit a Session</h1>
      <div className="flex flex-col space-y-6">
        <fieldset className="flex flex-col">
          <label htmlFor="notes" className="font-medium mb-2">
            Notes
          </label>
          <input
            type="text"
            id="notes"
            name="notes"
            placeholder="Session Notes"
            required
            className="border rounded border-gray-300 p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={session.notes || ''}
            onChange={handleInputChange}
          />
        </fieldset>

        <fieldset className="flex flex-col">
          <h3 className="font-semibold mb-2">Add Songs</h3>
          <label htmlFor="song" className="font-medium mb-2">
            Song Title
          </label>
          <input
            type="text"
            id="song"
            name="song"
            placeholder="Song Title"
            className="border rounded border-gray-300 p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={song.title}
            onChange={handleSongTitleChange}
          />
          <button
            type="button"
            className="mt-2 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-500 transition"
            onClick={handleAddSong}
          >
            Add Song
          </button>
        </fieldset>

        <div>
          <h4 className="font-semibold mb-2">Song List:</h4>
          <ul className="list-disc pl-5">
            {[...songs, ...newSongs].map((song) => (
              <li key={song.id} className="flex justify-between items-center">
                {song.title}
                <button
                  type="button"
                  onClick={() => handleDeleteSong(song.id)}
                  className="text-red-600 hover:text-red-500"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        <fieldset className="flex flex-col">
          <label htmlFor="date" className="font-medium mb-2">
            Session Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={session.date || ''}
            onChange={handleInputChange}
            className="border rounded border-gray-300 p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </fieldset>

        <fieldset className="flex flex-col">
          <label htmlFor="time" className="font-medium mb-2">
            Session Time
          </label>
          <input
            type="time"
            id="time"
            name="time"
            value={session.time || ''}
            onChange={handleInputChange}
            className="border rounded border-gray-300 p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </fieldset>

        <button
          className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-500 transition"
          type="submit"
        >
          Submit
        </button>
      </div>
    </form>
  );
};
