import { useEffect, useState } from 'react';
import { getShows } from '../managers/showManager';

export const Artists = ({ shows }) => {
  const uniqueArtists = Array.from(new Set(shows.map((s) => s.artist.name)));

  const renderedArtists = uniqueArtists.map((artist, index) => (
    <li key={index} className="py-1 border-b border-gray-200">
      {artist}
    </li>
  ));

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      {renderedArtists.length > 0 ? (
        <>
          <h3 className="text-lg font-semibold mb-2">Artists I Play For:</h3>
          <ul className="list-disc pl-5">{renderedArtists}</ul>
        </>
      ) : (
        <p className="text-gray-500">No artists to display.</p>
      )}
    </div>
  );
};
