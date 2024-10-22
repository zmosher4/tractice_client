import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteShow, getShowById } from '../managers/showManager';

export const ShowDetails = () => {
  const [show, setShow] = useState();
  const { showId } = useParams();
  const navigate = useNavigate();

  const getShow = async () => {
    const data = await getShowById(parseInt(showId));
    setShow(data);
  };

  useEffect(() => {
    getShow();
  }, []);

  const handleDelete = async (id) => {
    await deleteShow(id);
    navigate('/');
  };

  const readableDate = show?.performance_date
    ? new Date(show.performance_date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : 'Loading...';

  return (
    <>
      <div>Show Date: {readableDate}</div>
      <div>Artist: {show?.artist.name}</div>
      <div>Description: {show?.description}</div>
      <Link to={`/edit-show/${show?.id}`}>Edit </Link>
      <button onClick={() => handleDelete(show.id)}> Delete</button>
    </>
  );
};
