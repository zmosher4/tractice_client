const url = 'http://localhost:8000';

export const getPracticeSessions = async () => {
  const res = await fetch(`${url}/practicesessions`, {
    headers: {
      Authorization: `Token ${JSON.parse(localStorage.getItem('token')).token}`,
    },
  });
  const practiceSessions = await res.json();
  return practiceSessions;
};
