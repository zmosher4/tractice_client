import { useEffect, useState } from 'react';
import { getShows } from '../managers/showManager';
import { Link, useNavigate } from 'react-router-dom';

export const Shows = () => {
  const [myShows, setMyShows] = useState([]);
  const navigate = useNavigate();

  const getMyShows = async () => {
    const data = await getShows();
    const filteredShows = data.filter(
      (show) => show.user.id === JSON.parse(localStorage.getItem('token')).id
    );
    setMyShows(filteredShows);
  };

  useEffect(() => {
    getMyShows();
  }, []);

  const renderedShows = myShows.map((show) => {
    const dateObj = new Date(show.performance_date);
    const readableDate = dateObj.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long', // 'long' for full month name, 'short' for abbreviated month
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short', // Optional: Include the time zone (like "UTC" or "PDT")
    });
    return (
      <div key={show.id}>
        {' '}
        <div>
          <Link to={`/show/${show.id}`}> {show.description} </Link>{' '}
          <Link to={`edit-show/${show.id}`}>edit</Link>{' '}
        </div>
        <div>{readableDate}</div>
        <div>{show.artist.name}</div>
      </div>
    );
  });
  return (
    <>
      <h1 className="text-4xl">Upcoming Shows</h1>

      <button onClick={() => navigate('/new-show')}>New Show</button>

      <div>{renderedShows}</div>
    </>
  );
};
