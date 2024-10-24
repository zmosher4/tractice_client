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
  const handleSongNotesChange = (e) => {
    const copy = { ...song, description: e.target.value };
    setSong(copy);
  };

  const handleAddSong = () => {
    setSongs((prev) => [...prev, song]);
    setSong({ title: '', description: '' });
  };

  const postSongs = async () => {
    const songPromises = songs.map(async (song) => {
      const songRes = await createSong(song);
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
      // Parse the date and time inputs
      const [month, day, year] = session.date.split('/');
      const [hours, minutes] = session.time.split(':');

      // Create date object in local time
      const localDateTime = new Date(
        parseInt(year),
        parseInt(month) - 1, // Month is 0-based
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
    <form onSubmit={handleSubmit}>
      <h1 className="text-4xl font-bold flex items-center justify-center">
        Add a session
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
            <label htmlFor="song-notes">Song Notes (optional)</label>
            <input
              type="text"
              id="song-notes"
              name="song-nones"
              placeholder="Song Notes"
              className="border rounded border-gray-400 p-4 w-[40rem]"
              value={song.description}
              onChange={handleSongNotesChange}
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
              {songs.map((song, index) => (
                <li key={index}>{song.title}</li>
              ))}
            </ul>
          </div>
          <fieldset className="flex flex-col mb-4">
            <label htmlFor="date">Session Date</label>
            <input
              type="text"
              id="date"
              name="date"
              placeholder="MM/DD/YYYY"
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
