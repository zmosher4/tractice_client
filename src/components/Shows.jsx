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
    return (
      <div key={show.id}>
        <div>{show.description}</div>
        <div>{show.performance_date}</div>
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
