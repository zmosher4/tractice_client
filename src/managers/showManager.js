const url = 'https://tractice-api-9kq3u.ondigitalocean.app';

export const getShows = async () => {
  const res = await fetch(`${url}/shows`, {
    headers: {
      Authorization: `Token ${JSON.parse(localStorage.getItem('token')).token}`,
    },
  });
  const shows = await res.json();
  return shows;
};

export const getShowById = async (id) => {
  const res = await fetch(`${url}/shows/${id}`, {
    headers: {
      Authorization: `Token ${JSON.parse(localStorage.getItem('token')).token}`,
    },
  });
  const show = await res.json();
  return show;
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

export const editShow = async (show) => {
  return await fetch(`${url}/shows/${show.id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Token ${JSON.parse(localStorage.getItem('token')).token}`,
      'Content-type': 'application/json',
    },
    body: JSON.stringify(show),
  });
};

export const deleteShow = async (id) => {
  await fetch(`${url}/shows/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Token ${JSON.parse(localStorage.getItem('token')).token}`,
      'Content-type': 'application/json',
    },
  });
};
