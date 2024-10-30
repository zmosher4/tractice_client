const url = 'https://tractice-app-7xpes.ondigitalocean.app';

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

export const deleteSong = async (songId) => {
  await fetch(`${url}/songs/${songId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Token ${JSON.parse(localStorage.getItem('token')).token}`,
    },
  });
};
