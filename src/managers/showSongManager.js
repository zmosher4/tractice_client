const url = 'http://localhost:8000';

export const getAllShowSongs = async () => {
  const res = await fetch(`${url}/showsongs`, {
    headers: {
      Authorization: `Token ${JSON.parse(localStorage.getItem('token')).token}`,
    },
  });
  const showSongs = await res.json();
  return showSongs;
};
