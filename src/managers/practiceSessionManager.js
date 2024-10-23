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

export const getSessionById = async (id) => {
  const res = await fetch(`${url}/practicesessions/${id}`, {
    headers: {
      Authorization: `Token ${JSON.parse(localStorage.getItem('token')).token}`,
    },
  });
  const practiceSession = await res.json();
  return practiceSession;
};
