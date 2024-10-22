import { useEffect, useState } from 'react';
import { getAllArtists } from '../managers/artistManager';
import { createShow } from '../managers/showManager';
import { useNavigate } from 'react-router-dom';

export const NewShow = () => {
  const [artists, setArtists] = useState([]);
  const [show, setShow] = useState({});
  const navigate = useNavigate();

  const getArtists = async () => {
    const data = await getAllArtists();
    setArtists(data);
  };

  useEffect(() => {
    getArtists();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShow((prevShow) => ({
      ...prevShow,
      [name]: value,
    }));
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
        artist_id: parseInt(show.artist_id),
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
      <h1>Add a show</h1>
      <fieldset>
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          name="description"
          placeholder="Show Description"
          required
          value={show.description || ''}
          onChange={handleInputChange}
        />
      </fieldset>

      <fieldset>
        <label htmlFor="date">Performance Date</label>
        <input
          type="text"
          id="date"
          name="date"
          placeholder="MM/DD/YYYY"
          value={show.date || ''}
          onChange={handleInputChange}
          required
        />
      </fieldset>

      <fieldset>
        <label htmlFor="time">Performance Time</label>
        <input
          type="time"
          id="time"
          name="time"
          value={show.time || ''}
          onChange={handleInputChange}
          required
        />
      </fieldset>

      <fieldset>
        <label htmlFor="artist">Artist</label>
        <select
          value={show.artist_id || ''}
          name="artist_id"
          id="artist"
          onChange={handleInputChange}
          required
        >
          <option value="">Choose an Artist</option>
          {artists.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </fieldset>

      <button type="submit">Submit</button>
    </form>
  );
};
