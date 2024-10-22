import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getShowById } from '../managers/showManager';

export const ShowDetails = () => {
  const [show, setShow] = useState();
  const { showId } = useParams();

  const getShow = async () => {
    const data = await getShowById(parseInt(showId));
    setShow(data);
  };

  useEffect(() => {
    getShow();
  }, []);

  const readableDate = show?.performance_date
    ? new Date(show.performance_date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
      })
    : 'Loading...';

  return (
    <>
      <div>Show Date: {readableDate}</div>
      <div>Artist: {show?.artist.name}</div>
      <div>
        <div>Description: {show?.description}</div>
      </div>
      <Link to={`/edit-show/${show?.id}`}>Edit</Link>
    </>
  );
};
