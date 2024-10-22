import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { editShow, getShowById } from '../managers/showManager';
import { getAllArtists } from '../managers/artistManager';

export const EditShow = () => {
  const [show, setShow] = useState({
    description: '',
    date: '',
    time: '',
    artist_id: '',
  });
  const [artists, setArtists] = useState([]);
  const navigate = useNavigate();
  const { showId } = useParams();

  const getShow = async () => {
    const data = await getShowById(parseInt(showId));

    // Convert UTC date to local date for form
    const performanceDate = new Date(data.performance_date);
    const localDate = new Date(performanceDate.getTime());

    // Format date as MM/DD/YYYY
    const date = localDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    // Format time as HH:mm in 24-hour format
    const time = localDate.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });

    setShow({
      description: data.description,
      date: date,
      time: time,
      artist_id: data.artist.id,
    });
  };

  const getArtists = async () => {
    const data = await getAllArtists();
    setArtists(data);
  };

  useEffect(() => {
    getShow();
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

      const editedShow = {
        id: showId,
        description: show.description,
        performance_date: utcDateTime,
        artist_id: show.artist_id,
      };

      await editShow(editedShow);
      navigate(`/show/${showId}`);
    } catch (error) {
      alert('Please enter valid date (MM/DD/YYYY) and time values.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Edit Show</h1>

      <fieldset>
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          name="description"
          placeholder="Show Description"
          required
          value={show.description}
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
          value={show.date}
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
          value={show.time}
          onChange={handleInputChange}
          required
        />
      </fieldset>

      <fieldset>
        <label htmlFor="artist">Artist</label>
        <select
          value={show.artist_id}
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

      <button type="submit">Save Changes</button>
    </form>
  );
};
