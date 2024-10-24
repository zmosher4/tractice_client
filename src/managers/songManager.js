const url = 'http://localhost:8000';

export const createSong = async (song) => {
  const res = await fetch(`${url}/songs`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${JSON.parse(localStorage.getItem('token')).token}`,
      'Content-type': 'application/json',
    },
    body: JSON.stringify(song),
  });
  const songData = await res.json();
  return songData;
};
