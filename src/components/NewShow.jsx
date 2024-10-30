import { useEffect, useState } from 'react';
import { createArtist, getAllArtists } from '../managers/artistManager';
import { createShow } from '../managers/showManager';
import { useNavigate } from 'react-router-dom';

export const NewShow = () => {
  const [show, setShow] = useState({});
  const navigate = useNavigate();
  const [artists, setArtists] = useState([]);
  const [newArtistName, setNewArtistName] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShow((prevShow) => ({
      ...prevShow,
      [name]: value,
    }));
  };

  const getArtists = async () => {
    const data = await getAllArtists();
    const filteredArtists = data.filter(
      (a) => a.user.id === JSON.parse(localStorage.getItem('token')).id
    );
    setArtists(filteredArtists);
  };
  useEffect(() => {
    getArtists();
  }, []);

  const handleNewArtistChange = (e) => {
    setNewArtistName(e.target.value);
  };

  const handleAddArtist = async (e) => {
    e.preventDefault();
    await createArtist({ name: newArtistName });
    getArtists();
    setNewArtistName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Parse the date and time inputs
      const [year, month, day] = show.date.split('-');
      const [hours, minutes] = show.time.split(':');

      // Create date object in local time
      const localDateTime = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hours),
        parseInt(minutes)
      );

      // Convert to UTC ISO string for API
      const utcDateTime = localDateTime.toISOString();

      const createdShow = {
        ...show,
        performance_date: utcDateTime,
        artist_id: show.artist_id,
      };

      const res = await createShow(createdShow);
      const created = await res.json();
      navigate(`/show/${created?.id}`);
    } catch (error) {
      alert('Please enter valid date and time values.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md mx-auto"
    >
      <h1 className="text-4xl font-bold mb-6 text-center">Add a Show</h1>
      <div className="mb-4">
        <label
          className="block text-gray-700 font-bold mb-2"
          htmlFor="description"
        >
          Details
        </label>
        <input
          type="text"
          id="description"
          name="description"
          placeholder="Show Description"
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={show.description || ''}
          onChange={handleInputChange}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="date">
          Performance Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={show.date || ''}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="time">
          Performance Time
        </label>
        <input
          type="time"
          id="time"
          name="time"
          value={show.time || ''}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="artist">
          Artist
        </label>
        <select
          value={show.artist_id}
          name="artist_id"
          id="artist"
          onChange={handleInputChange}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Choose an Artist</option>
          {artists.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 font-bold mb-2"
          htmlFor="newArtist"
        >
          Add New Artist
        </label>
        <input
          type="text"
          id="newArtist"
          placeholder="New Artist Name"
          value={newArtistName}
          onChange={handleNewArtistChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <button
          onClick={handleAddArtist}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
        >
          Add Artist
        </button>
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
