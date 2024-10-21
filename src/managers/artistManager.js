const url = 'http://localhost:8000';
export const getAllArtists = async () => {
  const res = await fetch(`${url}/artists`, {
    headers: {
      Authorization: `Token ${JSON.parse(localStorage.getItem('token')).token}`,
    },
  });
  return await res.json();
};
