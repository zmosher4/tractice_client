import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createSession } from '../managers/practiceSessionManager';
import { createSong } from '../managers/songManager';
import { createShowSong } from '../managers/showSongManager';

export const NewSession = () => {
  const { showId } = useParams();
  const [session, setSession] = useState({});
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [song, setSong] = useState({ title: '', description: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSession((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSongTitleChange = (e) => {
    const copy = { ...song, title: e.target.value };
    setSong(copy);
  };

  const handleAddSong = () => {
    if (song.title.trim()) {
      // Only add if title is not empty
      const newSong = {
        ...song,
        id: `temp-${Date.now()}`, // Add temporary ID for deletion tracking
      };
      setSongs((prev) => [...prev, newSong]);
      setSong({ title: '', description: '' });
    }
  };

  const handleDeleteSong = (songId) => {
    setSongs((prev) => prev.filter((s) => s.id !== songId));
  };

  const postSongs = async () => {
    const songPromises = songs.map(async (song) => {
      const songRes = await createSong({
        title: song.title,
        description: song.description,
      });
      await createShowSong({
        song_id: songRes.id,
        show_id: parseInt(showId),
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

      const createdSession = {
        ...session,
        show_id: parseInt(showId),
        session_date: utcDateTime,
      };

      await postSongs();

      const sessionRes = await createSession(createdSession);
      const created = await sessionRes.json();
      navigate(`/session/${created?.id}`);
    } catch (error) {
      alert('Please enter valid date (MM/DD/YYYY) and time values.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md mx-auto"
    >
      <h1 className="text-4xl font-bold mb-6 text-center">Add a Session</h1>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="notes">
          Notes
        </label>
        <input
          type="text"
          id="notes"
          name="notes"
          placeholder="Session Notes"
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={session.notes || ''}
          onChange={handleInputChange}
        />
      </div>

      <h3 className="text-xl font-semibold mb-2">Add Songs</h3>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="song">
          Song Title
        </label>
        <input
          type="text"
          id="song"
          name="song"
          placeholder="Song Title"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={song.title}
          onChange={handleSongTitleChange}
        />
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
          onClick={handleAddSong}
        >
          Add Song
        </button>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold">Song List:</h4>
        <ul className="list-disc list-inside">
          {songs.map((song) => (
            <li key={song.id} className="flex items-center justify-between">
              <span>{song.title}</span>
              <button
                type="button"
                onClick={() => handleDeleteSong(song.id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="date">
          Session Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={session.date || ''}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="time">
          Session Time
        </label>
        <input
          type="time"
          id="time"
          name="time"
          value={session.time || ''}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div className="flex items-center justify-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Submit
        </button>
      </div>
    </form>
  );
};
