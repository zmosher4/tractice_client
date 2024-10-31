import { useEffect, useState } from 'react';
import {
  deleteSession,
  getPracticeSessions,
} from '../managers/practiceSessionManager';
import { Link } from 'react-router-dom';
import { useShows } from '../state/ShowsContext';
import { useSessions } from '../state/SessionsContext';
import { Calendar } from './Calendar';

export const Sessions = () => {
  const { mySessions, loading, handleDeleteSession, refreshSessions } =
    useSessions();
  const { myShows, getMyShows } = useShows();

  useEffect(() => {
    getMyShows();
    refreshSessions();
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

    return (
      <div
        className="m-4 border border-gray-700 shadow-md rounded w-[20rem] p-4"
        key={show.id}
      >
        <div>
          <div>{show.description}</div>
          <div>{readableDate}</div>
          <div>Artist: {show.artist.name}</div>
        </div>
        <Link
          className="border rounded border-gray-500 px-2"
          to={`/session/${show.id}/create`}
        >
          New Session
        </Link>
      </div>
    );
  });

  const renderedSessions = mySessions.map((s) => {
    const readableShowDate = new Date(s.show?.performance_date).toLocaleString(
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
    const readableSessionDate = new Date(s.session_date).toLocaleString(
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
        key={s.id}
        className="m-4 p-4 w-full max-w-md border border-gray-300 bg-white shadow-lg rounded-lg transition-transform hover:shadow-xl hover:-translate-y-1"
      >
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <>
            <Link to={`/session/${s.id}`} className="block mb-4">
              <div className="text-lg font-semibold text-gray-700 mb-1">
                {s.show?.description}
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-medium">Show Date:</span>{' '}
                {readableShowDate}
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-medium">Artist:</span>{' '}
                {s.show?.artist?.name}
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-medium">Session Date:</span>{' '}
                {readableSessionDate}
              </div>
              <div className="text-sm text-gray-600 mt-2">
                <span className="font-medium">Notes:</span> {s.notes}
              </div>
            </Link>
            <div className="flex justify-end space-x-4">
              <Link
                to={`/edit-session/${s.id}`}
                className="px-3 py-1 border border-blue-500 text-blue-500 rounded hover:bg-blue-100 transition"
              >
                Edit
              </Link>
              <button
                className="px-3 py-1 border border-red-500 text-red-500 rounded hover:bg-red-100 transition"
                onClick={async () => {
                  handleDeleteSession(s.id);
                  await refreshSessions();
                }}
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    );
  });

  return (
    <div className="space-y-12 p-8">
      <h1 className="text-center text-4xl font-bold text-gray-800">
        My Sessions
      </h1>

      {loading ? (
        <div className="flex justify-center items-center text-2xl text-gray-600">
          Loading sessions...
        </div>
      ) : (
        <>
          {renderedSessions.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {renderedSessions}
            </div>
          ) : (
            <div className="flex flex-col items-center text-2xl text-gray-600">
              <p>
                No sessions yet. Create a show to make sessions
                <Link
                  className="ml-1.5 text-blue-500 underline hover:text-blue-600"
                  to="/new-show"
                >
                  here
                </Link>
              </p>
              {myShows.length > 0 && (
                <div className="text-center text-xl mt-6">
                  <p>Or choose from your shows below to create a session</p>
                  <div className="flex flex-wrap justify-center mt-4 space-x-4">
                    {renderedShows}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
      <div className="m-10">
        <Calendar />
      </div>
    </div>
  );
};
