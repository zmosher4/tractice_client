const url = 'http://localhost:8000';

export const getShows = async () => {
  const res = await fetch(`${url}/shows`, {
    headers: {
      Authorization: `Token ${JSON.parse(localStorage.getItem('token')).token}`,
    },
  });
  const shows = await res.json();
  return shows;
};

export const createShow = async (showObj) => {
  return await fetch(`${url}/shows`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${JSON.parse(localStorage.getItem('token')).token}`,
      'Content-type': 'application/json',
    },
    body: JSON.stringify(showObj),
  });
};
