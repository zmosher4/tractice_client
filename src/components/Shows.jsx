import { useEffect, useState } from 'react';
import { deleteShow, getShows } from '../managers/showManager';
import { Link, useNavigate } from 'react-router-dom';
import { Artists } from './Artists';
import { useShows } from '../state/ShowsContext';

export const Shows = () => {
  const { myShows, getMyShows } = useShows();
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    await deleteShow(id);
    getMyShows();
  };

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

    return (
      <div
        className="m-4 border border-gray-700 shadow-md rounded w-[20rem] p-4 hover:translate-y-0.5 transition-transform"
        key={show.id}
      >
        <Link to={`/show/${show.id}`}>
          <div>{show.description}</div>
          <div>{readableDate}</div>
          <div>{show.artist.name}</div>
        </Link>

        <div className="flex justify-end space-x-5">
          <Link
            className="border rounded border-gray-500 px-2"
            to={`edit-show/${show.id}`}
          >
            {' '}
            edit{' '}
          </Link>
          <button
            className="border rounded border-gray-500 px-2"
            onClick={() => handleDelete(show.id)}
          >
            delete
          </button>
        </div>
      </div>
    );
  });

  return (
    <>
      <h1 className="flex items-center justify-center ml-5 mb-5 text-6xl font-bold">
        Upcoming Shows
      </h1>
      <button
        className="border rounded border-gray-500 px-2 m-4 active:translate-y-0.5 hover:bg-black hover:text-white transition-all"
        onClick={() => navigate('/new-show')}
      >
        New Show
      </button>
      <div className="flex justify-between">
        <div className="flex flex-col">{renderedShows}</div>
        <div>
          <Artists shows={myShows} />
        </div>
      </div>
    </>
  );
};
