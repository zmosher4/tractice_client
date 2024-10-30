const url = 'https://tractice-app-7xpes.ondigitalocean.app';

export const getAllShowSongs = async () => {
  const res = await fetch(`${url}/showsongs`, {
    headers: {
      Authorization: `Token ${JSON.parse(localStorage.getItem('token')).token}`,
    },
  });
  const showSongs = await res.json();
  return showSongs;
};

export const createShowSong = async (showSong) => {
  return await fetch(`${url}/showsongs`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${JSON.parse(localStorage.getItem('token')).token}`,
      'Content-type': 'application/json',
    },
    body: JSON.stringify(showSong),
  });
};
