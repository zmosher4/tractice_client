import { useEffect, useState } from 'react';
import { deleteShow, getShows } from '../managers/showManager';
import { Link, useNavigate } from 'react-router-dom';
import { Artists } from './Artists';
import { useShows } from '../state/ShowsContext';

export const Shows = () => {
  const { myShows, getMyShows } = useShows();
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);

  const handleDelete = async (id) => {
    await deleteShow(id);
    setRefresh((prev) => !prev);
  };

  useEffect(() => {
    getMyShows();
  }, [refresh]);

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
        className="m-4 border border-gray-700 shadow-lg rounded-lg w-[20rem] p-4 hover:shadow-xl transition-shadow"
        key={show.id}
      >
        <Link
          to={`/show/${show.id}`}
          className="block text-lg font-semibold mb-2 text-blue-600 hover:underline"
        >
          {show.description}
        </Link>
        <div className="text-gray-600">{readableDate}</div>
        <div className="text-gray-600">{show.artist.name}</div>

        <div className="flex justify-end space-x-3 mt-4">
          <Link
            className="border rounded border-gray-500 px-3 py-1 hover:bg-blue-500 hover:text-white transition"
            to={`edit-show/${show.id}`}
          >
            Edit
          </Link>
          <button
            className="border rounded border-red-500 px-3 py-1 text-red-500 hover:bg-red-500 hover:text-white transition"
            onClick={() => handleDelete(show.id)}
          >
            Delete
          </button>
        </div>
      </div>
    );
  });

  return (
    <div className="flex flex-col items-center">
      {myShows.length > 0 ? (
        <>
          <h1 className="text-6xl font-bold mb-5">Upcoming Shows</h1>
          <button
            className="border rounded border-gray-500 px-4 py-2 mb-4 bg-blue-800 text-white hover:bg-blue-700 transition"
            onClick={() => navigate('/new-show')}
          >
            New Show
          </button>
          <div className="flex justify-between w-full max-w-4xl">
            <div className="flex flex-col">{renderedShows}</div>
            <div className="border rounded border-gray-500 w-fit p-2 h-fit ">
              <Artists shows={myShows} />
            </div>
          </div>
        </>
      ) : (
        <h1 className="text-6xl font-bold">
          No shows yet! Add one{' '}
          <Link className="text-blue-500 underline" to="/new-show">
            here
          </Link>
        </h1>
      )}
    </div>
  );
};
