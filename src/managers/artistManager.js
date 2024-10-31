const url = 'https://tractice-api-9kq3u.ondigitalocean.app';
export const getAllArtists = async () => {
  const res = await fetch(`${url}/artists`, {
    headers: {
      Authorization: `Token ${JSON.parse(localStorage.getItem('token')).token}`,
    },
  });
  return await res.json();
};

export const createArtist = async (artist) => {
  const res = await fetch(`${url}/artists`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${JSON.parse(localStorage.getItem('token')).token}`,
      'Content-type': 'application/json',
    },
    body: JSON.stringify(artist),
  });
  const artistData = await res.json();
  return artistData;
};
