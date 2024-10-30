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
        className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-gray-200/80 mx-auto max-w-md"
        key={show.id}
      >
        <Link
          to={`/show/${show.id}`}
          className="inline-block text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 mb-4"
        >
          {show.description}
        </Link>

        <dl className="space-y-3 mb-6">
          <div className="flex items-center text-gray-600">
            <dt className="font-medium min-w-24">Date:</dt>
            <dd>{readableDate}</dd>
          </div>
          <div className="flex items-center text-gray-600">
            <dt className="font-medium min-w-24">Artist:</dt>
            <dd>{show.artist.name}</dd>
          </div>
        </dl>

        <div className="flex justify-end gap-3">
          <Link
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 active:bg-blue-700 transition-colors duration-200"
            to={`edit-show/${show.id}`}
          >
            Edit
          </Link>
          <button
            className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-500 active:bg-red-700 transition-colors duration-200"
            onClick={() => handleDelete(show.id)}
          >
            Delete
          </button>
        </div>
      </div>
    );
  });

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      {myShows.length > 0 ? (
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
              Upcoming Shows
            </h1>
          </div>

          <div className="flex justify-center">
            <button
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 active:bg-blue-700 shadow-sm transition-all duration-200"
              onClick={() => navigate('/new-show')}
            >
              New Show
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-2/3 p-6">
                <div className="grid gap-6 sm:grid-cols-2">{renderedShows}</div>
              </div>

              <div className="lg:w-1/3 border-t lg:border-t-0 lg:border-l border-gray-200/80">
                <div className="p-6 sticky top-0">
                  <Artists shows={myShows} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            No shows yet! Add one{' '}
            <Link
              className="text-blue-600 hover:text-blue-500 underline decoration-2 underline-offset-2"
              to="/new-show"
            >
              here
            </Link>
          </h1>
        </div>
      )}
    </div>
  );
};
