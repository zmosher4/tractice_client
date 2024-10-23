import { useEffect, useState } from 'react';
import { getShows } from '../managers/showManager';

export const Artists = ({ shows }) => {
  const uniqueArtists = Array.from(new Set(shows.map((s) => s.artist.name)));

  const renderedArtists = uniqueArtists.map((artist, index) => {
    return <li key={index}>{artist}</li>;
  });

  return (
    <div>
      <div>Artists I Play For:</div>
      <ul>{renderedArtists}</ul>
    </div>
  );
};
