import { useEffect, useState } from 'react';
import { deleteShow, getShows } from '../managers/showManager';
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
    const readableDate = new Date(show.performance_date).toLocaleString(
      'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }
    );

    const handleDelete = async (id) => {
      await deleteShow(id);
      getMyShows();
    };

    return (
      <div key={show.id}>
        <div>
          <Link to={`/show/${show.id}`}>{show.description}</Link>
          <Link to={`edit-show/${show.id}`}> edit </Link>
          <button onClick={() => handleDelete(show.id)}>delete</button>
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
