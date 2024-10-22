import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { editShow, getShowById } from '../managers/showManager';
import { getAllArtists } from '../managers/artistManager';

export const EditShow = () => {
  const [show, setShow] = useState({});
  const [artists, setArtists] = useState([]);
  const navigate = useNavigate();
  const { showId } = useParams();

  const getShow = async () => {
    const data = await getShowById(parseInt(showId));
    setShow(data);
  };
  const getArtists = async () => {
    const data = await getAllArtists();
    setArtists(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const editedShow = {
      id: show.id,
      description: show.description,
      performance_date: show.performance_date,
      artist_id: show.artist_id,
    };
    await editShow(editedShow);

    navigate('/');
  };
  useEffect(() => {
    getShow();
    getArtists();
  }, []);
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
            value={show.artist_id || show.artist?.id || ''}
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
