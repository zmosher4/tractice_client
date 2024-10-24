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
      const [month, day, year] = show.date.split('/');
      const [hours, minutes] = show.time.split(':');

      // Create date object in local time
      const localDateTime = new Date(
        parseInt(year),
        parseInt(month) - 1, // Month is 0-based
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
      alert('Please enter valid date (MM/DD/YYYY) and time values.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-4xl font-bold flex items-center justify-center">
        Add a show
      </h1>
      <div className="flex items-center justify-center flex-col m-8">
        <div className="flex flex-col flex-wrap justify-center space-x-4">
          <fieldset className="flex flex-col ml-4 mb-4">
            <label htmlFor="description">Details</label>
            <input
              type="text"
              id="description"
              name="description"
              placeholder="Show Description"
              required
              className="border rounded border-gray-400 p-4 w-[40rem]"
              value={show.description || ''}
              onChange={handleInputChange}
            />
          </fieldset>

          <fieldset className="flex flex-col mb-4">
            <label htmlFor="date">Performance Date</label>
            <input
              type="text"
              id="date"
              name="date"
              placeholder="MM/DD/YYYY"
              value={show.date || ''}
              onChange={handleInputChange}
              className="border rounded border-gray-400 p-4"
              required
            />
          </fieldset>

          <fieldset className="flex flex-col mb-4">
            <label htmlFor="time">Performance Time</label>
            <input
              type="time"
              id="time"
              name="time"
              value={show.time || ''}
              onChange={handleInputChange}
              className="border rounded border-gray-400 p-4"
              required
            />
          </fieldset>

          <fieldset className="flex flex-col mb-4">
            <label htmlFor="artist">Artist</label>
            <select
              value={show.artist_id}
              name="artist_id"
              id="artist"
              onChange={handleInputChange}
              required
              className="border rounded border-gray-400 p-4"
            >
              <option value="">Choose an Artist</option>
              {artists.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </fieldset>

          <fieldset className="flex flex-col mb-4">
            <label htmlFor="newArtist">Add New Artist</label>
            <input
              type="text"
              id="newArtist"
              placeholder="New Artist Name"
              value={newArtistName}
              onChange={handleNewArtistChange}
              className="border rounded border-gray-400 p-4"
            />
            <button
              onClick={handleAddArtist}
              className="mt-2 border rounded border-gray-400 px-4 py-2"
            >
              Add Artist
            </button>
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
