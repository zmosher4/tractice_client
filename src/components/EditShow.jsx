import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { editShow, getShowById } from '../managers/showManager';
import { createArtist, getAllArtists } from '../managers/artistManager';

export const EditShow = () => {
  const [show, setShow] = useState({
    description: '',
    date: '',
    time: '',
    artist_id: 0,
  });
  const [artists, setArtists] = useState([]);
  const [newArtistName, setNewArtistName] = useState('');
  const navigate = useNavigate();
  const { showId } = useParams();

  //get show data and set local show state based on the id in the url
  const getShow = async () => {
    const data = await getShowById(parseInt(showId));

    const performanceDate = new Date(data.performance_date);

    const localYear = performanceDate.getFullYear();
    const localMonth = performanceDate.getMonth() + 1;
    const localDate = performanceDate.getDate();

    const formattedDate = [
      localYear,
      String(localMonth).padStart(2, '0'),
      String(localDate).padStart(2, '0'),
    ].join('-');

    const time = performanceDate.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });

    setShow({
      description: data.description,
      date: formattedDate,
      time: time,
      artist_id: data.artist.id,
    });
  };

  //get artists assigned to the logged in user and set the local state to those artists
  const getArtists = async () => {
    const data = await getAllArtists();
    const filteredArtists = data.filter(
      (a) => a.user.id === JSON.parse(localStorage.getItem('token')).id
    );
    setArtists(filteredArtists);
  };

  //fetch and set artists and shows on initial render
  useEffect(() => {
    getShow();
    getArtists();
  }, []);

  //handling show input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShow((prevShow) => ({
      ...prevShow,
      [name]: value,
    }));
  };

  //setting new added artist name to local state
  const handleNewArtistChange = (e) => {
    setNewArtistName(e.target.value);
  };

  //posting the added artist to artist database and clearing the input
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

      const editedShow = {
        id: showId,
        description: show.description,
        performance_date: utcDateTime,
        artist_id: show.artist_id,
      };

      await editShow(editedShow);
      navigate(`/show/${showId}`);
    } catch (error) {
      alert('Please enter valid date and time values.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 w-full max-w-md mx-auto"
    >
      <h1 className="text-4xl font-bold mb-6 text-center">Edit Show</h1>

      <div className="flex flex-col space-y-4">
        <fieldset className="flex flex-col mb-4">
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
            value={show.description}
            onChange={handleInputChange}
          />
        </fieldset>

        <fieldset className="flex flex-col mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="date">
            Performance Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={show.date}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </fieldset>

        <fieldset className="flex flex-col mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="time">
            Performance Time
          </label>
          <input
            type="time"
            id="time"
            name="time"
            value={show.time}
            onChange={handleInputChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </fieldset>

        <fieldset className="flex flex-col mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="artist"
          >
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
        </fieldset>

        <fieldset className="flex flex-col mb-4">
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
            className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Artist
          </button>
        </fieldset>
      </div>

      <div className="flex items-center justify-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-9"
          type="submit"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};
