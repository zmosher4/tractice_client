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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const createdShow = await createShow(show);
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Add a show</h1>
      <fieldset>
        <label htmlFor="description">
          <input
            type="text"
            id="description"
            placeholder="Show Description"
            required
            value={show.description || ''}
            onChange={(e) => {
              const copy = { ...show };
              copy.description = e.target.value;
              setShow(copy);
            }}
          />
        </label>
      </fieldset>
      <fieldset>
        <label htmlFor="performance_date">
          <input
            type="text"
            id="performance_date"
            placeholder="MM/DD/YYYY"
            required
            value={show.rawInput || ''}
            onChange={(e) => {
              const copy = { ...show };
              let inputDate = e.target.value;

              // Save the raw input in state to keep the input field editable
              copy.rawInput = inputDate;

              // Only format the date if it's valid
              const [month, day, year] = inputDate.split('/');
              if (
                month &&
                day &&
                year &&
                month.length === 2 &&
                day.length === 2 &&
                year.length === 4
              ) {
                const formattedDate = new Date(
                  `${year}-${month}-${day}T21:00:00Z`
                );
                if (!isNaN(formattedDate)) {
                  const performance_date = formattedDate.toISOString();
                  copy.performance_date = performance_date;
                }
              }

              setShow(copy);
            }}
          />
        </label>
      </fieldset>
      <fieldset>
        <label htmlFor="artist">
          <select
            value={show.artist_id}
            required
            name="artist"
            id="artist"
            onChange={(e) => {
              const copy = { ...show };
              copy.artist_id = parseInt(e.target.value);
              setShow(copy);
            }}
          >
            <option value="">Choose an Artist</option>
            {artists.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </label>
      </fieldset>
      <button type="submit">Submit</button>
    </form>
  );
};
